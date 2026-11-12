import { Request, Response } from 'express';
import { store, User } from '../data/mockStore.js';

export const registerUser = (req: Request, res: Response) => {
  const { name, email, password, phone, location, preferredLanguage } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

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
    message: 'User registered successfully',
    user: newUser,
    token: `demo-jwt-token-${newUser.id}`
  });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || store.users[0];

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    user,
    token: `demo-jwt-token-${user.id}`
  });
};

export const getCurrentUser = (req: Request, res: Response) => {
  const user = store.users[0];
  return res.status(200).json({ success: true, user });
};

export const submitOnboarding = (req: Request, res: Response) => {
  const { goals, education, professionalStatus, skills, experienceYears } = req.body;
  const user = store.users[0];

  if (goals) user.goals = goals;
  if (education) user.education = education;
  if (professionalStatus) user.professionalStatus = professionalStatus;
  if (skills) user.skills = skills;
  if (experienceYears) user.experienceYears = Number(experienceYears);
  user.profileCompleted = 95;

  return res.status(200).json({
    success: true,
    message: 'Onboarding profile saved successfully',
    user
  });
};

