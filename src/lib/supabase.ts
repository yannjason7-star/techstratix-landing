import { createClient } from '@supabase/supabase-js'

// On utilise les noms des variables d'environnement. 
// L'ordinateur ira chercher les vraies valeurs dans le fichier .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)