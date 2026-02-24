import { useState, useEffect } from 'react'
import '../index.css'

const AdminPage = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/admin/submissions')
        const data = await res.json()
        setSubmissions(data.submissions || [])
      } catch (err) {
        console.error('Error fetching submissions:', err)
      }
      setLoading(false)
    }
    fetchSubmissions()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px' }}><p>Loading submissions...</p></div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>🛡️ Admin Submissions Dashboard</h2>
        <p>Manage gift card and DWT submissions</p>
      </div>

      {selectedSubmission ? (
        <div>
          <button 
            onClick={() => setSelectedSubmission(null)}
            style={{
              padding: '10px 15px',
              marginBottom: '20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3>{selectedSubmission.type === 'dwt-purchase' ? '🪙 DWT Purchase Details' : '🎁 Gift Card Submission Details'}</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Name:</label>
              <span> {selectedSubmission.fullName || selectedSubmission.name}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Email:</label>
              <span> {selectedSubmission.email}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Phone:</label>
              <span> {selectedSubmission.phone}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>{selectedSubmission.type === 'dwt-purchase' ? 'Amount (DWT):' : 'Amount ($):'}</label>
              <span> {selectedSubmission.amount}</span>
            </div>
            {selectedSubmission.type === 'dwt-purchase' && (
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 'bold' }}>Price:</label>
                <span> ${selectedSubmission.price?.toFixed(2)}</span>
              </div>
            )}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>User ID:</label>
              <span> {selectedSubmission.userId}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Submitted:</label>
              <span> {new Date(selectedSubmission.timestamp).toLocaleString()}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Status:</label>
              <select 
                value={selectedSubmission.status}
                onChange={(e) => {
                  handleStatusChange(selectedSubmission.id, e.target.value)
                  setSelectedSubmission({ ...selectedSubmission, status: e.target.value })
                }}
                style={{
                  padding: '8px',
                  marginLeft: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>{selectedSubmission.type === 'dwt-purchase' ? 'Payment Proof' : 'Gift Card Images'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {selectedSubmission.images || selectedSubmission.image ? (
                  Array.isArray(selectedSubmission.images) ? (
                    selectedSubmission.images.map((img, idx) => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <p>Image {idx + 1}</p>
                        <img src={img} alt={`submission-${idx}`} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '5px' }} />
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <img src={selectedSubmission.image || selectedSubmission.images} alt="payment-proof" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '5px' }} />
                    </div>
                  )
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3>All Submissions ({submissions.length})</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #ddd'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Submitted</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px', border: '1px solid #ddd' }}>No submissions yet</td>
                  </tr>
                ) : (
                  submissions.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: sub.type === 'dwt-purchase' ? '#fff3cd' : '#d1ecf1',
                          color: sub.type === 'dwt-purchase' ? '#856404' : '#0c5460'
                        }}>
                          {sub.type === 'dwt-purchase' ? '🪙 DWT' : '🎁 Gift'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{sub.fullName || sub.name}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{sub.email}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{sub.phone}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {sub.type === 'dwt-purchase' 
                          ? `${sub.amount} DWT ($${sub.price?.toFixed(2)})`
                          : `$${sub.amount}`
                        }
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: sub.status === 'approved' ? '#d4edda' : sub.status === 'rejected' ? '#f8d7da' : '#e2e3e5',
                          color: sub.status === 'approved' ? '#155724' : sub.status === 'rejected' ? '#721c24' : '#383d41'
                        }}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(sub.timestamp).toLocaleDateString()}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <button 
                          onClick={() => setSelectedSubmission(sub)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
