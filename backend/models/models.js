const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  roles: [{
    type: String,
    enum: ['developer', 'project_manager', 'architect', 'stakeholder'],
    default: 'developer', // Set a default role if needed
  }],
  projects_bookmarked: {

  },
  projects_completed: {

  },
  projects_in_progress: {

  },
  skills: {

  },
  industry_experience: {

  },
  certifications: {

  },
  degrees: {

  }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
    

}, { timestamps: true });

const skillSchema = new mongoose.Schema({


}, { timestamps: true });

const certificationSchema = new mongoose.Schema({


}, { timestamps: true });

const degreeSchema = new mongoose.Schema({


}, { timestamps: true });
  

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

module.exports.User = mongoose.model('User', userSchema);
module.exports.Project = mongoose.model('Project', projectSchema);
module.exports.Certificate = mongoose.model('Certificate', certificationSchema);
module.exports.Degree = mongoose.model('Degree', degreeSchema);
module.exports.Skill = mongoose.model('Skill', skillSchema);

