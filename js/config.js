const SUPABASE_URL = "https://rgswtegsanbwtajqhmgy.supabase.co"

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

window.db = null

document.addEventListener("DOMContentLoaded", () => {

    if(typeof supabase === "undefined"){
        console.error("Supabase library not loaded")
        return
    }

    window.db = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    )

    console.log("Supabase ready")

})
