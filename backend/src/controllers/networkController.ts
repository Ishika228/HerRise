import { Request, Response } from 'express';
import { store } from '../data/mockStore.js';

export const getMentors = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, count: store.mentors.length, data: store.mentors });
};

export const bookSession = (req: Request, res: Response) => {
  const { mentorId, date, topic } = req.body;
  const mentor = store.mentors.find((m) => m.id === mentorId);

  if (!mentor) {
    return res.status(404).json({ success: false, error: 'Mentor not found' });
  }

  return res.status(200).json({
    success: true,
    message: `1-on-1 Advisory session scheduled with ${mentor.name} on ${date || 'Tomorrow'}. Calendar invite dispatched.`,
    data: {
      mentorName: mentor.name,
      mentorRole: mentor.role,
      topic: topic || 'Financial Runway & Scale Advisory',
      meetingLink: 'https://meet.herrise.org/room/' + Math.random().toString(36).substring(2, 9)
    }
  });
};
