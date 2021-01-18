import { useState, useEffect, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useServerResponse } from './Cache.client'
import { LocationContext } from './LocationContext.client'

import { supabase } from '../libs/initSupabase'

export default function Root() {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        fetch('/api/auth', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ event, session }),
        }).then(res => res.json())
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <ErrorBoundary FallbackComponent={Error}>
        <Content />
      </ErrorBoundary>
    </Suspense>
  )
}

function Content() {
  const [location, setLocation] = useState({
    selectedId: null,
    isEditing: false,
    searchText: '',
  })
  const response = useServerResponse(location)
  const root = response.readRoot()

  return (
    <LocationContext.Provider value={[location, setLocation]}>
      {root}
    </LocationContext.Provider>
  )
}

function Error({ error }) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
    </div>
  )
}
