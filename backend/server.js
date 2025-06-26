import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaint.js';

const app = express();


mongoose.connect('mongodb://localhost:27017/complaintSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);


app.use('/api/complaints', complaintRoutes);


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
