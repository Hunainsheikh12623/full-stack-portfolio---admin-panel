import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PortfolioData } from '../src/types.js';
import { initialPortfolioData } from './initialData.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const STATE_TABLE = 'portfolio_state';
const STORAGE_BUCKET = 'portfolio-media';

function requireConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY || !ADMIN_EMAIL) {
    throw new Error('Missing Supabase configuration. Set SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, and ADMIN_EMAIL in .env.local.');
  }
}

requireConfig();

export const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
});

const supabaseAuth = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
});

function withoutLegacyPassword(data: PortfolioData): PortfolioData {
  const { adminPassword: _adminPassword, ...profile } = data.profile;
  return { ...data, profile };
}

export async function initStore(): Promise<PortfolioData> {
  const { data, error } = await supabaseAdmin
    .from(STATE_TABLE)
    .select('data')
    .eq('id', 'primary')
    .single();

  if (error || !data) {
    throw new Error(`Could not load Supabase portfolio data. Run the SQL migration and \`npm run db:seed\`. ${error?.message || ''}`.trim());
  }

  return withoutLegacyPassword(data.data as PortfolioData);
}

export async function saveStore(data: PortfolioData): Promise<void> {
  const { error } = await supabaseAdmin
    .from(STATE_TABLE)
    .upsert({ id: 'primary', data: withoutLegacyPassword(data), updated_at: new Date().toISOString() });

  if (error) throw new Error(`Could not save portfolio data to Supabase: ${error.message}`);
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL) throw new Error('This user is not authorized to administer the portfolio.');
  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error(error?.message || 'Unable to sign in.');
  return data.session.access_token;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return !error && data.user?.email?.toLowerCase() === ADMIN_EMAIL;
}

export async function uploadMedia(fileName: string, fileUrl: string, fileType: string): Promise<string> {
  if (!fileUrl.startsWith('data:')) return fileUrl;

  const match = fileUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid media upload format.');

  const extension = fileName.includes('.') ? '' : `.${match[1].split('/')[1] || 'bin'}`;
  const objectPath = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}${extension}`;
  const bytes = Buffer.from(match[2], 'base64');
  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).upload(objectPath, bytes, {
    contentType: fileType || match[1],
    upsert: false
  });
  if (error) throw new Error(`Could not upload media: ${error.message}`);

  return supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

export async function deleteStoredMedia(fileUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = fileUrl.indexOf(marker);
  if (index === -1) return;
  const objectPath = decodeURIComponent(fileUrl.slice(index + marker.length));
  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([objectPath]);
  if (error) throw new Error(`Could not delete media: ${error.message}`);
}

export const seedData = withoutLegacyPassword(initialPortfolioData);
