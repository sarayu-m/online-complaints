import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-left">
        <h1>Empower Your Team,</h1>
        <p>Exceed Customer Expectations: Discover our</p>
        <p><strong>Complaint Management Solution</strong></p>
        <button className="btn-primary" onClick={() => navigate('/register')}>
           Register your Complaint
        </button>

      </div>

      <div className="home-right">
        <img
          src="https://media.istockphoto.com/id/1390242644/photo/smiling-people-in-the-meeting-room-using-a-laptop-searching-s.jpg?s=612x612&w=0&k=20&c=DtQoaRXByFbFNUXk1ZNIeWuQhTzKjsyC-1PeyenkfcE="
          alt="Office Professionals"
          className="hero-img"
        />
      </div>
    </div>
  );
};

export default Home;
