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
    q: "How does the booking process work?",
    a: "Once you find a property you like, you can pay a small token amount to reserve the space. The reservation is instantly sent to the owner, and your deposit is securely escrowed until check-in."
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, you can request booking cancellation directly from your user dashboard. Refunds are processed based on the specific property's cancellation policies."
  },
  {
    q: "How do I list my property as a landlord?",
    a: "Simply click 'List Your Property' in the top header. You will need to complete your profile, submit bank and KYC documents (Govt ID and ownership proof), and write down your room configurations."
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
