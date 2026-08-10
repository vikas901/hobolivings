import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Landlord | List Your Hostel & PG with ₹0 Brokerage',
  description: 'Register as a verified landlord on Hobo Livings. List student rooms, hostels, and PGs across Knowledge Park, Greater Noida, and Sector 62 Noida with zero platform fees.',
  openGraph: {
    title: 'List Your PG & Hostel with Hobo Livings | ₹0 Brokerage',
    description: 'Direct tenant leads, scheduled assisted visits, and zero commission.',
  },
};

export default function BecomeLandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
