
"use client";

import dynamic from 'next/dynamic';

const InvestmentFabClientOnly = dynamic(
  () => import('@/components/custom/investment-fab'),
  { ssr: false }
);

export default function InvestmentFabWrapper() {
  return <InvestmentFabClientOnly />;
}
