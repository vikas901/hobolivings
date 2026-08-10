import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers at Hobo Livings | Jobs in PropTech, Operations & Tech',
  description: 'Join the Hobo Livings team in Noida & Greater Noida. Explore open job positions in operations, technology, frontend development, and customer support.',
  openGraph: {
    title: 'Careers at Hobo Livings | Join Our Team',
    description: 'Work with a fast-growing student housing startup in Greater Noida & Noida.',
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
