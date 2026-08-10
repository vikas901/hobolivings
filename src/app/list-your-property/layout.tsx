import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Your Property | Free Hostel & PG Listing in Greater Noida & Noida',
  description: 'List your student accommodation, PG, or hostel for free on Hobo Livings. Connect with verified students from GL Bajaj, Galgotias, Sharda, and Amity University with zero commission.',
  openGraph: {
    title: 'List Your Property on Hobo Livings | ₹0 Brokerage',
    description: 'Reach thousands of students searching for PGs in Greater Noida and Noida.',
  },
};

export default function ListYourPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
