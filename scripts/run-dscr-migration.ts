import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function runMigration() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const migrationSQL = readFileSync(
    join(__dirname, '../supabase/migrations/20260221000000_dscr_client_configs.sql'),
    'utf-8'
  )
  
  console.log('Running DSCR client configs migration...')
  
  const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
  
  if (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
  
  console.log('✅ Migration completed successfully')
  console.log('Verifying table...')
  
  const { data: configs, error: fetchError } = await supabase
    .from('dscr_client_configs')
    .select('*')
  
  if (fetchError) {
    console.error('Failed to fetch configs:', fetchError)
  } else {
    console.log(`Found ${configs?.length || 0} client configurations`)
    if (configs && configs.length > 0) {
      console.log('Sample:', configs[0])
    }
  }
}

runMigration().catch(console.error)
