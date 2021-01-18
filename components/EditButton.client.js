import React, { unstable_useTransition } from 'react'

import { useLocation } from './LocationContext.client'
import { supabase } from '../libs/initSupabase'

export default function EditButton({
  login,
  noteId,
  disabled,
  title,
  children,
}) {
  const [, setLocation] = useLocation()
  const [startTransition, isPending] = unstable_useTransition()
  const isDraft = noteId == null
  return (
    <button
      className={[
        'edit-button',
        isDraft ? 'edit-button--solid' : 'edit-button--outline',
      ].join(' ')}
      disabled={isPending || disabled}
      title={title}
      onClick={async () => {
        if (login) {
          // login needed
          const { error } = await supabase.auth.signIn({ provider: 'github' })
          if (error) alert(error.message)
          return
        }
        if (isDraft) {
          // hide the sidebar
          const sidebarToggle = document.getElementById('sidebar-toggle')
          if (sidebarToggle) {
            sidebarToggle.checked = true
          }
        }
        startTransition(() => {
          setLocation(loc => ({
            selectedId: noteId,
            isEditing: true,
            searchText: loc.searchText,
          }))
        })
      }}
      role="menuitem"
    >
      {children}
    </button>
  )
}
