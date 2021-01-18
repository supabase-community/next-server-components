import React, { unstable_useTransition, useState } from 'react'
import { Auth, Modal, Button } from '@supabase/ui'

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
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <Modal
        visible={modalVisible}
        layout="vertical"
        size="small"
        customFooter={[
          <Button onClick={() => setModalVisible(false)}>Close</Button>,
        ]}
      >
        <Auth
          supabaseClient={supabase}
          providers={['github']}
          socialLayout="horizontal"
          socialButtonSize="xlarge"
        />
      </Modal>
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
            setModalVisible(true)
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
    </>
  )
}
