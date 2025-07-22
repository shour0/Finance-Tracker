'use client';
import MaskContainer from '@/components/ui/MaskEffect';

const SVGMaskEffect = () => {
  return (
    <div className="flex h-[40rem]  w-full items-center justify-center mb-20 overflow-hidden">
      <MaskContainer
        revealText={
          <p className="mx-auto  text-center text-4xl font-bold text-slate-800 dark:text-white">
            What makes this Finance Tracker and stock tool the best choice for managing my budget?
          </p>
        }
        className="h-[40rem] rounded-md border text-white dark:text-black"
      >
        It’s simple, clear, and helps you track spending while reaching your financial goals
        faster.?
      </MaskContainer>
    </div>
  );
};

export default SVGMaskEffect;
