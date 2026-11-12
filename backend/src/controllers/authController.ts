import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { store, User } from '../data/mockStore.js';
import { UserModel } from '../models/UserModel.js';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, location, preferredLanguage, resumeData } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  // Save to MongoDB Atlas if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const existing = await UserModel.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email already exists' });
      }

      const userDoc = await UserModel.create({
        name,
        email: email.toLowerCase(),
        phone: phone || (resumeData?.phone || ''),
        location: location || (resumeData?.location || ''),
        preferredLanguage: preferredLanguage || 'English',
        goals: [],
        skills: resumeData?.skills || [],
        profileCompleted: resumeData ? 80 : 40,
        resumeData: resumeData || undefined
      });

      return res.status(201).json({
        success: true,
        source: 'mongodb-atlas',
        message: 'User registered successfully in MongoDB Atlas',
        user: userDoc,
        token: `jwt-token-${userDoc._id}`
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Registration error, using memory fallback:', err.message);
    }
  }

  // Fallback to mock store
  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    location: location || '',
    preferredLanguage: preferredLanguage || 'English',
    goals: [],
    skills: [],
    profileCompleted: 40,
    createdAt: new Date().toISOString()
  };

  store.users.push(newUser);

  return res.status(201).json({
    success: true,
    source: 'in-memory',
    message: 'User registered successfully',
    user: newUser,
    token: `demo-jwt-token-${newUser.id}`
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  if (mongoose.connection.readyState === 1) {
    try {
      let user = await UserModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Create user on the fly for seamless demo experience
        user = await UserModel.create({
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          email: email.toLowerCase(),
          profileCompleted: 50
        });
      }
      return res.status(200).json({
        success: true,
        source: 'mongodb-atlas',
        message: 'Logged in successfully',
        user,
        token: `jwt-token-${user._id}`
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Login error, using memory fallback:', err.message);
    }
  }

  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || store.users[0];

  return res.status(200).json({
    success: true,
    source: 'in-memory',
    message: 'Logged in successfully',
    user,
    token: `demo-jwt-token-${user.id}`
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const user = await UserModel.findOne().sort({ updatedAt: -1 });
      if (user) {
        return res.status(200).json({ success: true, source: 'mongodb-atlas', user });
      }
    } catch (err: any) {
      console.warn('[MongoDB Atlas] getCurrentUser error:', err.message);
    }
  }

  const user = store.users[0];
  return res.status(200).json({ success: true, source: 'in-memory', user });
};

export const submitOnboarding = async (req: Request, res: Response) => {
  const { email, goals, education, professionalStatus, skills, experienceYears } = req.body;

  if (mongoose.connection.readyState === 1 && email) {
    try {
      const updated = await UserModel.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          ...(goals && { goals }),
          ...(education && { education }),
          ...(professionalStatus && { professionalStatus }),
          ...(skills && { skills }),
          ...(experienceYears !== undefined && { experienceYears: Number(experienceYears) }),
          profileCompleted: 95
        },
        { new: true, upsert: true }
      );
      return res.status(200).json({
        success: true,
        source: 'mongodb-atlas',
        message: 'Onboarding profile saved successfully in MongoDB Atlas',
        user: updated
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] submitOnboarding error:', err.message);
    }
  }

  const user = store.users[0];
  if (goals) user.goals = goals;
  if (education) user.education = education;
  if (professionalStatus) user.professionalStatus = professionalStatus;
  if (skills) user.skills = skills;
  if (experienceYears) user.experienceYears = Number(experienceYears);
  user.profileCompleted = 95;

  return res.status(200).json({
    success: true,
    source: 'in-memory',
    message: 'Onboarding profile saved successfully',
    user
  });
};

// Module specific registration intake
export const saveModuleProfile = async (req: Request, res: Response) => {
  const { module, email, name, phone, location, profileData } = req.body;

  if (!module || !profileData) {
    return res.status(400).json({ success: false, error: 'Module and profileData are required.' });
  }

  const userEmail = (email || 'user@herrise.org').toLowerCase();

  if (mongoose.connection.readyState === 1) {
    try {
      const updatePayload: any = {
        name: name || undefined,
        phone: phone || undefined,
        location: location || undefined
      };

      if (module === 'career') {
        updatePayload.careerSetupCompleted = true;
        updatePayload.careerProfile = profileData;
      } else if (module === 'business') {
        updatePayload.businessSetupCompleted = true;
        updatePayload.businessProfile = profileData;
      } else if (module === 'fund') {
        updatePayload.fundSetupCompleted = true;
        updatePayload.fundProfile = profileData;
      } else if (module === 'market') {
        updatePayload.marketSetupCompleted = true;
        updatePayload.marketProfile = profileData;
      } else if (module === 'learn') {
        updatePayload.learnSetupCompleted = true;
        updatePayload.learnProfile = profileData;
      } else if (module === 'network') {
        updatePayload.networkSetupCompleted = true;
        updatePayload.networkProfile = profileData;
      }

      // Remove undefined keys
      Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

      const user = await UserModel.findOneAndUpdate(
        { email: userEmail },
        { $set: updatePayload },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        success: true,
        source: 'mongodb-atlas',
        message: `${module} profile saved in MongoDB Atlas`,
        user
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] saveModuleProfile error:', err.message);
    }
  }

  return res.status(200).json({
    success: true,
    source: 'in-memory',
    message: `${module} profile registered successfully`
  });
};
