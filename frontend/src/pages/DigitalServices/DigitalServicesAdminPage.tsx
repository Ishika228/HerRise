import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Download,
  Edit3,
  ExternalLink,
  FilePlus2,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Mail,
  Package,
  Plus,
  Save,
  Settings2,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  adminLogin,
  adminLogout,
  deleteAdminPackage,
  deleteAdminService,
  getAdminDashboard,
  saveAdminPackage,
  saveAdminService,
  saveQuotation,
  updateEnquiryStatus
} from '../../services/digitalServicesApi';
import {
  DigitalService,
  DigitalServicesEnquiry,
  DigitalServicePackage,
  EnquiryStatus
} from '../../types/digitalServices';
import { QuotationInput } from '../../services/digitalServicesApi';

type AdminData = Awaited<ReturnType<typeof getAdminDashboard>>;
type AdminTab = 'enquiries' | 'packages' | 'services';
type QuoteItem = { title: string; description: string; amount: number; optional: boolean };
const statuses: EnquiryStatus[] = ['New', 'Contacted', 'Quotation Sent', 'Negotiation', 'Confirmed', 'Completed', 'Cancelled'];
const money = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const blankPackage = (): Partial<DigitalServicePackage> => ({
  name: '',
  price: 9999,
  pricePeriod: 'one-time',
  description: '',
  features: [],
  badge: '',
  enabled: true,
  displayOrder: 1
});

const blankService = (): Partial<DigitalService> => ({
  title: '',
  category: 'Design',
  price: 1499,
  pricePeriod: 'one-time',
  description: '',
  includes: [],
  icon: 'sparkles',
  imageUrl: '',
  enabled: true,
  displayOrder: 1
});

