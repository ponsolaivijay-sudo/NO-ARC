import { Card } from './ui/card';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

const ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "medicineName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "manufacturerName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "latitude", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "longitude", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "manufacturer", "type": "address" }
    ],
    "name": "BatchCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "batchId", "type": "uint256" }
    ],
    "name": "BatchLinked",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_medicineName", "type": "string" },
      { "internalType": "string", "name": "_manufacturerName", "type": "string" },
      { "internalType": "string", "name": "_latitude", "type": "string" },
      { "internalType": "string", "name": "_longitude", "type": "string" },
      { "internalType": "string", "name": "_notes", "type": "string" }
    ],
    "name": "createBatch",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_productName", "type": "string" },
      { "internalType": "string", "name": "_notes", "type": "string" }
    ],
    "name": "createProduct",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_productId", "type": "uint256" },
      { "internalType": "uint256", "name": "_batchId", "type": "uint256" }
    ],
    "name": "linkBatchToProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "productName", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "distributor", "type": "address" }
    ],
    "name": "ProductCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "batchCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "batches",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "medicineName", "type": "string" },
      { "internalType": "string", "name": "manufacturerName", "type": "string" },
      { "internalType": "string", "name": "latitude", "type": "string" },
      { "internalType": "string", "name": "longitude", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "address", "name": "manufacturer", "type": "address" },
      { "internalType": "string", "name": "notes", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getBatch",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getProduct",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "products",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "productName", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "address", "name": "distributor", "type": "address" },
      { "internalType": "string", "name": "notes", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

interface WalletConnectProps {
  provider: any;
  signer: any;
  contract: any;
  account: string;
  setProvider: (provider: any) => void;
  setSigner: (signer: any) => void;
  setContract: (contract: any) => void;
  setAccount: (account: string) => void;
}

export function WalletConnect({
  provider,
  signer,
  contract,
  account,
  setProvider,
  setSigner,
  setContract,
  setAccount
}: WalletConnectProps) {
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or a compatible Web3 wallet');
      return;
    }

    try {
      // Dynamic import of ethers
      const { ethers } = await import('ethers@6.8.1');
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      
      const web3Contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, web3Signer);
      
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(web3Contract);
      setAccount(address);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + (error?.message || error));
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Wallet Connection</h3>
            {account && (
              <p className="text-green-600 text-sm mt-1">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            )}
          </div>
        </div>
        <Button 
          onClick={connectWallet}
          disabled={!!account}
          className={account ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
        >
          {account ? 'Connected' : 'Connect Wallet'}
        </Button>
      </div>
      {account && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="text-gray-500">Contract:</span> {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
          </p>
        </div>
      )}
    </Card>
  );
}

export { CONTRACT_ADDRESS, ABI };
