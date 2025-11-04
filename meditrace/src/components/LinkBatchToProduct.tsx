import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Link2 } from 'lucide-react';

interface LinkBatchToProductProps {
  contract: any;
}

export function LinkBatchToProduct({ contract }: LinkBatchToProductProps) {
  const [productId, setProductId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const linkBatch = async () => {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    const pid = parseInt(productId);
    const bid = parseInt(batchId);

    if (!pid || !bid) {
      alert('Please enter both Product ID and Batch ID');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const tx = await contract.linkBatchToProduct(pid, bid);
      setResult('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      
      setResult(`✓ Successfully linked Batch ${bid} to Product ${pid}`);
      
      // Clear form
      setProductId('');
      setBatchId('');
    } catch (error: any) {
      console.error(error);
      setResult('Error: ' + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-gray-900">Link Batch to Product</h3>
          <p className="text-sm text-gray-500">Associate batch with product</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="linkProductId" className="text-gray-700">Product ID</Label>
          <Input
            id="linkProductId"
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="linkBatchId" className="text-gray-700">Batch ID</Label>
          <Input
            id="linkBatchId"
            type="number"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Enter batch ID"
            className="mt-1.5"
          />
        </div>

        <Button
          onClick={linkBatch}
          disabled={loading || !contract}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          {loading ? 'Linking...' : 'Link Batch to Product'}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.includes('✓') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : result.includes('Error') 
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p className="text-sm">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
