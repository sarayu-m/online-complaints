import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [activeBox, setActiveBox] = useState(null);
  const [messageInputs, setMessageInputs] = useState({});

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', {
        ...form,
        userId,
      });
      alert('Complaint registered successfully');
      const res = await axios.get(`http://localhost:5000/api/complaints/user/${userId}`);
      setComplaints(res.data);
      setForm({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        description: '',
      });
      setShowForm(true);
      setShowTable(false);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Something went wrong!');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowTable(false);
  };

  const handleShowStatus = async () => {
    try {
      const [userRes, complaintsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/auth/user/${userId}`),
        axios.get(`http://localhost:5000/api/complaints/user/${userId}`),
      ]);

      setUserData(userRes.data);
      setComplaints(complaintsRes.data);
      setShowForm(false);
      setShowTable(true);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleSendMessage = async (complaintId) => {
    const content = messageInputs[complaintId];
    if (!content) return;

    try {
      await axios.post(`http://localhost:5000/api/complaints/${complaintId}/messages`, {
        sender: 'user',
        content,
      });
      const res = await axios.get(`http://localhost:5000/api/complaints/user/${userId}`);
      setComplaints(res.data);
      setMessageInputs({ ...messageInputs, [complaintId]: '' });
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-controls">
        <button className="btn-primary" onClick={handleShowForm}>Complaint Register</button>
        <button className="btn-secondary" onClick={handleShowStatus}>Status</button>
      </div>

      {showForm && (
        <form className="complaint-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
          <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required></textarea>
          <button type="submit" className="btn-primary">Register</button>
        </form>
      )}

      {showTable && (
        <>
          <h2 style={{ textAlign: 'center' }}>Welcome, {userData?.name}</h2>

          {complaints.length > 0 ? (
            <div className="complaint-boxes" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {complaints.map((c, index) => (
                <div key={c._id} className="complaint-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', width: '300px' }}>
                  <p><strong>Name:</strong> {c.name}</p>
                  <p><strong>Address:</strong> {c.address}</p>
                  <p><strong>City:</strong> {c.city}</p>
                  <p><strong>State:</strong> {c.state}</p>
                  <p><strong>Pincode:</strong> {c.pincode}</p>
                  <p><strong>Description:</strong> {c.description}</p>
                  <p><strong>Status:</strong> {c.status}</p>
                  <button className="btn-primary" onClick={() => setActiveBox(index)}>Message</button>
                  {activeBox === index && (
                    <div className="message-box">
                      <h4>Messages</h4>
                      <div className="message-list" style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '10px' }}>
                        {c.messages && c.messages.map((msg, i) => (
                          <p key={i}><strong>{msg.sender}:</strong> {msg.content}</p>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Type your message"
                        value={messageInputs[c._id] || ''}
                        onChange={(e) =>
                          setMessageInputs({ ...messageInputs, [c._id]: e.target.value })
                        }
                      />
                      <button className="btn-secondary" onClick={() => handleSendMessage(c._id)}>Send</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No complaints found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
