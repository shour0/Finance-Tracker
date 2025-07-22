'use client';
import { Button } from './ui/Button';
import { LayoutGrid } from './ui/LayoutGrid';

const ContentCard = () => {
  return (
    <div className="h-screen w-full cursor-pointer">
      <LayoutGrid cards={cards} />
    </div>
  );
};

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">Monitor Bitcoin&apos;s current trend.</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Bitcoin is at $92,03.20 with a slight 0.219% change. Set price alerts and review daily for
        trading opportunities
      </p>
      <Button>Track Price</Button>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">Diversify your crypto holdings.</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Include Bitcoin, Ethereum, and altcoins. Check current values (e.g., BTC ~$92,000) and
        rebalance monthly.
      </p>
      <Button>Analyze Portfolio</Button>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">Plan your financial future.</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Start with a savings goal, invest in stocks or bonds, and seek a financial advisor for a
        tailored strategy.
      </p>
      <Button>Start Investing</Button>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Optimize your tracker&apos;s performance.
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A 57.1% bounce rate suggests users leave quickly. Improve load time (0.7s) and add
        interactive features.
      </p>
      <Button>Optimize Now</Button>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: 'md:col-span-2',
    thumbnail: '/bitcoinTrade.jpg',
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: 'col-span-1',
    thumbnail: '/bitcoinImage.jpg',
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: 'col-span-1',
    thumbnail: '/suit.jpg',
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: 'md:col-span-2',
    thumbnail: '/websiteTrading.jpg',
  },
];

export default ContentCard;
