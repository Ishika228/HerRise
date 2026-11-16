import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Image,
  LoaderCircle,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  Search,
  Share2,
  Sparkles,
  Video,
  Wrench,
  X
} from 'lucide-react';
import { getDigitalServicesCatalog, submitDigitalServicesEnquiry } from '../../services/digitalServicesApi';
import { DigitalService, DigitalServicePackage, DigitalServicesCatalog, EnquiryInput } from '../../types/digitalServices';

const iconMap = {
  'share-2': Share2,
  megaphone: Megaphone,
  search: Search,
  palette: Palette,
  sparkles: Sparkles,
  image: Image,
  video: Video,
  'map-pin': MapPin,
  wrench: Wrench,
  code: Code2
} as const;

const emptyForm = {
  name: '',
  businessName: '',
  phone: '',
  email: '',
  category: '',
  projectDescription: '',
  preferredContact: 'WhatsApp' as EnquiryInput['preferredContact'],
  website: ''
};

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

export const DigitalServicesPage: React.FC = () => {
  const [catalog, setCatalog] = useState<DigitalServicesCatalog | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<DigitalServicePackage | undefined>();
  const [consultationOnly, setConsultationOnly] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedId, setSubmittedId] = useState('');

  useEffect(() => {
    let active = true;
    getDigitalServicesCatalog()
      .then((result) => {
        if (active) setCatalog(result);
      })
      .catch((error: Error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const chosenServices = useMemo(
    () => catalog?.services.filter((service) => selectedServices.includes(service._id)) || [],
    [catalog, selectedServices]
  );
  const estimatedTotal = (selectedPackage?.price || 0) +
    chosenServices.reduce((total, service) => total + service.price, 0);

  const openEnquiry = (options: {
    package?: DigitalServicePackage;
    serviceIds?: string[];
    consultation?: boolean;
  } = {}) => {
    setSelectedPackage(options.package);
    setSelectedServices(options.serviceIds || []);
    setConsultationOnly(Boolean(options.consultation));
    setSubmittedId('');
    setFormError('');
    setEnquiryOpen(true);
  };

  const toggleService = (id: string) => {
    setSelectedServices((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const input: EnquiryInput = {
        name: form.name,
        businessName: form.businessName,
        phone: form.phone,
        email: form.email,
        category: form.category,
        packageId: selectedPackage?._id,
        serviceIds: selectedServices,
        projectDescription: form.projectDescription,
        preferredContact: form.preferredContact,
        enquiryType: consultationOnly ? 'consultation' : undefined,
        website: form.website
      };
      const result = await submitDigitalServicesEnquiry(input);
      setSubmittedId(result.enquiryId);
      setForm(emptyForm);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to send your enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = catalog?.whatsappNumber
    ? `https://wa.me/${catalog.whatsappNumber}?text=${encodeURIComponent('Hi, I would like to know more about HerRise digital services.')}`
    : '';

  return (
    <div className="space-y-12 pb-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#2f1031] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-9 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute bottom-0 right-[15%] h-48 w-48 rounded-full bg-[#fb7185]/10 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-purple-100">
              <Sparkles className="h-3.5 w-3.5 text-[#fb7185]" />
              HerMarket Digital Studio
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Take Your Business to the <span className="text-[#ff9aaa]">Digital World</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-purple-100/85 sm:text-base">
              We help small businesses build their online presence with professional websites,
              digital marketing, branding and creative solutions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#website-packages" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fb7185] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#f45f78]">
                Explore Packages <ArrowDown className="h-4 w-4" />
              </a>
              <button onClick={() => openEnquiry({ consultation: true })} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Get a Free Consultation <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-purple-100/75">
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-300" />Clear, upfront pricing</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-emerald-300" />No payment until agreed</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>
                <span className="text-[10px] font-medium tracking-wide text-purple-100/70">YOUR DIGITAL PRESENCE</span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="col-span-2 rounded-2xl bg-[#fff9f6] p-5 text-[#351536]">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#4A154B] text-white"><Code2 className="h-5 w-5" /></div>
                  <div className="h-2.5 w-3/4 rounded-full bg-[#4A154B]/80" />
                  <div className="mt-2 h-2 w-1/2 rounded-full bg-[#4A154B]/15" />
                  <div className="mt-5 inline-flex rounded-lg bg-[#fb7185] px-3 py-1.5 text-[10px] font-bold text-white">A website that feels like you</div>
                </div>
                <div className="rounded-2xl bg-[#fae8ec] p-4 text-[#4A154B]">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white"><Palette className="h-4 w-4" /></div>
                  <div className="text-xs font-bold">Build your brand</div>
                  <div className="mt-1 text-[10px] text-gray-500">A look customers remember</div>
                </div>
                <div className="rounded-2xl bg-[#efe9f5] p-4 text-[#4A154B]">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white"><Megaphone className="h-4 w-4" /></div>
                  <div className="text-xs font-bold">Reach new people</div>
                  <div className="mt-1 text-[10px] text-gray-500">Marketing made clear</div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-xs">
                <span className="text-purple-100/80">Made for your next chapter</span>
                <ArrowRight className="h-4 w-4 text-[#ff9aaa]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {loadError && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          We couldn’t load the live service catalogue: {loadError}. You can still browse; enquiries need the backend and database to be available.
        </div>
      )}

      <section id="website-packages" className="scroll-mt-8 space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#9b667e]">Website development</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">A website package for your next stage</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Choose a clear starting point. We’ll confirm your scope and final quotation with you before any work begins.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500"><CircleHelp className="h-4 w-4" />No checkout or payment is taken here</span>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-3xl border border-purple-100 bg-white text-sm text-gray-500"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading packages…</div>
        ) : !catalog?.packages.length ? (
          <div className="rounded-3xl border border-purple-100 bg-white p-8 text-sm text-gray-500">Packages are temporarily unavailable. Please try again later.</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {catalog.packages.map((plan) => (
              <PackageCard key={plan._id} plan={plan} onChoose={() => openEnquiry({ package: plan })} />
            ))}
          </div>
        )}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-xs leading-5 text-amber-950">
          <strong>Transparent extras:</strong> Domain registration, hosting, paid plugins, premium stock assets and other third-party expenses are not included. We’ll identify any such costs separately in your quotation.
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#9b667e]">More ways we help</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">More Ways We Help Your Business</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">Practical creative and growth services, with clear starting prices and deliverables.</p>
        </div>
        {loading ? (
          <div className="flex min-h-36 items-center justify-center rounded-3xl border border-purple-100 bg-white text-sm text-gray-500"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading services…</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(catalog?.services || []).map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                selected={selectedServices.includes(service._id)}
                onSelect={() => openEnquiry({ serviceIds: [service._id] })}
                onToggle={() => toggleService(service._id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-3xl bg-[#4A154B] p-7 text-white sm:p-9">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-100">Made to fit your goals</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Build your own service bundle</h2>
          <p className="mt-3 text-sm leading-6 text-purple-100/80">Select the services you need and see their published starting prices together. No automatic discounts are applied.</p>
          <a href="#service-catalog" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-pink-200">Choose from services <ArrowDown className="h-4 w-4" /></a>
        </div>
        <div id="service-catalog" className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Your custom package</h3>
              <p className="mt-1 text-xs text-gray-500">Choose services above to build your estimate.</p>
            </div>
            <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-semibold text-[#4A154B]">Starting prices · INR</span>
          </div>
          {chosenServices.length ? (
            <ul className="mt-5 divide-y divide-gray-100">
              {chosenServices.map((service) => (
                <li key={service._id} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0 text-sm font-semibold text-gray-800">{service.title}<small className="ml-2 text-[10px] font-medium text-gray-400">{periodLabel(service.pricePeriod)}</small></span>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(service.price)}</span>
                    <button onClick={() => toggleService(service._id)} aria-label={`Remove ${service.title}`} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"><X className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-200 px-4 py-7 text-center text-xs text-gray-500">Your selected services will appear here.</div>
          )}
          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-end">
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Estimated starting budget</p><p className="mt-1 text-2xl font-black text-[#4A154B]">{formatPrice(estimatedTotal)}{chosenServices.some((item) => item.pricePeriod === 'monthly') && <span className="ml-1 text-xs font-semibold">+ monthly services</span>}</p></div>
            <button disabled={!chosenServices.length} onClick={() => openEnquiry({ serviceIds: selectedServices })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A154B] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#350c36] disabled:cursor-not-allowed disabled:opacity-40">Request a custom quotation <ArrowRight className="h-4 w-4" /></button>
          </div>
          <p className="mt-3 text-[10px] leading-4 text-gray-400">An estimate only. Monthly and one-time amounts are shown as published and are not combined into a payment total.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-9">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#9b667e]">A clear process</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900">From first conversation to launch</h2>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {[
            ['01', 'Tell us what you need', 'Share your business, goals and preferred contact method.'],
            ['02', 'Review your quotation', 'We confirm scope, timeline, exclusions and any optional services.'],
            ['03', 'Approve before we begin', 'Work starts only after you approve the proposal and terms.']
          ].map(([number, title, copy]) => (
            <div key={number} className="rounded-2xl bg-[#faf8fb] p-5">
              <span className="text-xs font-black text-[#fb7185]">{number}</span>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-gray-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-3xl bg-[#f3edf5] p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-gray-500">The details before you get started.</p>
          {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4A154B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#350c36]"><MessageCircle className="h-4 w-4" />Chat with us on WhatsApp</a>}
        </div>
        <div className="space-y-2">
          <Faq title="Are domains and hosting included?" body="No. Domain, hosting, paid plugins, and other third-party expenses are quoted separately so you can see those costs clearly." />
          <Faq title="Do I need to pay to submit an enquiry?" body="No payment is taken when you send an enquiry. We’ll discuss your requirements and share a quotation for your approval." />
          <Faq title="Are monthly services billed once or every month?" body="Monthly services are recurring. The price label is shown on each service; billing start dates and terms are confirmed in the quotation." />
          <Faq title="Can I request services not listed here?" body="Yes. Use the consultation or custom quotation form and describe the outcome you’re looking for." />
        </div>
      </section>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-purple-100 bg-white px-5 py-4 text-xs sm:flex-row">
        <p className="text-gray-500">Need a recommendation? Tell us about your business and we’ll help scope a good fit.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => openEnquiry({ consultation: true })} className="font-bold text-[#4A154B] hover:underline">Request a free consultation</button>
          <Link to="/market/admin" className="text-[10px] text-gray-400 hover:text-[#4A154B]">Admin</Link>
        </div>
      </div>

      {enquiryOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !submitting) setEnquiryOpen(false);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="enquiry-title" className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
              <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b667e]">No payment required</p><h2 id="enquiry-title" className="mt-1 text-xl font-extrabold text-gray-900">{submittedId ? 'Enquiry received' : consultationOnly ? 'Get a free consultation' : 'Tell us about your project'}</h2></div>
              <button onClick={() => setEnquiryOpen(false)} aria-label="Close enquiry form" className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800"><X className="h-5 w-5" /></button>
            </div>
            {submittedId ? (
              <div className="px-6 py-10 text-center sm:px-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-7 w-7" /></div>
                <h3 className="mt-4 text-xl font-extrabold text-gray-900">Thanks — your request is in.</h3>
                <p className="mt-2 text-sm text-gray-500">We’ve saved your enquiry. No payment has been taken.</p>
                <p className="mt-5 inline-flex rounded-xl bg-purple-50 px-4 py-2 text-sm font-bold text-[#4A154B]">Enquiry ID: {submittedId}</p>
                <p className="mt-4 text-xs text-gray-400">Keep this ID for your records.</p>
                <button onClick={() => setEnquiryOpen(false)} className="mt-6 rounded-xl bg-[#4A154B] px-5 py-2.5 text-xs font-bold text-white">Done</button>
              </div>
            ) : (
              <form onSubmit={submitEnquiry} className="space-y-5 px-5 py-5 sm:px-7">
                <div className="rounded-2xl bg-[#faf8fb] p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-800">Your request</span><span className="text-[10px] text-gray-400">Estimated starting budget</span></div>
                  <p className="mt-2 text-xs leading-5 text-gray-600">{selectedPackage?.name || (chosenServices.length ? chosenServices.map((item) => item.title).join(', ') : 'Free consultation')}{consultationOnly && selectedPackage ? ' · Consultation' : ''}</p>
                  {!consultationOnly && <p className="mt-2 text-sm font-extrabold text-[#4A154B]">{estimatedTotal ? formatPrice(estimatedTotal) : 'Custom quotation'}{chosenServices.some((item) => item.pricePeriod === 'monthly') && <span className="text-[10px] font-semibold"> + recurring monthly services</span>}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Your name" required><input required minLength={2} maxLength={120} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
                  <FormField label="Business name" required><input required minLength={2} maxLength={120} autoComplete="organization" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></FormField>
                  <FormField label="Phone number" required><input required type="tel" minLength={7} maxLength={30} autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
                  <FormField label="Email address" required><input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
                  <FormField label="Business category" required><input required minLength={2} maxLength={80} placeholder="e.g. Food, wellness, retail" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
                  <FormField label="Preferred contact"><select value={form.preferredContact} onChange={(e) => setForm({ ...form, preferredContact: e.target.value as EnquiryInput['preferredContact'] })}><option>WhatsApp</option><option>Phone</option><option>Email</option></select></FormField>
                </div>
                <FormField label="Tell us about your business and what you need" required><textarea required minLength={10} maxLength={3000} rows={4} value={form.projectDescription} onChange={(e) => setForm({ ...form, projectDescription: e.target.value })} placeholder="Your goals, requirements, existing website or any timing details…" /></FormField>
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></label></div>
                {formError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{formError}</p>}
                <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                  <p className="max-w-sm text-[10px] leading-4 text-gray-400">We’ll use these details only to respond to your enquiry. Submitting does not place an order or authorize payment.</p>
                  <button disabled={submitting} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A154B] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#350c36] disabled:opacity-60">{submitting ? <><LoaderCircle className="h-4 w-4 animate-spin" />Sending…</> : <>Send enquiry <ArrowRight className="h-4 w-4" /></>}</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

const PackageCard: React.FC<{ plan: DigitalServicePackage; onChoose: () => void }> = ({ plan, onChoose }) => (
  <article className={`relative flex flex-col rounded-3xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl ${plan.badge === 'MOST POPULAR' ? 'border-[#4A154B] shadow-lg shadow-purple-900/10' : 'border-purple-100 shadow-sm'}`}>
    {plan.badge && <span className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-[9px] font-black tracking-[.12em] text-white ${plan.badge === 'PREMIUM' ? 'bg-[#fb7185]' : 'bg-[#4A154B]'}`}>{plan.badge}</span>}
    <div className="mt-1 flex items-start justify-between gap-3"><div><h3 className="text-lg font-extrabold text-gray-900">{plan.name}</h3><p className="mt-2 min-h-10 text-xs leading-5 text-gray-500">{plan.description}</p></div><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#4A154B]"><Code2 className="h-5 w-5" /></div></div>
    <div className="mt-5"><span className="text-3xl font-black tracking-tight text-[#4A154B]">{formatPrice(plan.price)}</span><span className="ml-1 text-[10px] font-semibold text-gray-400">{periodLabel(plan.pricePeriod)}</span></div>
    <div className="my-5 h-px bg-gray-100" />
    <ul className="flex-1 space-y-3">
      {plan.features.map((feature) => <li key={feature} className="flex gap-2.5 text-xs leading-5 text-gray-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{feature}</li>)}
    </ul>
    <button onClick={onChoose} className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${plan.badge === 'MOST POPULAR' ? 'bg-[#4A154B] text-white hover:bg-[#350c36]' : 'border border-purple-200 bg-white text-[#4A154B] hover:bg-purple-50'}`}>{plan.name === 'Starter Website' ? 'Get Started' : plan.name === 'Business Growth' ? 'Choose Growth Plan' : plan.name === 'Premium Business' ? 'Go Premium' : 'Enquire about this package'} <ArrowRight className="h-4 w-4" /></button>
  </article>
);

const ServiceCard: React.FC<{ service: DigitalService; selected: boolean; onSelect: () => void; onToggle: () => void }> = ({ service, selected, onSelect, onToggle }) => {
  const Icon = iconMap[service.icon as keyof typeof iconMap] || Sparkles;
  return (
    <article className="group flex flex-col rounded-3xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-purple-50 text-[#4A154B] transition group-hover:bg-[#4A154B] group-hover:text-white">{service.imageUrl ? <img src={service.imageUrl} alt="" className="h-full w-full object-cover" /> : <Icon className="h-5 w-5" />}</div><button type="button" onClick={onToggle} className={`rounded-full border px-2.5 py-1 text-[9px] font-bold transition ${selected ? 'border-[#4A154B] bg-[#4A154B] text-white' : 'border-gray-200 text-gray-500 hover:border-[#4A154B] hover:text-[#4A154B]'}`}>{selected ? 'Added' : '+ Add to bundle'}</button></div>
      <p className="mt-4 text-[9px] font-bold uppercase tracking-[.14em] text-[#a3758a]">{service.category}</p>
      <h3 className="mt-1 text-sm font-extrabold text-gray-900">{service.title}</h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-gray-500">{service.description}</p>
      <div className="mt-3 flex items-baseline gap-1"><span className="text-xl font-black text-[#4A154B]">{formatPrice(service.price)}</span><span className="text-[10px] text-gray-400">{periodLabel(service.pricePeriod)}</span></div>
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="mb-2 text-[10px] font-bold text-gray-700">What’s included</p>
        <ul className="space-y-1.5">{service.includes.slice(0, 3).map((item) => <li key={item} className="flex gap-2 text-[10px] leading-4 text-gray-500"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />{item}</li>)}</ul>
      </div>
      <button onClick={onSelect} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 px-3 py-2.5 text-[11px] font-bold text-[#4A154B] transition hover:bg-purple-50">Get This Service <ArrowRight className="h-3.5 w-3.5" /></button>
    </article>
  );
};

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block text-xs font-semibold text-gray-700">{label}{required && <span className="ml-1 text-rose-500">*</span>}<div className="mt-1.5 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:bg-gray-50 [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-xs [&_input]:font-normal [&_input]:outline-none [&_input]:transition [&_input]:focus:border-[#4A154B] [&_input]:focus:bg-white [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-gray-200 [&_select]:bg-gray-50 [&_select]:px-3.5 [&_select]:py-2.5 [&_select]:text-xs [&_select]:font-normal [&_select]:outline-none [&_select]:focus:border-[#4A154B] [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-gray-200 [&_textarea]:bg-gray-50 [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:text-xs [&_textarea]:font-normal [&_textarea]:outline-none [&_textarea]:focus:border-[#4A154B]">{children}</div></label>
);

const Faq: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <details className="group rounded-xl border border-purple-100 bg-white px-4 py-3">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-bold text-gray-800">{title}<ChevronDown className="h-4 w-4 shrink-0 text-[#4A154B] transition group-open:rotate-180" /></summary>
    <p className="mt-3 pr-6 text-xs leading-5 text-gray-500">{body}</p>
  </details>
);

function periodLabel(period: string) {
  return period === 'monthly' ? '/ month' : 'one-time';
}