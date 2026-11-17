import React, { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Calendar,
  Building,
  Edit2,
  Trash2,
  Sparkles,
  MessageSquare,
  Clock,
  Briefcase,
  User,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Globe
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useToast } from '../../../context/ToastContext';
import { JobApplication } from '../../../types/career';
import { Modal } from '../../../components/common/Modal';

export const ApplicationTrackerView: React.FC = () => {
  const { applications, addApplication, updateApplicationStatus, deleteApplication, profile } = useHerCareer();
  const { showToast } = useToast();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppForFollowUp, setSelectedAppForFollowUp] = useState<JobApplication | null>(null);
  const [viewCandidateDetailsApp, setViewCandidateDetailsApp] = useState<JobApplication | null>(null);

  // New Application Form State
  const [form, setForm] = useState({
    company: '',
    title: '',
    location: 'Remote',
    salary: '',
    status: 'Application Sent' as JobApplication['status'],
    appliedDate: new Date().toISOString().split('T')[0],
    interviewDate: '',
    notes: ''
  });

  const statuses: JobApplication['status'][] = [
    'Application Sent',
    'Applied',
    'Saved',
    'Interview Scheduled',
    'Interview Completed',
    'Selected',
    'Rejected'
  ];

  const filtered = applications.filter((app) =>
    filterStatus === 'All' ? true : app.status === filterStatus
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.title.trim()) {
      showToast('Validation Error', 'Company and Job Title are required', 'warning');
      return;
    }

    await addApplication(form);
    setIsAddModalOpen(false);
    setForm({
      company: '',
      title: '',
      location: 'Remote',
      salary: '',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      interviewDate: '',
      notes: ''
    });
  };

  // Generate Follow-up email draft
  const getFollowUpDraft = (app: JobApplication) => {
    return `Subject: Following up on application for ${app.title} - ${app.company}

Dear Hiring Team,

I hope this email finds you well. I am following up on my application submitted on ${app.appliedDate} for the ${app.title} role at ${app.company}.

I remain very enthusiastic about the opportunity to contribute my skills in modern engineering and collaborative problem solving to your team. Please let me know if you require any additional work samples, references, or details from my end.

Thank you very much for your time and consideration.

Warm regards,
${profile.fullName || 'Candidate'}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Job Application Management</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">Application Pipeline Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor interviews, track follow-ups, and keep all notes centralized.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4.5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-teal-300" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setFilterStatus('All')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            filterStatus === 'All' ? 'bg-[#0f172a] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All ({applications.length})
        </button>
        {statuses.map((st) => {
          const count = applications.filter((a) => a.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                filterStatus === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400 font-semibold">No applications found in this status.</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{app.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      app.status === 'Application Sent'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : app.status === 'Interview Scheduled'
                        ? 'bg-indigo-100 text-indigo-800'
                        : app.status === 'Applied'
                        ? 'bg-blue-100 text-blue-800'
                        : app.status === 'Selected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {app.company}
                  </span>
                  <span>•</span>
                  <span>{app.location || 'Remote'}</span>
                  {app.salary && <span>• {app.salary}</span>}
                  <span>• Applied on {app.appliedDate}</span>
                </div>

                {app.interviewDate && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Interview: {app.interviewDate}</span>
                  </div>
                )}

                {app.notes && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl mt-1 max-w-xl">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Status Selector & Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  value={app.status}
                  onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                {app.candidateDetails && (
                  <button
                    type="button"
                    onClick={() => setViewCandidateDetailsApp(app)}
                    className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="View candidate details submitted for this job"
                  >
                    <User className="w-3.5 h-3.5 text-pink-600" />
                    <span>Candidate Profile</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedAppForFollowUp(app)}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Generate follow-up email draft"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Follow-Up Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteApplication(app.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Add Application Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Track New Job Application">
        <form onSubmit={handleCreate} className="space-y-4 text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Google India"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role / Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Applied Date</label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Interview Date (If scheduled)</label>
            <input
              type="date"
              value={form.interviewDate}
              onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes & Follow-up Reminders</label>
            <textarea
              rows={2}
              placeholder="e.g. Recruiter mentioned 2 technical rounds. Prepared system design."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              Save to Tracker
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Follow-Up Message Modal */}
      {selectedAppForFollowUp && (
        <Modal
          isOpen={!!selectedAppForFollowUp}
          onClose={() => setSelectedAppForFollowUp(null)}
          title={`AI Follow-Up Email Draft: ${selectedAppForFollowUp.company}`}
        >
          <div className="space-y-3 text-slate-800">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Personalized follow-up template ready to copy and send</span>
            </div>

            <textarea
              rows={10}
              readOnly
              value={getFollowUpDraft(selectedAppForFollowUp)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getFollowUpDraft(selectedAppForFollowUp));
                  showToast('Copied to Clipboard! 📋', 'Email draft ready to paste', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
              >
                Copy Draft
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppForFollowUp(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Submitted Candidate Details Modal */}
      {viewCandidateDetailsApp && (
        <Modal
          isOpen={!!viewCandidateDetailsApp}
          onClose={() => setViewCandidateDetailsApp(null)}
          title="Candidate Application Details"
          subtitle={`${viewCandidateDetailsApp.title} • ${viewCandidateDetailsApp.company}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Submission Status</span>
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {viewCandidateDetailsApp.status}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span className="block font-medium">Applied Date</span>
                <span className="font-bold text-slate-800">{viewCandidateDetailsApp.appliedDate}</span>
              </div>
            </div>

            {viewCandidateDetailsApp.candidateDetails && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applicant Name</span>
                    <span className="font-bold text-slate-900 text-xs">{viewCandidateDetailsApp.candidateDetails.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="font-bold text-slate-900 text-xs">{viewCandidateDetailsApp.candidateDetails.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone</span>
                    <span className="font-semibold text-slate-800 text-xs">{viewCandidateDetailsApp.candidateDetails.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                    <span className="font-semibold text-slate-800 text-xs">{viewCandidateDetailsApp.candidateDetails.location || viewCandidateDetailsApp.location || 'Australia'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Headline / Role</span>
                    <span className="font-semibold text-slate-800 text-xs">{viewCandidateDetailsApp.candidateDetails.headline || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Qualification</span>
                    <span className="font-semibold text-slate-800 text-xs">{viewCandidateDetailsApp.candidateDetails.qualification || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                    <span className="font-semibold text-slate-800 text-xs">{viewCandidateDetailsApp.candidateDetails.yearsOfExperience || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attached Resume</span>
                    <span className="font-semibold text-slate-800 text-xs">{viewCandidateDetailsApp.candidateDetails.resumeTitle || 'ATS Resume'}</span>
                  </div>
                </div>

                {viewCandidateDetailsApp.candidateDetails.skills && viewCandidateDetailsApp.candidateDetails.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Core Skills Submitted</span>
                    <div className="flex flex-wrap gap-1.5">
                      {viewCandidateDetailsApp.candidateDetails.skills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewCandidateDetailsApp.candidateDetails.coverLetter && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cover Note / Pitch</span>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-normal whitespace-pre-wrap leading-relaxed">
                      {viewCandidateDetailsApp.candidateDetails.coverLetter}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewCandidateDetailsApp(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

