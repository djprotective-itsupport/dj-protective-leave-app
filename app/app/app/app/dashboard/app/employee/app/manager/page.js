'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { jsPDF } from 'jspdf'
import { format } from 'date-fns'

export default function ManagerDashboard() {
  const [requests, setRequests] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const supabase = createClient()

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const { data } = await supabase.from('leave_requests').select(`
      *,
      leave_types (name, color),
      profiles (full_name)
    `).eq('status', 'pending')
    setRequests(data || [])
  }

  async function approveRequest(id, approve) {
    const { error } = await supabase.from('leave_requests').update({
      status: approve ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString()
    }).eq('id', id)
    if (error) alert(error.message)
    else fetchRequests()
  }

  function generateTimetable() {
    const doc = new jsPDF()
    doc.text(`${process.env.NEXT_PUBLIC_COMPANY_NAME} - Monthly Timetable (${format(currentMonth, 'MMMM yyyy')})`, 10, 10)
    
    // Simple table of days and who's off
    let y = 20
    for (let day = 1; day <= 31; day++) {
      // Fetch approved leaves for this day — simplified
      doc.text(`${day}: [Off: Employee Names]`, 10, y)
      y += 10
    }
    
    doc.save(`timetable-${format(currentMonth, 'yyyy-MM')}.pdf`)
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl">Manager Dashboard</h2>
        <button onClick={generateTimetable} className="bg-green-500 text-white p-2 rounded">Export Timetable PDF</button>
      </div>

      <h3 className="text-xl mb-2">Pending Approvals</h3>
      <table className="w-full border">
        <thead><tr><th>Name</th><th>Type</th><th>Dates</th><th>Actions</th></tr></thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.profiles.full_name}</td>
              <td style={{ color: req.leave_types.color }}>{req.leave_types.name}</td>
              <td>{format(new Date(req.start_date), 'MMM dd')} - {format(new Date(req.end_date), 'MMM dd')}</td>
              <td>
                <button onClick={() => approveRequest(req.id, true)} className="bg-green-500 text-white px-2 py-1 mr-2 rounded">Approve</button>
                <button onClick={() => approveRequest(req.id, false)} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
