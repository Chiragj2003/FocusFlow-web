/* ==================== ORIGINAL CODE START ====================
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { ALL_ACHIEVEMENTS } from '../src/lib/constants';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Seeding achievements (challenges) into the database...');

  const { error } = await supabase
    .from('challenges')
    .upsert(ALL_ACHIEVEMENTS.map(ach => ({
      challenge_id: ach.id,
      title: ach.title,
      description: ach.description,
      target: ach.target,
      reward: ach.reward,
      duration: ach.duration,
      type: ach.type,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString() // 1 year from now
    })));

  if (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }

  console.log(`Successfully seeded ${ALL_ACHIEVEMENTS.length} achievements!`);
  process.exit(0);
}

main();
==================== ORIGINAL CODE END ==================== */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { ALL_ACHIEVEMENTS } from '../src/lib/constants';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Seeding achievements (challenges) into the database...');

  const rows = ALL_ACHIEVEMENTS.map((ach) => ({
    challenge_id: ach.id,
    title: ach.title,
    description: ach.description,
    target: ach.target,
    reward: ach.reward,
    duration: ach.duration,
    type: ach.type,
    active: true,
  }));

  const { error } = await supabase
    .from('challenges')
    .upsert(rows, { onConflict: 'challenge_id' });

  if (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }

  // Confirm row count
  const { count, error: countError } = await supabase
    .from('challenges')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.warn('Could not fetch exact row count:', countError.message);
  } else {
    console.log(`Confirmed row count in challenges table: ${count}`);
  }

  console.log(`Successfully seeded ${ALL_ACHIEVEMENTS.length} achievements!`);
  process.exit(0);
}

main();
