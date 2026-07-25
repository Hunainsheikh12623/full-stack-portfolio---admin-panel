import 'dotenv/config';
import { saveStore, seedData } from '../server/store.js';

await saveStore(seedData);
console.log('Seeded Supabase with the portfolio data from server/initialData.ts.');
