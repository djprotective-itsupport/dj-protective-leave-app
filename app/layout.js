import './globals.css'
import { createClient } from '@/utils/supabase/client'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: process.env.NEXT_PUBLIC_COMPANY_NAME + ' - Leave Planner',
  description: 'Manage leaves and generate timetables',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-white p-4">
          <h1 className="text-xl font-bold">{process.env.NEXT_PUBLIC_COMPANY_NAME}</h1>
          <p className="text-sm">Leave & Timetable System</p>
        </header>
        {children}
      </body>
    </html>
  )
}
