'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ContainerTextFlip } from '@/components/ui/ContainerTextFlip';
import { motion } from 'motion/react';

import { useRouter } from 'next/navigation';
import SVGMaskEffect from '@/components/SVGMaskEffect';
import AuthModal from '@/components/AuthModal';
import { useAuthWithModal } from '@/hooks/useAuth';
import ContentCard from '@/components/ContentCard';
import Link from 'next/link';
export default function Home() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const { user, isAuthOpen, setIsAuthOpen } = useAuthWithModal();
  const router = useRouter();

  return (
    <div className="relative overflow-clip mx-auto flex flex-col items-center justify-center  ">
      <Navbar
        showAddTransaction={showAddTransaction}
        setShowAddTransaction={setShowAddTransaction}
      />
      <main className="max-w-[92rem] px-4 py-10 md:py-20 lg:py-32">
        <div className="mb-20 lg:mb-32">
          <h1 className="relative z-10 mx-auto text-center font-bold text-slate-700 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight lg:leading-[1.1] dark:text-slate-300">
            {`Take Control of ${''} Your Finances in`.split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: 'easeInOut',
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
            <ContainerTextFlip words={['months', 'days', 'hours', 'minutes']} />
          </h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-2xl lg:max-w-3xl py-6 lg:py-8 text-center text-lg md:text-xl lg:text-2xl font-normal text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            With our smart finance tracker, you can manage budgets, track expenses, and grow your
            savings—all powered by cutting-edge AI. Start building your financial future today.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6"
          >
            <button
              onClick={() => (user ? router.push('/dashboard') : setIsAuthOpen(true))}
              className="w-full sm:w-64 lg:w-72 transform rounded-xl bg-black px-8 py-4 lg:py-5 text-lg lg:text-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Explore Now
            </button>
            <Link
              href="#contact"
              className="w-full sm:w-64 lg:w-72 transform rounded-xl border-2 border-gray-300 bg-white px-8 py-4 lg:py-5 text-lg lg:text-xl font-semibold text-black transition-all duration-300 text-center hover:-translate-y-1 hover:bg-gray-50 hover:shadow-2xl dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            >
              Contact Support
            </Link>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 1.2,
            }}
            className="relative z-10 mt-16 lg:mt-20 rounded-3xl lg:rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800"
          >
            <div className="w-full overflow-hidden rounded-2xl lg:rounded-3xl border border-gray-200 shadow-lg dark:border-gray-600">
              <div className="aspect-[16/10] lg:aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base font-medium">
                    Dashboard Preview Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <SVGMaskEffect />
        <ContentCard />
      </main>
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  );
}
