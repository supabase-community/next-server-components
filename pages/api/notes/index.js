import sendRes from '../../../libs/send-res-with-module-map'
import { supabase } from '../../../libs/initSupabase'

export default async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (req.method === 'GET') {
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .order('id')

    return res.send(notes)
  }

  if (req.method === 'POST') {
    if (!user) {
      return res.status(403).send('Unauthorized')
    }

    const newNote = {
      title: (req.body.title || '').slice(0, 255),
      body: (req.body.body || '').slice(0, 2048),
      created_by: user.id,
    }

    const { data: note, error } = await supabase
      .from('notes')
      .insert([newNote])
      .single()

    return sendRes(req, res, note.id)
  }

  return res.send('Method not allowed.')
}
