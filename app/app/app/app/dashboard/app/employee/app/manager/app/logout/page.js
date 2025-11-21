'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.signOut().then(() => router.push('/'))
  }, [])

  return <p>Logging out...</p>
}
