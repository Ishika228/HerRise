import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Sparkles, Send, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ConsultationRequestItem,
  getStoredConsultations,
  saveStoredConsultations
} from '../data/herMarketData';

interface ConsultationFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onSuccess,
  compact = false
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Boutique & Retail');
  const [serviceNeeded, setServiceNeeded] = useState('Website Development');
  const [goals, setGoals] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const categories = [
    'Boutique & Fashion',
    'Salon & Beauty Studio',
    'Bakery & Home Food',
    'Coaching & Education',
    'Handmade Crafts & Gifts',
    'Wellness & Fitness',
    'Consulting & Professional Services',
    'Other Small Business'
  ];

  const services = [
    'Website Development (Starter/Growth/Premium)',
    'E-commerce Online Store',
    'Brand Identity & Logo Design',
    'Digital Marketing & Meta Ads',
    'Social Media Management',
    'SEO & Local Google Maps Ranking',
    'Complete Digital Presence Audit'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !goals) {
      alert('Please fill in your name and business goals.');
      return;
    }

    const newId = `CNS-${Date.now().toString().slice(-4)}`;
    const newConsultation: ConsultationRequestItem = {
      id: newId,
      name,
      category,
      serviceNeeded,
      goals,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Scheduled'
    };

    const existing = getStoredConsultations();
    saveStoredConsultations([newConsultation, ...existing]);

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {}

    setBookingId(newId);
    setIsSubmitted(true);
    if (onSuccess) onSuccess();
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">Consultation Scheduled!</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Thank you, <strong className="text-gray-800">{name}</strong>. Our digital growth strategist will review your goals and connect with you on WhatsApp/Phone.
          </p>
        </div>
        <div className="inline-block px-4 py-2 bg-purple-50 rounded-xl text-xs font-bold text-[#4A154B]">
          Consultation Booking ID: {bookingId}
        </div>
        <div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setName('');
              setGoals('');
            }}
            className="text-xs font-bold text-[#4A154B] hover:underline"
          >
            Book Another Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#4A154B] mb-2">
          <Sparkles className="w-3 h-3 text-[#4A154B]" />
          100% Free · No Obligation
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
          Get a Free Digital Strategy Consultation
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Speak with our digital experts to identify the exact website, branding, or marketing tools tailored for your target audience and budget.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anjali Nair"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#4A154B] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Business Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#4A154B] outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Primary Service Needed
            </label>
            <select
              value={serviceNeeded}
              onChange={(e) => setServiceNeeded(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#4A154B] outline-none"
            >
              {services.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Preferred Consultation Date
            </label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#4A154B] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">
            Describe Your Business Goals & Current Challenges <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. We are a home bakery looking to get orders through our own website instead of third-party aggregator commissions..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#4A154B] outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-black text-white bg-[#4A154B] hover:bg-[#350c36] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Request Free Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
