import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'
import { supabase } from '../../../libs/initSupabase'

export default async (req, res) => {
  // @todo: add auth
  // session(req, res)

  if (req.method === 'GET') {

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .order('id')
      
    return res.send(notes)
  }

  if (req.method === 'POST') {
    // @todo: add auth
    // const login = req.session.login

    // if (!login) {
    //   return res.status(403).send('Unauthorized')
    // }

    const newNote = {
      title: (req.body.title || '').slice(0, 255),
      body: (req.body.body || '').slice(0, 2048),
      created_by: 'login',
    }

    const { data: note, error } = await supabase
      .from('notes')
      .insert([newNote])
      .single()

    return sendRes(req, res, note.id)
  }

  return res.send('Method not allowed.')
}
