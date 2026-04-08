'use client';

import dynamic from 'next/dynamic';

const ClientApp = dynamic(() => import('../../../src/ClientApp'), { ssr: false });

export default function ShanghaiHotpotPage() {
  return <ClientApp />;
}
