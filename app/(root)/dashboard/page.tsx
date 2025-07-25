'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import HeroDashboard from '@/components/HeroDashboard';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, router, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative flex justify-center items-center py-3 px-5">
      <div className=" w-full">
        <Navbar
          showAddTransaction={showAddTransaction}
          setShowAddTransaction={setShowAddTransaction}
        />
        <HeroDashboard
          showAddTransaction={showAddTransaction}
          setShowAddTransaction={setShowAddTransaction}
        />
      </div>
    </main>
  );
};

export default Page;
