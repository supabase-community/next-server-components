import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'
import { supabase } from '../../../libs/initSupabase'

export default async (req, res) => {
  // @todo: add auth
  // session(req, res)
  const id = +req.query.id
  // const login = req.session.login

  const { data: note, error } = await supabase
    .from('notes')
    .select()
    .eq('id', id)
    .single()
    
  if (error) {
    console.log('error', error)
    return res.send('Method not allowed.')
  }

  if (req.method === 'GET') {
    return res.send(note)
  }

  if (req.method === 'DELETE') {
    // if (!login || login !== note.created_by) {
    //   return res.status(403).send('Unauthorized')
    // }

    const { data: note, error } = await supabase.from('notes').delete()

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    // if (!login || login !== note.created_by) {
    //   return res.status(403).send('Unauthorized')
    // }

    const updated = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048),
      // created_by: login,
    }

    const { data: note, error } = await supabase
      .from('notes')
      .update(updated)
      .eq('id', id)

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}
