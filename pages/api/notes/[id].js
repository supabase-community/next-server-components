import sendRes from '../../../libs/send-res-with-module-map'
import { supabase } from '../../../libs/initSupabase'

export default async (req, res) => {
  const id = +req.query.id
  const { user } = await supabase.auth.api.getUserByCookie(req)

  const { data: note, error } = await supabase
    .from('notes')
    .select()
    .eq('id', id)
    .single()

  if (error) {
    console.log('error', error.message)
    return res.send(error.message)
  }

  if (req.method === 'GET') {
    return res.send(note)
  }

  if (req.method === 'DELETE') {
    if (!user || user.id !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    await supabase.from('notes').delete()

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    if (!user || user.id !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }
    console.log('put id', id)

    const updated = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048),
      created_by: user.id,
    }

    await supabase.from('notes').update(updated).eq('id', id)

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}
