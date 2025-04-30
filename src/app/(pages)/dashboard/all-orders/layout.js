'use client';

import Header from '@/components/common/header/Header';
import Footer from '@/components/common/footer/Footer';
import SideBar from './components/SideBar';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-100 text-gray-900'>
      <div className="flex bg-gray-100 mx-auto max-w-6xl gap-8 px-2 py-10 pb-32">
        <SideBar />
        <main className="flex-1 px-4 py-6">{children}</main>
      </div>
      </div>
      <Footer />
    </>
  );
}