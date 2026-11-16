const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kcqyhgnajfqhjixlhlqp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("Missing Supabase Key!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  try {
    const { data: users, error: uErr } = await supabase.from('users').select('*');
    console.log(`=== USERS (${users ? users.length : 0}) ===`);
    if (users) console.log(users);

    const { data: habits, error: hErr } = await supabase.from('habits').select('*');
    console.log(`\n=== HABITS (${habits ? habits.length : 0}) ===`);
    if (habits) console.log(habits.map(h => ({ id: h.id, title: h.title, active: h.active, user_id: h.user_id })));

    const { data: entries, error: eErr } = await supabase.from('habit_entries').select('*');
    console.log(`\n=== ENTRIES (${entries ? entries.length : 0}) ===`);
    if (entries) console.log(entries.map(e => ({ id: e.id, habit_id: e.habit_id, completed: e.completed, entry_date: e.entry_date })));
  } catch (error) {
    console.error("Error running check:", error);
  }
}

check();
