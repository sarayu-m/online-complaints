import express from 'express';
import Complaint from '../models/complaint.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, name, address, city, state, pincode, description } = req.body;

    const complaint = new Complaint({
      userId,
      name,
      address,
      city,
      state,
      pincode,
      description
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully' });
  } catch (err) {
    console.error('Error saving complaint:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name email userType');
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching all complaints:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.id });
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/messages', async (req, res) => {
  const { sender, senderName, content } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.messages.push({ sender, senderName, content });
    await complaint.save();

    res.status(200).json({ message: 'Message added successfully' });
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
