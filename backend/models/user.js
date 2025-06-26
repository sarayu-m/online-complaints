import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  userType: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  }
});

const User = mongoose.model('User', userSchema);

export default User;
