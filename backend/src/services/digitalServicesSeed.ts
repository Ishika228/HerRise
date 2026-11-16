import mongoose from 'mongoose';
import { DigitalServiceModel, DigitalServicePackageModel } from '../models/DigitalServicesModels.js';

export const defaultPackages = [
  {
    _id: '650000000000000000000001',
    name: 'Starter Website',
    slug: 'starter-website',
    price: 9999,
    pricePeriod: 'one-time',
    description: 'Perfect for small businesses and startups.',
    features: [
      '1–3 website pages',
      'Responsive mobile-friendly design',
      'Modern UI',
      'WhatsApp integration',
      'Contact form',
      'Google Maps integration',
      'Social media links',
      'Basic SEO setup',
      '1 month technical support'
    ],
    badge: '',
    enabled: true,
    displayOrder: 1
  },
  {
    _id: '650000000000000000000002',
    name: 'Business Growth',
    slug: 'business-growth',
    price: 19999,
    pricePeriod: 'one-time',
    description: 'Perfect for growing businesses that want more customers.',
    features: [
      '5–7 website pages',
      'Premium custom design',
      'Mobile responsive layout',
      'WhatsApp integration',
      'Contact and enquiry forms',
      'SEO-friendly structure',
      'Google Business Profile assistance',
      'Social media integration',
      'Lead generation section',
      '2 months technical support'
    ],
    badge: 'MOST POPULAR',
    enabled: true,
    displayOrder: 2
  },
  {
    _id: '650000000000000000000003',
    name: 'Premium Business',
    slug: 'premium-business',
    price: 34999,
    pricePeriod: 'one-time',
    description: 'Complete digital presence for ambitious businesses.',
    features: [
      'Up to 12 website pages',
      'Premium UI/UX design',
      'Product or service catalogue',
      'Advanced enquiry forms',
      'SEO setup',
      'Google Analytics integration',
      'Blog functionality',
      'Speed optimization',
      'WhatsApp integration',
      '3 months technical support'
    ],
    badge: 'PREMIUM',
    enabled: true,
    displayOrder: 3
  }
];

export const defaultServices = [
  ['650000000000000000000011', 'Social Media Management', 'Social Media', 4999, 'monthly', 'Consistent, on-brand social content and community support.', ['Content calendar', '8 posts per month', 'Monthly performance summary'], 'share-2'],
  ['650000000000000000000012', 'Digital Marketing', 'Marketing', 7999, 'monthly', 'Campaign planning and optimization for your digital channels.', ['Campaign planning', 'Audience and channel strategy', 'Monthly report'], 'megaphone'],
  ['650000000000000000000013', 'SEO Services', 'Marketing', 5999, 'monthly', 'Technical and on-page improvements to help customers discover your site.', ['On-page SEO review', 'Keyword recommendations', 'Monthly progress report'], 'search'],
  ['650000000000000000000014', 'Logo Design', 'Design', 1999, 'one-time', 'A distinctive logo direction designed around your business.', ['Two initial concepts', 'One selected direction refined', 'Web-ready files'], 'palette'],
  ['650000000000000000000015', 'Business Branding', 'Branding', 3999, 'one-time', 'A cohesive visual foundation for your brand.', ['Color palette', 'Typography direction', 'Basic brand usage guide'], 'sparkles'],
  ['650000000000000000000016', 'Social Media Creatives (10 designs)', 'Design', 1499, 'one-time', 'A set of ready-to-publish visuals for your social channels.', ['10 custom post designs', 'One revision round', 'Social-ready exports'], 'image'],
  ['650000000000000000000017', 'Promotional Video Editing', 'Video', 2499, 'one-time', 'A concise promotional edit using footage and assets you provide.', ['One short-form edit', 'Captions and basic transitions', 'One revision round'], 'video'],
  ['650000000000000000000018', 'Google Business Profile Setup', 'Marketing', 1499, 'one-time', 'Profile setup guidance to help customers find your business details.', ['Profile setup assistance', 'Business details and category review', 'Photo and link checklist'], 'map-pin'],
  ['650000000000000000000019', 'Website Maintenance', 'Website', 1999, 'monthly', 'Routine website care and small updates to keep things running smoothly.', ['Routine health checks', 'Small content updates', 'Monthly maintenance summary'], 'wrench']
].map(([id, title, category, price, pricePeriod, description, includes, icon], index) => ({
  _id: id,
  title,
  category,
  price: Number(price),
  pricePeriod,
  description,
  includes,
  icon,
  enabled: true,
  displayOrder: index + 1
}));

export async function seedDigitalServicesIfEmpty(): Promise<void> {
  const legacyServices = await DigitalServiceModel.collection.find({
    $or: [
      { billing: { $exists: true } },
      { included: { $exists: true } },
      { sortOrder: { $exists: true } }
    ]
  }).toArray();
  for (const service of legacyServices) {
    const iconMap: Record<string, string> = {
      Share2: 'share-2',
      Megaphone: 'megaphone',
      Search: 'search',
      PenTool: 'palette',
      Palette: 'palette',
      Images: 'image',
      Clapperboard: 'video',
      MapPin: 'map-pin',
      Wrench: 'wrench'
    };
    await DigitalServiceModel.collection.updateOne(
      { _id: service._id },
      {
        $set: {
          pricePeriod: service.pricePeriod || service.billing || 'one-time',
          includes: service.includes || service.included || [],
          displayOrder: service.displayOrder ?? service.sortOrder ?? 0,
          icon: iconMap[service.icon] || String(service.icon || 'sparkles').toLowerCase(),
          imageUrl: service.imageUrl || ''
        },
        $unset: { billing: '', included: '', sortOrder: '' }
      }
    );
  }

  const [packageCount, serviceCount] = await Promise.all([
    DigitalServicePackageModel.countDocuments(),
    DigitalServiceModel.countDocuments()
  ]);
  if (packageCount === 0) {
    await DigitalServicePackageModel.insertMany(defaultPackages.map((item) => ({
      ...item,
      _id: new mongoose.Types.ObjectId(item._id)
    })));
  }
  if (serviceCount === 0) {
    await DigitalServiceModel.insertMany(defaultServices.map((item) => ({
      ...item,
      _id: new mongoose.Types.ObjectId(String(item._id))
    })));
  }
}
