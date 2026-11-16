/**
 * Creates the active challenge rows (constants.ts -> ACTIVE_CHALLENGE_IDS) in Supabase.
 * Safe to run more than once: existing rows are reused, only missing ones are added.
 * The API also does this on first use, so running this is optional.
 *
 *   npx tsx scripts/seed-achievements.ts
 */
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(1)
  }
  // Imported after dotenv so the Supabase client sees the env vars
  const { getCatalog } = await import('../src/lib/challengeCatalog')
  const catalog = await getCatalog()
  console.log(`Challenges ready: ${catalog.size}`)
}

main().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
