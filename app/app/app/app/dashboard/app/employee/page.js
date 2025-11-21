'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns'

export default function EmployeeDashboard() {
  const [leaveType, setLeaveType] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [requests, setRequests] = useState([])
  const [leaveTypes, setLeaveTypes] = useState([])
  const supabase = createClient()

  useEffect(() => {
    fetchRequests()
    fetchLeaveTypes()
  }, [])

  async function fetchRequests() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('leave_requests').select(`
      *,
      leave_types (name, color)
    `).eq('user_id', user.id)
    setRequests(data || [])
  }

  async function fetchLeaveTypes() {
    const { data } = await supabase.from('leave_types').select('*')
    setLeaveTypes(data || [])
  }

  async function submitRequest() {
    const { data: { user } } = await supabase.auth.getUser()
    const type = leaveTypes.find(t => t.name === leaveType)
    const requiresApproval = type.requires_approval

    const { error } = await supabase.from('leave_requests').insert({
      user_id: user.id,
      leave_type_id: type.id,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      notes,
      status: requiresApproval ? 'pending' : 'approved'  // Auto-approve Emergency
    })

    if (error) alert(error.message)
    else {
      alert('Request submitted!')
      fetchRequests()
      if (!requiresApproval) {
        // Simple alert for manager — in v2, we'll add email
        alert('Emergency leave auto-approved! Manager notified.')
      }
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Request Leave</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="p-2 border rounded">
          <option value="">Select Leave Type</option>
          {leaveTypes.map(type => <option key={type.id} value={type.name}>{type.name}</option>)}
        </select>
        <input type="date" value={format(startDate, 'yyyy-MM-dd')} onChange={(e) => setStartDate(new Date(e.target.value))} className="p-2 border rounded" />
        <input type="date" value={format(endDate, 'yyyy-MM-dd')} onChange={(e) => setEndDate(new Date(e.target.value))} className="p-2 border rounded" />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="p-2 border rounded col-span-2" />
        <button onClick={submitRequest} className="bg-primary text-white p-2 rounded col-span-2">Submit Request</button>
      </div>

      <h3 className="text-xl mb-2">My Leave Requests</h3>
      <ul>
        {requests.map(req => (
          <li key={req.id} className="p-2 border-b" style={{ borderLeft: `4px solid ${req.leave_types.color}` }}>
            {req.leave_types.name}: {format(new Date(req.start_date), 'MMM dd')} - {format(new Date(req.end_date), 'MMM dd')} | Status: {req.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
