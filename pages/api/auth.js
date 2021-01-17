import { supabase } from '../../libs/initSupabase'

export default function handler(req, res) {
  supabase.auth.api.setAuthCookie(req, res)
}