export const DigitalServicesAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [token, setToken] = useState('');
  const [tab, setTab] = useState<AdminTab>('enquiries');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [packageEditor, setPackageEditor] = useState<Partial<DigitalServicePackage> | null>(null);
  const [serviceEditor, setServiceEditor] = useState<Partial<DigitalService> | null>(null);
  const [activeEnquiry, setActiveEnquiry] = useState<DigitalServicesEnquiry | null>(null);
  const [quoteEnquiry, setQuoteEnquiry] = useState<DigitalServicesEnquiry | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [quoteDiscount, setQuoteDiscount] = useState('0');
  const [quoteTimeline, setQuoteTimeline] = useState('');
  const [quoteTerms, setQuoteTerms] = useState('');
  const [quotePaymentTerms, setQuotePaymentTerms] = useState('');
  const [savedQuote, setSavedQuote] = useState<DigitalServicesEnquiry | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminDashboard();
      setAdminData(data);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Unable to load the admin dashboard.';
      setError(message);
      if (/token|unauthorized|admin access is not configured/i.test(message)) adminLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const run = async (action: () => Promise<unknown>, successMessage: string) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      setNotice(successMessage);
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The request could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminLogin(token);
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Admin sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    adminLogout();
    setAdminData(null);
    setToken('');
    setError('');
  };

  const openQuote = (enquiry: DigitalServicesEnquiry) => {
    const items: QuoteItem[] = [
      ...(enquiry.selectedPackage ? [{
        title: enquiry.selectedPackage.name,
        description: enquiry.selectedPackage.pricePeriod === 'monthly' ? 'Monthly service' : 'One-time package',
        amount: enquiry.selectedPackage.price,
        optional: false
      }] : []),
      ...enquiry.selectedServices.map((service) => ({
        title: service.title,
        description: service.pricePeriod === 'monthly' ? 'Monthly service' : 'One-time service',
        amount: service.price,
        optional: false
      }))
    ];
    setQuoteItems(items.length ? items : [{ title: 'Consultation and project scoping', description: '', amount: 0, optional: false }]);
    setQuoteDiscount('0');
    setQuoteTimeline('');
    setQuoteTerms('Domain, hosting, paid plugins and third-party costs are excluded unless listed in this quotation.');
    setQuotePaymentTerms('Payment schedule to be agreed before work begins.');
    setSavedQuote(null);
    setQuoteEnquiry(enquiry);
  };

  const makeQuote = async () => {
    if (!quoteEnquiry) return;
    const quote: QuotationInput = {
      items: quoteItems.map((item) => ({
        title: item.title,
        description: item.description,
        amount: Number(item.amount),
        optional: item.optional
      })),
      discount: Number(quoteDiscount),
      deliveryTimeline: quoteTimeline,
      terms: quoteTerms,
      paymentTerms: quotePaymentTerms
    };
    setBusy(true);
    setError('');
    try {
      const updated = await saveQuotation(quoteEnquiry._id, quote);
      setSavedQuote(updated);
      setNotice('Quotation saved. Download the PDF or share it by email.');
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save quotation.');
    } finally {
      setBusy(false);
    }
  };

  const downloadQuote = (enquiry: DigitalServicesEnquiry) => {
    if (!enquiry.quotation) return;
    const doc = new jsPDF();
    const margin = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 22;
    doc.setFillColor(74, 21, 75);
    doc.rect(0, 0, pageWidth, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.text('HerRise Digital Services', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('PROJECT QUOTATION', margin, y + 9);
    y = 52;
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Prepared for', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${enquiry.businessName} · ${enquiry.name}`, margin, y + 7);
    doc.text(`${enquiry.email} · ${enquiry.phone}`, margin, y + 14);
    doc.text(`Enquiry ${enquiry.enquiryId} · ${new Date().toLocaleDateString('en-IN')}`, margin, y + 21);
    y += 36;
    doc.setFont('helvetica', 'bold');
    doc.text('Service', margin, y);
    doc.text('Amount', pageWidth - margin, y, { align: 'right' });
    y += 3;
    doc.setDrawColor(220, 210, 224);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    for (const item of enquiry.quotation.items) {
      if (y > 255) {
        doc.addPage();
        y = 20;
      }
      const title = `${item.title}${item.optional ? ' (optional)' : ''}`;
      const lines = doc.splitTextToSize(title, pageWidth - margin * 2 - 35);
      doc.text(lines, margin, y);
      doc.text(money(item.amount), pageWidth - margin, y, { align: 'right' });
      y += Math.max(7, lines.length * 5);
      if (item.description) {
        doc.setTextColor(115, 105, 120);
        doc.setFontSize(8);
        doc.text(doc.splitTextToSize(item.description, pageWidth - margin * 2 - 35), margin, y);
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(10);
        y += 7;
      }
    }
    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.text(`Subtotal: ${money(enquiry.quotation.subtotal)}`, pageWidth - margin, y, { align: 'right' });
    y += 7;
    doc.text(`Discount: −${money(enquiry.quotation.discount)}`, pageWidth - margin, y, { align: 'right' });
    y += 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(74, 21, 75);
    doc.text(`Quotation total: ${money(enquiry.quotation.total)}`, pageWidth - margin, y, { align: 'right' });
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const blocks = [
      ['Delivery timeline', enquiry.quotation.deliveryTimeline],
      ['Payment terms', enquiry.quotation.paymentTerms],
      ['Terms and exclusions', enquiry.quotation.terms]
    ];
    for (const [heading, text] of blocks) {
      if (!text) continue;
      if (y > 255) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text(heading, margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 6;
    }
    doc.setTextColor(115, 105, 120);
    doc.setFontSize(8);
    doc.text('This quotation is for review only. No payment is collected through HerRise.', margin, 285);
    doc.save(`HerRise-Quotation-${enquiry.enquiryId}.pdf`);
  };

  const shareQuote = (enquiry: DigitalServicesEnquiry) => {
    if (!enquiry.quotation) return;
    const subject = `HerRise quotation ${enquiry.enquiryId}`;
    const body = [
      `Hello ${enquiry.name},`,
      '',
      `Please find the quotation details for ${enquiry.businessName}.`,
      `Quotation total: ${money(enquiry.quotation.total)}`,
      `Delivery timeline: ${enquiry.quotation.deliveryTimeline || 'To be confirmed'}`,
      '',
      'Please attach the downloaded PDF quotation to this email before sending.',
      'No payment has been taken.',
      '',
      'HerRise Digital Services'
    ].join('\n');
    window.location.href = `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const removePackage = async (item: DigitalServicePackage) => {
    if (window.confirm(`Delete "${item.name}"? Existing enquiries keep their saved package details.`)) {
      await run(() => deleteAdminPackage(item._id), 'Package deleted.');
    }
  };

  const removeService = async (item: DigitalService) => {
    if (window.confirm(`Delete "${item.title}"? Existing enquiries keep their saved service details.`)) {
      await run(() => deleteAdminService(item._id), 'Service deleted.');
    }
  };

  const submitPackage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!packageEditor) return;
    await run(async () => {
      await saveAdminPackage(packageEditor as Partial<DigitalServicePackage> & { name: string });
      setPackageEditor(null);
    }, 'Package saved.');
  };

  const submitService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!serviceEditor) return;
    await run(async () => {
      await saveAdminService(serviceEditor as Partial<DigitalService> & { title: string });
      setServiceEditor(null);
    }, 'Service saved.');
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !serviceEditor) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      setError('Choose a PNG, JPEG or WebP image under 1 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setServiceEditor((current) => current ? { ...current, imageUrl: String(reader.result || '') } : current);
    reader.onerror = () => setError('Unable to read that image.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  if (!adminData) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-lg rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-9">
          <button onClick={() => navigate('/market')} className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#4A154B] hover:underline"><ArrowLeft className="h-4 w-4" />Back to HerMarket</button>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#4A154B]"><Settings2 className="h-6 w-6" /></div>
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">Digital Services Admin</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">Enter your backend admin token to manage packages, services, enquiries and quotations. The token is held only in this browser session.</p>
          <form onSubmit={login} className="mt-6 space-y-4">
            <label className="block text-xs font-semibold text-gray-700">Admin token<input required type="password" autoComplete="current-password" value={token} onChange={(e) => setToken(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#4A154B] focus:bg-white" /></label>
            {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</p>}
            <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A154B] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Sign in securely</button>
          </form>
          {error.includes('not configured') && <p className="mt-4 text-xs leading-5 text-gray-500">Configure <code>DIGITAL_SERVICES_ADMIN_TOKEN</code> in the backend environment, then restart the backend.</p>}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-purple-100 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
          <div><button onClick={() => navigate('/market')} className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#4A154B] hover:underline"><ArrowLeft className="h-3.5 w-3.5" />HerMarket</button><h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Digital Services Admin</h1><p className="mt-1 text-xs text-gray-500">Manage the catalogue and follow every customer enquiry.</p></div>
          <button onClick={signOut} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 sm:self-auto"><LogOut className="h-4 w-4" />Sign out</button>
        </div>

        {error && <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</p>}
        {notice && <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{notice}</p>}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Stat title="Total enquiries" value={adminData.stats.totalEnquiries} icon={<Users className="h-4 w-4" />} />
          <Stat title="New enquiries" value={adminData.stats.newEnquiries} icon={<ClipboardList className="h-4 w-4" />} />
          <Stat title="Confirmed projects" value={adminData.stats.confirmedProjects} icon={<Check className="h-4 w-4" />} />
          <Stat title="Completed projects" value={adminData.stats.completedProjects} icon={<Package className="h-4 w-4" />} />
          <Stat title="Total quoted value" value={money(adminData.stats.totalQuotedValue)} icon={<FilePlus2 className="h-4 w-4" />} />
        </div>
        <div className="flex flex-col justify-between gap-2 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-xs sm:flex-row sm:items-center">
          <span><strong>Estimated one-time project value:</strong> {money(adminData.stats.estimatedRevenue)} · <strong>Monthly service value:</strong> {money(adminData.stats.estimatedMonthlyValue || 0)} / month. These are estimates, not collected payments.</span>
          <span className="font-semibold text-blue-900">Actual payments: not tracked in this marketplace.</span>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-purple-100 bg-white p-2">
          {([
            ['enquiries', 'Customer enquiries', ClipboardList],
            ['packages', 'Website packages', Package],
            ['services', 'Additional services', Settings2]
          ] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${tab === id ? 'bg-[#4A154B] text-white' : 'text-gray-600 hover:bg-purple-50 hover:text-[#4A154B]'}`}><Icon className="h-4 w-4" />{label}</button>
          ))}
          <button onClick={() => void refresh()} className="ml-auto rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50" disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-3xl border border-purple-100 bg-white text-sm text-gray-500"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading dashboard…</div>
        ) : tab === 'enquiries' ? (
          <div className="space-y-3">
            {!adminData.enquiries.length && <div className="rounded-3xl border border-purple-100 bg-white p-10 text-center text-sm text-gray-500">No enquiries yet. New customer requests will appear here.</div>}
            {adminData.enquiries.map((item) => (
              <article key={item._id} className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <button onClick={() => setActiveEnquiry(activeEnquiry?._id === item._id ? null : item)} className="min-w-0 text-left">
                    <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-black text-[#4A154B]">{item.enquiryId}</span><span className="rounded-full bg-purple-50 px-2.5 py-1 text-[9px] font-bold text-[#4A154B]">{item.status}</span><span className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</span></div>
                    <h2 className="mt-2 text-sm font-extrabold text-gray-900">{item.businessName} <span className="font-medium text-gray-500">· {item.name}</span></h2>
                    <p className="mt-1 text-xs text-gray-500">{item.email} · {item.phone} · {item.category}</p>
                    <p className="mt-2 text-xs text-gray-700">{item.selectedPackage?.name || 'Custom enquiry'}{item.selectedServices.length ? ` · ${item.selectedServices.map((service) => service.title).join(', ')}` : ''}</p>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <select aria-label={`Update status for ${item.enquiryId}`} value={item.status} onChange={(event) => void run(() => updateEnquiryStatus(item._id, event.target.value as EnquiryStatus), 'Enquiry status updated.')} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[10px] font-semibold text-gray-700 outline-none focus:border-[#4A154B]">{statuses.map((status) => <option key={status}>{status}</option>)}</select>
                    <button onClick={() => openQuote(item)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#4A154B] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#350c36]"><FilePlus2 className="h-3.5 w-3.5" />{item.quotation ? 'Edit quotation' : 'Create quotation'}</button>
                  </div>
                </div>
                {activeEnquiry?._id === item._id && <EnquiryDetail item={item} />}
                {item.quotation && <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs"><span className="font-bold text-gray-700">Quote total {money(item.quotation.total)}</span><button onClick={() => downloadQuote(item)} className="inline-flex items-center gap-1 text-[#4A154B] hover:underline"><Download className="h-3.5 w-3.5" />Download PDF</button><button onClick={() => shareQuote(item)} className="inline-flex items-center gap-1 text-[#4A154B] hover:underline"><Mail className="h-3.5 w-3.5" />Prepare email</button></div>}
              </article>
            ))}
          </div>
        ) : tab === 'packages' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold text-gray-900">Website packages</h2><p className="mt-1 text-xs text-gray-500">Prices and features are stored in the database and editable here.</p></div><button onClick={() => setPackageEditor(blankPackage())} className="inline-flex items-center gap-2 rounded-xl bg-[#4A154B] px-4 py-2.5 text-xs font-bold text-white"><Plus className="h-4 w-4" />Add package</button></div>
            <div className="grid gap-4 lg:grid-cols-2">{adminData.packages.map((item) => <article key={item._id} className="rounded-2xl border border-purple-100 bg-white p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold text-gray-900">{item.name}</h3>{item.badge && <span className="rounded-full bg-pink-50 px-2 py-1 text-[9px] font-bold text-rose-700">{item.badge}</span>}<span className={`rounded-full px-2 py-1 text-[9px] font-bold ${item.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{item.enabled ? 'Enabled' : 'Hidden'}</span></div><p className="mt-2 text-xl font-black text-[#4A154B]">{money(item.price)} <small className="text-[10px] font-semibold text-gray-400">{item.pricePeriod}</small></p><p className="mt-1 text-xs text-gray-500">{item.description}</p></div><div className="flex shrink-0 gap-1"><IconButton title="Edit package" onClick={() => setPackageEditor({ ...item })}><Edit3 className="h-4 w-4" /></IconButton><IconButton title="Delete package" onClick={() => void removePackage(item)}><Trash2 className="h-4 w-4" /></IconButton></div></div><ul className="mt-4 grid gap-2 sm:grid-cols-2">{item.features.map((feature) => <li key={feature} className="flex gap-2 text-[10px] text-gray-600"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />{feature}</li>)}</ul></article>)}</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold text-gray-900">Additional services</h2><p className="mt-1 text-xs text-gray-500">Manage offerings, categories, included items, prices and imagery.</p></div><button onClick={() => setServiceEditor(blankService())} className="inline-flex items-center gap-2 rounded-xl bg-[#4A154B] px-4 py-2.5 text-xs font-bold text-white"><Plus className="h-4 w-4" />Add service</button></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{adminData.services.map((item) => <article key={item._id} className="rounded-2xl border border-purple-100 bg-white p-5"><div className="flex items-start gap-3">{item.imageUrl ? <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[#4A154B]"><Package className="h-5 w-5" /></div>}<div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-extrabold text-gray-900">{item.title}</h3><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${item.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{item.enabled ? 'Live' : 'Hidden'}</span></div><p className="mt-1 text-[10px] text-gray-500">{item.category} · {item.pricePeriod}</p><p className="mt-2 text-lg font-black text-[#4A154B]">{money(item.price)}</p></div></div><p className="mt-3 text-xs leading-5 text-gray-500">{item.description}</p><div className="mt-4 flex justify-end gap-1 border-t border-gray-100 pt-3"><IconButton title="Edit service" onClick={() => setServiceEditor({ ...item })}><Edit3 className="h-4 w-4" /></IconButton><IconButton title="Delete service" onClick={() => void removeService(item)}><Trash2 className="h-4 w-4" /></IconButton></div></article>)}</div>
          </div>
        )}

        {packageEditor && <EditorModal title={packageEditor._id ? 'Edit package' : 'Add package'} onClose={() => setPackageEditor(null)}><form onSubmit={submitPackage} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Package name" required><input required maxLength={100} value={packageEditor.name || ''} onChange={(e) => setPackageEditor({ ...packageEditor, name: e.target.value })} /></Field><Field label="Price (INR)" required><input required type="number" min="0" step="1" value={packageEditor.price ?? ''} onChange={(e) => setPackageEditor({ ...packageEditor, price: Number(e.target.value) })} /></Field></div>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Billing period"><select value={packageEditor.pricePeriod || 'one-time'} onChange={(e) => setPackageEditor({ ...packageEditor, pricePeriod: e.target.value as DigitalServicePackage['pricePeriod'] })}><option value="one-time">One-time</option><option value="monthly">Monthly</option></select></Field><Field label="Badge (optional)"><input maxLength={40} placeholder="MOST POPULAR" value={packageEditor.badge || ''} onChange={(e) => setPackageEditor({ ...packageEditor, badge: e.target.value })} /></Field></div>
          <Field label="Short description" required><textarea required maxLength={500} rows={2} value={packageEditor.description || ''} onChange={(e) => setPackageEditor({ ...packageEditor, description: e.target.value })} /></Field>
          <Field label="Features (one per line)" required><textarea required rows={7} value={(packageEditor.features || []).join('\n')} onChange={(e) => setPackageEditor({ ...packageEditor, features: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })} /></Field>
          <EditorFooter busy={busy} enabled={packageEditor.enabled !== false} onEnabled={(enabled) => setPackageEditor({ ...packageEditor, enabled })} onCancel={() => setPackageEditor(null)} />
        </form></EditorModal>}

        {serviceEditor && <EditorModal title={serviceEditor._id ? 'Edit service' : 'Add service'} onClose={() => setServiceEditor(null)}><form onSubmit={submitService} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Service title" required><input required maxLength={100} value={serviceEditor.title || ''} onChange={(e) => setServiceEditor({ ...serviceEditor, title: e.target.value })} /></Field><Field label="Category" required><input required maxLength={60} value={serviceEditor.category || ''} onChange={(e) => setServiceEditor({ ...serviceEditor, category: e.target.value })} /></Field></div>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Starting price (INR)" required><input required type="number" min="0" step="1" value={serviceEditor.price ?? ''} onChange={(e) => setServiceEditor({ ...serviceEditor, price: Number(e.target.value) })} /></Field><Field label="Billing period"><select value={serviceEditor.pricePeriod || 'one-time'} onChange={(e) => setServiceEditor({ ...serviceEditor, pricePeriod: e.target.value as DigitalService['pricePeriod'] })}><option value="one-time">One-time</option><option value="monthly">Monthly</option></select></Field></div>
          <Field label="Description" required><textarea required maxLength={500} rows={2} value={serviceEditor.description || ''} onChange={(e) => setServiceEditor({ ...serviceEditor, description: e.target.value })} /></Field>
          <Field label="What's included (one per line)" required><textarea required rows={4} value={(serviceEditor.includes || []).join('\n')} onChange={(e) => setServiceEditor({ ...serviceEditor, includes: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })} /></Field>
          <Field label="Icon name"><input maxLength={40} value={serviceEditor.icon || ''} onChange={(e) => setServiceEditor({ ...serviceEditor, icon: e.target.value })} /></Field>
          <Field label="Image URL (optional)"><input type="url" maxLength={2000} placeholder="https://…" value={serviceEditor.imageUrl?.startsWith('data:') ? '' : serviceEditor.imageUrl || ''} onChange={(e) => setServiceEditor({ ...serviceEditor, imageUrl: e.target.value })} /></Field>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-purple-200 bg-purple-50/60 px-4 py-3 text-xs font-semibold text-[#4A154B] hover:bg-purple-50"><ImagePlus className="h-4 w-4" />Upload PNG, JPEG or WebP (max 1 MB)<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleImageUpload} /></label>
          {serviceEditor.imageUrl && <div className="flex items-center gap-3"><img src={serviceEditor.imageUrl} alt="Service preview" className="h-14 w-14 rounded-xl object-cover" /><button type="button" onClick={() => setServiceEditor({ ...serviceEditor, imageUrl: '' })} className="text-xs font-semibold text-rose-600 hover:underline">Remove image</button></div>}
          <EditorFooter busy={busy} enabled={serviceEditor.enabled !== false} onEnabled={(enabled) => setServiceEditor({ ...serviceEditor, enabled })} onCancel={() => setServiceEditor(null)} />
        </form></EditorModal>}

        {quoteEnquiry && <EditorModal title={`Quotation · ${quoteEnquiry.enquiryId}`} onClose={() => setQuoteEnquiry(null)} wide>
          <div className="space-y-4">
            <div className="rounded-xl bg-purple-50 p-3 text-xs text-purple-900"><strong>{quoteEnquiry.businessName}</strong> · {quoteEnquiry.name} · {quoteEnquiry.email}</div>
            <div className="space-y-2">{quoteItems.map((item, index) => <div key={index} className="grid gap-2 rounded-xl border border-gray-100 p-3 sm:grid-cols-[1fr_130px_auto]"><div className="grid gap-2 sm:grid-cols-2"><input aria-label="Line item title" required maxLength={120} placeholder="Service or charge" value={item.title} onChange={(e) => setQuoteItems(quoteItems.map((x, i) => i === index ? { ...x, title: e.target.value } : x))} className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#4A154B]" /><input aria-label="Line item description" placeholder="Description (optional)" value={item.description} onChange={(e) => setQuoteItems(quoteItems.map((x, i) => i === index ? { ...x, description: e.target.value } : x))} className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#4A154B]" /></div><input aria-label="Line item amount" type="number" min="0" step="1" value={item.amount} onChange={(e) => setQuoteItems(quoteItems.map((x, i) => i === index ? { ...x, amount: Number(e.target.value) } : x))} className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#4A154B]" /><div className="flex items-center justify-between gap-2"><label className="flex items-center gap-1.5 text-[10px] text-gray-600"><input type="checkbox" checked={item.optional} onChange={(e) => setQuoteItems(quoteItems.map((x, i) => i === index ? { ...x, optional: e.target.checked } : x))} />Optional</label><button type="button" onClick={() => setQuoteItems(quoteItems.filter((_, i) => i !== index))} aria-label="Remove item" className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"><X className="h-4 w-4" /></button></div></div>)}</div>
            <button onClick={() => setQuoteItems([...quoteItems, { title: '', description: '', amount: 0, optional: false }])} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A154B] hover:underline"><Plus className="h-4 w-4" />Add service or custom charge</button>
            <div className="grid gap-3 sm:grid-cols-2"><Field label="Discount (INR)"><input type="number" min="0" step="1" value={quoteDiscount} onChange={(e) => setQuoteDiscount(e.target.value)} /></Field><Field label="Delivery timeline"><input maxLength={200} placeholder="e.g. 3–4 weeks from approval" value={quoteTimeline} onChange={(e) => setQuoteTimeline(e.target.value)} /></Field></div>
            <div className="grid gap-3 sm:grid-cols-2"><Field label="Payment terms"><textarea rows={2} maxLength={1000} value={quotePaymentTerms} onChange={(e) => setQuotePaymentTerms(e.target.value)} /></Field><Field label="Terms and conditions"><textarea rows={2} maxLength={3000} value={quoteTerms} onChange={(e) => setQuoteTerms(e.target.value)} /></Field></div>
            <QuoteTotals items={quoteItems} discount={Number(quoteDiscount)} />
            {savedQuote && <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4"><button onClick={() => downloadQuote(savedQuote)} className="inline-flex items-center gap-2 rounded-xl bg-[#4A154B] px-4 py-2.5 text-xs font-bold text-white"><Download className="h-4 w-4" />Download PDF</button><button onClick={() => shareQuote(savedQuote)} className="inline-flex items-center gap-2 rounded-xl border border-purple-200 px-4 py-2.5 text-xs font-bold text-[#4A154B]"><Mail className="h-4 w-4" />Prepare customer email</button></div>}
            <div className="flex justify-end border-t border-gray-100 pt-4"><button disabled={busy || !quoteItems.length} onClick={() => void makeQuote()} className="inline-flex items-center gap-2 rounded-xl bg-[#4A154B] px-5 py-3 text-xs font-bold text-white disabled:opacity-50">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save quotation</button></div>
            <p className="text-[10px] leading-4 text-gray-400">Saving stores the quotation and marks the enquiry “Quotation Sent.” The email action opens your email app; attach the downloaded PDF before sending.</p>
          </div>
        </EditorModal>}
      </div>
    </DashboardLayout>
  );
};

const Stat: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="rounded-2xl border border-purple-100 bg-white p-4"><div className="flex items-center justify-between text-gray-400"><span className="text-[10px] font-semibold">{title}</span><span className="text-[#4A154B]">{icon}</span></div><p className="mt-3 truncate text-xl font-black text-gray-900">{value}</p></div>
);

const EnquiryDetail: React.FC<{ item: DigitalServicesEnquiry }> = ({ item }) => (
  <div className="mt-4 grid gap-4 rounded-2xl bg-[#faf8fb] p-4 sm:grid-cols-2">
    <div><p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Project description</p><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-gray-700">{item.projectDescription}</p><p className="mt-3 text-[10px] text-gray-500">Preferred contact: {item.preferredContact} · Estimated starting budget: {money(item.estimatedBudget)}</p></div>
    <div><p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Selected services</p><ul className="mt-2 space-y-1.5 text-xs text-gray-700">{item.selectedPackage && <li>{item.selectedPackage.name} — {money(item.selectedPackage.price)}</li>}{item.selectedServices.map((service, index) => <li key={`${service.serviceId}-${index}`}>{service.title} — {money(service.price)} {service.pricePeriod === 'monthly' ? '/ month' : 'one-time'}</li>)}{!item.selectedPackage && !item.selectedServices.length && <li>Consultation and custom requirements</li>}</ul></div>
  </div>
);

const IconButton: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button title={title} aria-label={title} onClick={onClick} className="rounded-lg p-2 text-gray-500 hover:bg-purple-50 hover:text-[#4A154B]">{children}</button>
);

const EditorModal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }> = ({ title, onClose, children, wide }) => (
  <div role="presentation" className="fixed inset-0 z-[110] flex items-end justify-center bg-gray-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-label={title} className={`max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7 ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-lg font-extrabold text-gray-900">{title}</h2><button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
      {children}
    </section>
  </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block text-[11px] font-semibold text-gray-700">{label}{required && <span className="text-rose-500"> *</span>}<div className="mt-1.5 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:bg-gray-50 [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-xs [&_input]:font-normal [&_input]:outline-none [&_input]:focus:border-[#4A154B] [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-gray-200 [&_select]:bg-gray-50 [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-xs [&_select]:font-normal [&_select]:outline-none [&_select]:focus:border-[#4A154B] [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-gray-200 [&_textarea]:bg-gray-50 [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-xs [&_textarea]:font-normal [&_textarea]:outline-none [&_textarea]:focus:border-[#4A154B]">{children}</div></label>
);

const EditorFooter: React.FC<{ busy: boolean; enabled: boolean; onEnabled: (enabled: boolean) => void; onCancel: () => void }> = ({ busy, enabled, onEnabled, onCancel }) => (
  <div className="flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center"><label className="flex items-center gap-2 text-xs font-semibold text-gray-600"><input type="checkbox" checked={enabled} onChange={(e) => onEnabled(e.target.checked)} />Visible to customers</label><div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600">Cancel</button><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#4A154B] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save</button></div></div>
);

const QuoteTotals: React.FC<{ items: QuoteItem[]; discount: number }> = ({ items, discount }) => {
  const subtotal = items.filter((item) => !item.optional).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return <div className="ml-auto max-w-xs space-y-1.5 rounded-xl bg-purple-50 p-4 text-xs"><p className="flex justify-between"><span>Required services subtotal</span><strong>{money(subtotal)}</strong></p><p className="flex justify-between"><span>Discount</span><strong>−{money(discount)}</strong></p><p className="flex justify-between border-t border-purple-100 pt-2 text-sm text-[#4A154B]"><span className="font-bold">Quotation total</span><strong>{money(Math.max(0, subtotal - discount))}</strong></p><p className="text-[9px] text-gray-500">Optional items are shown separately and excluded unless agreed.</p></div>;
};