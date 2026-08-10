import { Metadata } from 'next';
import HowItWorksContent from './how-it-works-content';

export const metadata: Metadata = {
  title: 'How It Works | Free Assisted Visits, 48h Bed Hold & Zero Brokerage',
  description: 'Learn how Hobo Livings simplifies student hostel discovery, free physical site visits, 48-hour bed reservations, and landlord listing with 100% zero brokerage.',
  openGraph: {
    title: 'How Hobo Livings Works | Student Housing & Property Discovery',
    description: 'Step-by-step digital process for students and property owners in Greater Noida, Noida, and Delhi NCR.',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
