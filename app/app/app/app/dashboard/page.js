'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/')
    
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
    
    if (data.role === 'manager' || data.role === 'admin') {
      router.push('/manager')
    } else {
      router.push('/employee')
    }
  }

  return (
    <div className="p-4">
      <h1>Welcome, {profile?.full_name}!</h1>
      <Link href="/logout" className="text-primary underline">Logout</Link>
    </div>
  )
}
