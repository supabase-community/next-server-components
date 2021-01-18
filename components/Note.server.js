import React from 'react'
import { fetch } from 'react-fetch'
import { format } from 'date-fns'

import NotePreview from './NotePreview'
import NoteEditor from './NoteEditor.client'
import AuthButton from './AuthButton.server'

const endpoint = process.env.ENDPOINT

export default function Note({ selectedId, isEditing, login }) {
  const note =
    selectedId != null
      ? fetch(`${endpoint}/api/notes/${selectedId}`).json()
      : null

  if (note === null) {
    if (isEditing) {
      return <NoteEditor noteId={null} initialTitle="Untitled" initialBody="" />
    } else {
      return (
        <div className="note--empty-state">
          <span className="note-text--empty-state">
            Click a note on the left to view something!
          </span>
        </div>
      )
    }
  }

  const { id, title, body, updated_at, created_by } = note
  const updatedAt = new Date(updated_at)

  if (isEditing) {
    return <NoteEditor noteId={id} initialTitle={title} initialBody={body} />
  } else {
    return (
      <div className="note">
        <div className="note-header">
          <h1 className="note-title">{title}</h1>
          <div className="note-menu" role="menubar">
            <small className="note-updated-at" role="status">
              Last updated on {format(updatedAt, "d MMM yyyy 'at' h:mm bb")}
            </small>
            {login && login.id === created_by ? (
              <AuthButton login={login} noteId={id}>
                Edit
              </AuthButton>
            ) : (
              <div style={{ height: 30 }} />
            )}
          </div>
        </div>
        <NotePreview body={body} />
      </div>
    )
  }
}
