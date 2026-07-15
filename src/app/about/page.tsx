import { Metadata } from 'next';
import AboutContent from './about-content';

export const metadata: Metadata = {
  title: 'About Hobo Livings | Affordable PG, Hostel & Rental Accommodation',
  description: 'Learn about Hobo Livings Private Limited, our mission to simplify accommodation discovery, and how we help students and professionals find verified, affordable living spaces across India.',
};

export default function AboutPage() {
  return <AboutContent />;
}
