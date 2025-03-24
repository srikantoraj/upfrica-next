
// app/my-orders/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/orders/all'); // Default to All Orders
}
