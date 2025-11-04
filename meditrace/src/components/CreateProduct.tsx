import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Boxes } from 'lucide-react';

interface CreateProductProps {
  contract: any;
}

export function CreateProduct({ contract }: CreateProductProps) {
  const [productName, setProductName] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const createProduct = async () => {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    const name = productName || 'product';

    setLoading(true);
    setResult('');

    try {
      const tx = await contract.createProduct(name, notes);
      setResult('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      
      const idBN = await contract.productCount();
      const id = idBN.toString();
      
      setResult(`✓ Product created successfully — Product ID: ${id}`);
      
      // Clear form
      setProductName('');
      setNotes('');
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
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Boxes className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-gray-900">Create Product</h3>
          <p className="text-sm text-gray-500">Manufacturer Information</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="productName" className="text-gray-700">Product Name</Label>
          <Input
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="productNotes" className="text-gray-700">Notes</Label>
          <Textarea
            id="productNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional product information"
            rows={3}
            className="mt-1.5"
          />
        </div>

        <Button
          onClick={createProduct}
          disabled={loading || !contract}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? 'Creating...' : 'Create Product On-Chain'}
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
