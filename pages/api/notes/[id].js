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

    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
    if (deleteError) console.log('Error while deleting:', deleteError)

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    if (!user || user.id !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    const updated = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: new Date(),
      body: (req.body.body || '').slice(0, 2048),
      created_by: user.id,
    }

    const { error: updateError } = await supabase
      .from('notes')
      .update(updated)
      .eq('id', id)
    if (updateError) console.log('Error while updating:', updateError)

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}
