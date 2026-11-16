
const url = 'https://kcqyhgnajfqhjixlhlqp.supabase.co/rest/v1';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function clearTable(tableName) {
  const res = await fetch(`${url}/${tableName}?id=not.is.null`, {
    method: 'DELETE',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  console.log('Cleared', tableName, res.status);
}

async function run() {
  await clearTable('habit_entries');
  await clearTable('focus_sessions');
  await clearTable('badges');
  await clearTable('habits');
  console.log('Database cleared.');
}
run();
