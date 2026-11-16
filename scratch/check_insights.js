const { dbInsightsSummary } = require('../src/lib/db');
require('dotenv').config();

async function check() {
  const userId = 'user_3EEE7SYBL6aV3FZok2DUOAyFdPc';
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  
  console.log(`Running dbInsightsSummary for ${userId} from ${start} to ${end}`);
  const summary = await dbInsightsSummary(userId, start, end);
  console.log(JSON.stringify(summary, null, 2));
}

check();
