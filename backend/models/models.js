const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  company: String,
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accommodations_listed: [{ type: Schema.Types.ObjectId, ref: 'Accommodation' }],
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  guest_ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  host_ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  credits: Number,
  services_offered: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  facebookId: String,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Accommodation Schema
const accommodationSchema = new Schema({
  address: String,
  zipCode: String,
  state: String,
  city: String,
  country: String,
  private: Boolean,
  type: { type: String, enum: ['couch', 'air mattress', 'room', 'entire place'] },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Added owner field
});

// Booking Schema
const bookingSchema = new Schema({
  accommodation: { type: Schema.Types.ObjectId, ref: 'Accommodation' },
  guest: { type: Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  endDate: Date,
  state: { type: String, enum: ['pending', 'confirmed', 'in progress', 'completed'] },
  host_review: { type: Schema.Types.ObjectId, ref: 'Rating' },
  guest_review: { type: Schema.Types.ObjectId, ref: 'Rating' }
});

// Rating Schema
const ratingSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  comment: String
});

// Service Schema
const serviceSchema = new Schema({
  name: String
});

// Friend Request Schema
const friendRequestSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['accepted', 'denied', 'pending'] }
});

const User = mongoose.model('User', userSchema);
const Accommodation = mongoose.model('Accommodation', accommodationSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Rating = mongoose.model('Rating', ratingSchema);
const Service = mongoose.model('Service', serviceSchema);
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = { User, Accommodation, Booking, Rating, Service, FriendRequest };
