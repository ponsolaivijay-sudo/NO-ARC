import { useState, useEffect } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { RecordBatch } from './components/RecordBatch';
import { CreateProduct } from './components/CreateProduct';
import { LinkBatchToProduct } from './components/LinkBatchToProduct';
import { GenerateQR } from './components/GenerateQR';
import { ViewTrace } from './components/ViewTrace';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string>('');

  // Check for product ID in URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      // Will be handled by ViewTrace component
      const viewInput = document.getElementById('viewProductId') as HTMLInputElement;
      if (viewInput) {
        viewInput.value = productId;
      }
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760137658025-4662275104e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NjIxODc3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Medical background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-slate-900/95 to-gray-900/95" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-white mb-4 tracking-tight">
            MediTrace
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Blockchain-Powered Medicine Traceability System
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mt-6 rounded-full" />
        </div>

        {/* Wallet Connection */}
        <WalletConnect
          provider={provider}
          signer={signer}
          contract={contract}
          account={account}
          setProvider={setProvider}
          setSigner={setSigner}
          setContract={setContract}
          setAccount={setAccount}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-6">
            <RecordBatch contract={contract} />
            <CreateProduct contract={contract} />
            <LinkBatchToProduct contract={contract} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <GenerateQR />
            <ViewTrace contract={contract} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-blue-300/60 pb-8">
          <p>Secure • Transparent • Traceable</p>
        </div>
      </div>
    </div>
  );
}
