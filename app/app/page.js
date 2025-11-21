'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async () => {
    const { data, error } = isSignUp 
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: email.split('@')[0] } } })
      : await supabase.auth.signInWithPassword({ email, password })
    
    if (error) alert(error.message)
    else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button onClick={handleAuth} className="w-full bg-primary text-white p-2 rounded mb-4">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-primary underline">
          {isSignUp ? 'Already have account? Login' : 'No account? Sign Up'}
        </button>
      </div>
    </div>
  )
}
