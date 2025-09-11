// server component (pages)/sourcing/page.jsx (redirector)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const DEFAULT_CC = 'gh';

export default function Page() {
  const cc = cookies().get('cc')?.value?.toLowerCase() || DEFAULT_CC;
  redirect(`/${cc}/sourcing`);
}