const SUPABASE_URL = "https://rgswtegsanbwtajqhmgy.supabase.co"

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

const { createClient } = window.supabase

window.db = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

console.log("Supabase connected")
console.log(window.db)
