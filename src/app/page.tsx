import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { EventBanner } from '@/features/landing/components/event-banner';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user?.role === 'ADMIN') {
    redirect('/admin');
  }

  if (user) {
    redirect('/vote');
  }

  return <EventBanner />;
}
