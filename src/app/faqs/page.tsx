import { Metadata } from 'next';
import FaqsContent, { FaqItem } from './faqs-content';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs)',
  description: 'Find answers to common questions about booking hostels, student PGs, verification, zero-brokerage terms, and listing properties on Hobo Livings.',
};

const faqsList: FaqItem[] = [
  {
    q: "What is Hobo Livings?",
    a: "Hobo Livings is a tech-driven platform helping students and working professionals find safe, verified, and affordable accommodations like rooms, hostels, and PGs with zero brokerage and transparent terms."
  },
  {
    q: "Are the listings verified?",
    a: "Yes. Every single property listed on Hobo Livings goes through a strict identity, address, and physical verification check by our administration before being published to the public search listings."
  },
  {
    q: "How does the booking and visit process work?",
    a: "Hobo Livings offers a 100% Free Assisted Site Visit and Zero Brokerage flow. You can select your sharing preference, choose a convenient visit date & time slot, and get a Digital Hobo Visit Pass with exact Google Maps directions and caretaker contact. You can also chat directly with our team on WhatsApp for instant assistance."
  },
  {
    q: "Do you charge any brokerage or platform fees?",
    a: "No! We charge ₹0 to both tenants and landlords. You get direct landlord pricing with zero markup, zero advance booking charges, and zero brokerage."
  },
  {
    q: "Can I hold a bed before visiting?",
    a: "Yes, you can request a 48-Hour Zero-Cost Bed Hold on verified listings to lock the monthly rent price while you complete your physical site visit and owner handshake."
  },
  {
    q: "How do I list my property as a landlord?",
    a: "Simply click 'List Your Property' in the top header. You can complete your profile, submit KYC details, specify room sharing tiers and amenities, and start receiving verified student visits with zero commission."
  }
];

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqsList.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <FaqsContent faqsList={faqsList} />
    </>
  );
}
