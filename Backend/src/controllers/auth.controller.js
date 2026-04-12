
import User from '../models/user.model.js';
import { sendEmail } from '../services/mail.service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function register(req,res,next){
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const err = new Error(existingUser.email === email ? 'Email already registered' : 'Username already taken');
    err.statusCode = 409;
    return next(err);
  }



  // Create new user
  const newUser = new User({
    username,
    email,
    password,
  });

  const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);

  await newUser.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });

  const verifyUrl = `https://cyber-flux-crmi.vercel.app/api/auth/verify-email?token=${token}`;
  const htmlBody = `
    <p>Hi ${username},</p>
    <p>Thank you for registering at our app! We're excited to have you on board.</p>
    <p>Please verify your email address by clicking the link below:</p>
    <p><a href="${verifyUrl}">Verify Email</a></p>
    <p>Best regards,<br>The Team</p>
  `;
  const textBody = `Hi ${username},\n\nThank you for registering at our app! We're excited to have you on board.\n\nVerify your email: ${verifyUrl}\n\nBest regards,\nThe Team`;

  sendEmail(email, 'Welcome to Our App!', htmlBody, textBody).catch(err => {
    console.error('Error sending welcome email:', err);
  });

};

export async function login(req,res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({
      message: 'Invalid email or password'
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      message: 'Invalid email or password'
    });
  }

  if(!user.verified) {
    return res.status(403).json({
      message: 'Please verify your email before logging in',
      success: false,
      error: 'Email not verified'
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    }
  });
}

export async function getUser(req, res) {
  const user=req.user;

  const foundUser=await User.findById(user.id);

  if(!foundUser){
    return res.status(404).json({
      message:"User not found"
    });
  }

  res.status(200).json({
    success: true,
    user: foundUser
  });
}

export async function verifyEmail(req,res) {
  const { token } = req.query;

  let decoded=null;

  try {
    decoded=jwt.verify(token,process.env.JWT_SECRET);
    
  } catch (error) {
    error.message="Invalid Token!!!";
    error.status=401;
    throw error;
  }

  const user = await User.findOne({ email: decoded.email } );

  if (!user) {
    return res.status(400).json({
      message: 'Invalid token or user not found'
    });
  }

  user.verified = true;
  await user.save();

  const html = `
    <p>Hi ${user.username},</p>
    <p>Your email has been successfully verified! You can now log in to your account and start using our services.</p>
    <p><a href="${process.env.FRONTEND_URL || 'https://cyber-flux-crmi.vercel.app'}/login">Login Now</a></p>
    <p>If you did not create an account with us, please ignore this message.</p>
    <p>Best regards,<br>The Team</p>
  `;

  res.status(200).contentType('text/html').send(html);
}