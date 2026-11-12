import React, { useState } from 'react';
import {
  Landmark,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  Upload,
  ArrowRight,
  TrendingUp,
  Presentation,
  Check,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  initialFundingSchemes,
  samplePitchDeckSlides,
  documentChecklistData
} from '../../data/mockData/fundData';
import { FundingScheme, PitchDeckSlide } from '../../types';

export const HerFundPage: React.FC = () => {
  const { showToast } = useToast();

  const [schemes, setSchemes] = useState<FundingScheme[]>(initialFundingSchemes);
  const [activeTab, setActiveTab] = useState<'schemes' | 'compare' | 'eligibility' | 'docs' | 'pitch'>('schemes');

  // Filters
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');

  // Comparison selection
  const [comparedSchemeIds, setComparedSchemeIds] = useState<string[]>(['fund-1', 'fund-2']);

  // Document Checklist state
  const [documents, setDocuments] = useState(documentChecklistData);

  // Pitch Deck slides state
  const [slides, setSlides] = useState<PitchDeckSlide[]>(samplePitchDeckSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Application Modal
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<FundingScheme | null>(null);
  const [appliedAmount, setAppliedAmount] = useState('500000');
  const [businessTenor, setBusinessTenor] = useState('36 Months');

  const filteredSchemes = schemes.filter((s) => {
    const matchesType = selectedType === 'All' || s.type === selectedType;
    const matchesStage = selectedStage === 'All' || s.stage === selectedStage;
    return matchesType && matchesStage;
  });

  const toggleCompare = (id: string) => {
    setComparedSchemeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchemeForApply) return;
    setSelectedSchemeForApply(null);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
    showToast(
      'Demo Application Initiated!',
      `Application for ₹${Number(appliedAmount).toLocaleString()} submitted to ${selectedSchemeForApply.provider}`,
      'success'
    );
  };

  const handleDocUpload = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Uploaded' } : d))
    );
    showToast('Document Uploaded', 'Simulated file verified and added to application package', 'success');
  };

  const comparedSchemes = schemes.filter((s) => comparedSchemeIds.includes(s.id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-[#d97706]">
                <Landmark className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                HerFund — Transparent Funding & Capital Navigator
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Compare women-centric bank loans, fast-track NBFC credit, crowdfunding pools, and non-repayable grants.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-purple-50/70 p-1.5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('schemes')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'schemes' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Explore Capital
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'compare' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Side-by-Side Compare ({comparedSchemeIds.length})
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'docs' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Document Checklist
            </button>
            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'pitch' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              6-Slide Pitch Deck
            </button>
          </div>
        </div>

        {/* Demo Warning Banner (Explicit compliance requirement) */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Illustrative Demonstration Notice:</strong> The financial schemes, interest rates, lenders, and grant programs below are sample mock representations designed for interactive evaluation. They do not constitute actual credit offerings or financial underwriting approvals.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Capital Pool Explored"
            value="₹1.15 Cr"
            subtitle="Across 5 active schemes"
            icon={Landmark}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Lowest Interest Rate"
            value="8.15% p.a."
            subtitle="Under Women Enterprise scheme"
            icon={TrendingUp}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-50"
          />
          <StatCard
            title="Collateral-Free Options"
            value="4 of 5"
            subtitle="No real-estate pledge required"
            icon={CheckCircle2}
            iconColor="text-indigo-700"
            bgColor="bg-indigo-50"
          />
          <StatCard
            title="Pre-Flight Readiness"
            value="83%"
            subtitle="5 of 6 KYC documents verified"
            icon={FileCheck}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-50"
          />
        </div>

        {/* TAB 1: SCHEMES LIST */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-gray-500 uppercase tracking-wider">Filter By:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="All">All Funding Instruments</option>
                  <option value="Bank Loan">Bank Loan (Low Interest)</option>
                  <option value="NBFC Microloan">NBFC Microloan (Fast Disbursal)</option>
                  <option value="Women Empowerment Grant">Non-Repayable Grant (0%)</option>
                  <option value="Crowdfunding">Crowdfunding & Pre-orders</option>
                  <option value="Angel/Equity">Angel & Venture Equity</option>
                </select>

                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="All">All Business Stages</option>
                  <option value="Idea">Idea / MVP Stage</option>
                  <option value="Early Stage">Early Stage (Initial Sales)</option>
                  <option value="Growth">Growth / Scaling</option>
                </select>
              </div>

              <div className="text-gray-500 font-medium">
                Showing {filteredSchemes.length} Verified Demo Options
              </div>
            </div>

            {/* Scheme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => {
                const isCompared = comparedSchemeIds.includes(scheme.id);
                return (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center border border-amber-100">
                            {scheme.logo}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {scheme.type}
                            </span>
                            <h3 className="font-extrabold text-sm text-gray-900 leading-snug group-hover:text-[#4A154B] transition-colors">
                              {scheme.title}
                            </h3>
                            <span className="text-xs text-gray-600 font-medium">{scheme.provider}</span>
                          </div>
                        </div>
                      </div>

                      {/* Main metrics */}
                      <div className="p-3 bg-[#faf9fd] rounded-2xl border border-purple-50 my-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount Range:</span>
                          <strong className="text-gray-900 font-black">{scheme.amountRange}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cost of Capital / Rate:</span>
                          <strong className="text-emerald-700 font-bold">{scheme.interestRate}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Repayment Tenor:</span>
                          <span className="text-gray-700">{scheme.repaymentTenor}</span>
                        </div>
                      </div>

                      {/* Eligibility Bullets */}
                      <div className="space-y-1.5 mb-4 text-xs">
                        <span className="text-[11px] font-bold text-gray-700 block">Key Eligibility:</span>
                        {scheme.eligibility.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-gray-600 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-purple-50 flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => toggleCompare(scheme.id)}
                          className="rounded text-[#4A154B] focus:ring-[#4A154B]"
                        />
                        <span className="text-[11px]">Compare</span>
                      </label>

                      <button
                        onClick={() => setSelectedSchemeForApply(scheme)}
                        className="bg-[#4A154B] hover:bg-[#350c36] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Apply (Demo)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SIDE-BY-SIDE COMPARISON TABLE */}
        {activeTab === 'compare' && (
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Side-by-Side Scheme Matrix</h3>
              <p className="text-xs text-gray-500">
                Compare terms, turnaround time, and documentation requirements across your selected schemes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-purple-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 w-1/4">Feature</th>
                    {comparedSchemes.map((s) => (
                      <th key={s.id} className="py-3 px-4 text-gray-900 font-bold">
                        {s.title}
                        <span className="block text-[11px] font-normal text-gray-500">{s.provider}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 text-gray-700">
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900">Instrument Type</td>
                    {comparedSchemes.map((s) => (
                      <td key={s.id} className="py-3 px-4">{s.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900">Loan / Grant Amount</td>
                    {comparedSchemes.map((s) => (
                      <td key={s.id} className="py-3 px-4 font-extrabold text-[#4A154B]">{s.amountRange}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900">Interest / Dilution</td>
                    {comparedSchemes.map((s) => (
                      <td key={s.id} className="py-3 px-4 text-emerald-700 font-bold">{s.interestRate}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900">Collateral Required</td>
                    {comparedSchemes.map((s) => (
                      <td key={s.id} className="py-3 px-4">
                        {s.collateralRequired ? 'Yes (Property/Asset)' : 'No (Collateral-Free)'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900">Approval Speed</td>
                    {comparedSchemes.map((s) => (
                      <td key={s.id} className="py-3 px-4">{s.processingTime}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900">Action</td>
                    {comparedSchemes.map((s) => (
                      <td key={s.id} className="py-3 px-4">
                        <button
                          onClick={() => setSelectedSchemeForApply(s)}
                          className="bg-[#4A154B] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#350c36] cursor-pointer"
                        >
                          Start Application
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENT CHECKLIST */}
        {activeTab === 'docs' && (
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Pre-Flight Loan & Grant Document Readiness</h3>
              <p className="text-xs text-gray-500">
                Having these standard documents ready ensures fast-track turnaround during credit underwriting.
              </p>
            </div>

            <div className="divide-y divide-purple-50">
              {documents.map((doc) => (
                <div key={doc.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : doc.status === 'Uploaded'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {doc.status === 'Verified' ? '✓' : '📄'}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">{doc.name}</span>
                      <span className="text-[10px] text-gray-400">
                        {doc.required ? 'Mandatory for bank disbursement' : 'Optional supplementary file'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800'
                          : doc.status === 'Uploaded'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>

                    {doc.status !== 'Verified' && (
                      <button
                        onClick={() => handleDocUpload(doc.id)}
                        className="flex items-center gap-1 border border-purple-200 hover:bg-purple-50 text-[#4A154B] px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 6-SLIDE PITCH DECK BUILDER */}
        {activeTab === 'pitch' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Slide Navigation (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                Pitch Deck Outline (6 Slides)
              </h3>
              <div className="space-y-2">
                {slides.map((s, idx) => (
                  <div
                    key={s.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      activeSlideIndex === idx
                        ? 'border-[#4A154B] bg-purple-50/60 shadow-xs'
                        : 'border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">Slide 0{s.id}</span>
                      <strong className="text-xs text-gray-900">{s.title}</strong>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Editor & Visual Canvas (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-xl min-h-[420px] flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-purple-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#fb7185]">
                        Investor Presentation • Slide 0{slides[activeSlideIndex].id}
                      </span>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                        {slides[activeSlideIndex].title}
                      </h2>
                      <p className="text-xs text-[#4A154B] font-semibold">{slides[activeSlideIndex].subtitle}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-300">
                      0{activeSlideIndex + 1} / 06
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {slides[activeSlideIndex].content}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                      Core Evidence & Proof Points:
                    </span>
                    {slides[activeSlideIndex].bulletPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-purple-50 flex items-center justify-between">
                  <button
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                  >
                    ← Previous Slide
                  </button>

                  <button
                    onClick={() => {
                      showToast('Deck Exported', 'Pitch deck downloaded as interactive demo deck', 'success');
                    }}
                    className="bg-[#4A154B] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#350c36] cursor-pointer shadow-xs"
                  >
                    Export Slide Deck (PDF)
                  </button>

                  <button
                    disabled={activeSlideIndex === slides.length - 1}
                    onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                    className="text-xs font-bold text-[#4A154B] hover:underline disabled:opacity-30 cursor-pointer"
                  >
                    Next Slide →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Application Submission */}
      {selectedSchemeForApply && (
        <Modal
          isOpen={!!selectedSchemeForApply}
          onClose={() => setSelectedSchemeForApply(null)}
          title={`Apply for ${selectedSchemeForApply.title}`}
          subtitle={`Provider: ${selectedSchemeForApply.provider} • Range: ${selectedSchemeForApply.amountRange}`}
        >
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Requested Funding Amount (₹)</label>
              <input
                type="number"
                required
                value={appliedAmount}
                onChange={(e) => setAppliedAmount(e.target.value)}
                placeholder="500000"
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:border-[#4A154B]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Preferred Repayment Tenor</label>
              <select
                value={businessTenor}
                onChange={(e) => setBusinessTenor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none"
              >
                <option value="12 Months">12 Months (Fast Payback)</option>
                <option value="24 Months">24 Months</option>
                <option value="36 Months">36 Months</option>
                <option value="60 Months">60 Months (Long Term)</option>
              </select>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl text-gray-700 text-[11px] leading-relaxed">
              Your profile documents (Identity Proof, PAN, 12M Bank Statement) will be automatically packaged for this demo submission.
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer"
            >
              Submit Demo Funding Application
            </button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

