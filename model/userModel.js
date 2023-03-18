import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  dob:{
    type: Date,
  },
  addresses: {
    type: [{
        type : mongoose.Types.ObjectId
    }],
    ref : 'addresses',
    default: []
  },
  phone: {
    type: String,
    trim: true,
    unique : true
  },
  userProfile: {
    type:String,
    trim : true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blocked: {
    type: Boolean,
    default: false
  }
});

const User = model('user', userSchema);

export default User;


