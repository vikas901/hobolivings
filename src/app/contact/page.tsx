import { Metadata } from 'next';
import ContactContent from './contact-content';

export const metadata: Metadata = {
  title: 'Contact Us | Customer Support & Desk',
  description: 'Have questions about property bookings, verification, or landlord listing? Contact the Hobo Livings support desk operating from Greater Noida & Noida.',
};

export default function ContactPage() {
  return <ContactContent />;
}
