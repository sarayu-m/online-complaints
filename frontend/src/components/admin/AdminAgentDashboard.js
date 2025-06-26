import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminAgentDashboard.css';

const AdminAgentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [messageInputs, setMessageInputs] = useState({});
  const [activeBox, setActiveBox] = useState(null);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    }
  };

  useEffect(() => {
    const type = localStorage.getItem('userType');
    if (!type) {
      navigate('/login');
      return;
    }
    setUserType(type);
    fetchComplaints();
  }, [navigate]);

  const handleReply = async (complaintId) => {
    const content = messageInputs[complaintId];
    if (!content) return;

    try {
      await axios.post(`http://localhost:5000/api/complaints/${complaintId}/messages`, {
        sender: userType,
        content,
      });

      setMessageInputs({ ...messageInputs, [complaintId]: '' });
      fetchComplaints();
    } catch (err) {
      alert('Reply failed');
    }
  };

  const handleStatusChange = async (complaintId) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${complaintId}/status`);
      fetchComplaints();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {userType}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {complaints.length > 0 ? (
        <div className="complaint-boxes">
          {complaints.map((c, index) => (
            <div key={c._id} className="complaint-card">
              <p><strong>User:</strong> {c.userId?.name}</p>
              <p><strong>Address:</strong> {c.address}</p>
              <p><strong>City:</strong> {c.city}</p>
              <p><strong>State:</strong> {c.state}</p>
              <p><strong>Description:</strong> {c.description}</p>
              <p><strong>Status:</strong> {c.status}</p>

              {userType === 'admin' && c.status === 'Pending' && (
                <button
                  className="btn-complete"
                  onClick={() => handleStatusChange(c._id)}
                >
                  Mark as Completed
                </button>
              )}

              <button className="btn-primary" onClick={() => setActiveBox(index)}>
                {activeBox === index ? 'Hide Messages' : 'View Messages'}
              </button>

              {activeBox === index && (
                <div className="message-box">
                  <h4>Conversation</h4>
                  <div className="message-list">
                    {c.messages && c.messages.map((msg, i) => (
                      <p key={i}><strong>{msg.sender}:</strong> {msg.content}</p>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Your reply"
                    value={messageInputs[c._id] || ''}
                    onChange={(e) =>
                      setMessageInputs({ ...messageInputs, [c._id]: e.target.value })
                    }
                  />
                  <button className="btn-secondary" onClick={() => handleReply(c._id)}>
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No complaints available.</p>
      )}
    </div>
  );
};

export default AdminAgentDashboard;
