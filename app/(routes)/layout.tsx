'use client'

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import React, { Suspense, useState } from 'react';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Suspense>
      <main className="w-full h-screen relative">
        <Header />
        <div className="flex h-screen">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <section
            className="flex-1 bg-gray-50 p-6 overflow-y-auto transition-all duration-300 ease-in-out h-[calc(100vh-4rem)] mt-16"
            style={{ 
              marginLeft: isOpen ? '256px' : '56px',
            }}
          >
            {children}
          </section>
        </div>
      </main>
    </Suspense>
  );
};

export default MainLayout;