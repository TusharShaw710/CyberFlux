import User from '../models/user.model.js';
import { sendEmail } from '../services/gmail.service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
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



  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create new user
  const newUser = new User({
    username,
    email,
    password,
    verificationToken,
    verificationTokenExpiry,
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

  const verifyUrl = `${process.env.FRONTEND_URL || 'https://cyber-flux.vercel.app'}/verify-email?token=${verificationToken}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Verify your email</h2>
      <p style="color: #666; font-size: 16px;">Hi ${username},</p>
      <p style="color: #666; font-size: 16px;">Welcome to Cyberflux! Your cyberpunk journey is almost ready.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #00f0ff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
      </div>
      <p style="color: #999; font-size: 14px; text-align: center;">If the button doesn't work, copy and paste this link: <br/><a href="${verifyUrl}" style="color: #00f0ff;">${verifyUrl}</a></p>
      <p style="color: #999; font-size: 14px; text-align: center;">This link expires in 10 minutes.</p>
    </div>
  `;

  sendEmail(email, 'Verify your email - Cyberflux', htmlBody).catch(err => {
    console.error('Error sending welcome email via Gmail:', err);
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

  if(!user.isVerified) {
    return res.status(403).json({
      message: 'Please verify your email before logging in',
      success: false,
      error: 'Email not verified'
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,      // Must be true for sameSite: 'none'
    sameSite: 'none',  // Required for cross-domain cookies
    maxAge: 3600000    // 1 hour
  });

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

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() } // Ensure token hasn't expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or expired.'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully ✅'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during verification.'
    });
  }
}