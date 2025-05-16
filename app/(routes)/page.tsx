import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /albums when accessing /
  redirect('/albums');
}