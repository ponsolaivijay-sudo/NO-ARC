import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Search, ExternalLink } from 'lucide-react';

interface ViewTraceProps {
  contract: any;
}

interface Batch {
  id: string;
  medicineName: string;
  collectorName: string;
  latitude: string;
  longitude: string;
  timestamp: string;
  collector: string;
  notes: string;
  mapLink?: string;
}

interface Product {
  id: string;
  productName: string;
  batchIds: string[];
  timestamp: string;
  manufacturer: string;
  notes: string;
}

interface TraceData {
  product: Product;
  batches: Batch[];
}

export function ViewTrace({ contract }: ViewTraceProps) {
  const [productId, setProductId] = useState('');
  const [traceData, setTraceData] = useState<TraceData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check URL for product parameter
    const params = new URLSearchParams(window.location.search);
    const urlProductId = params.get('product');
    if (urlProductId) {
      setProductId(urlProductId);
      // Auto-fetch after a short delay to ensure contract is loaded
      setTimeout(() => {
        if (contract) {
          viewTrace(urlProductId);
        }
      }, 1000);
    }
  }, [contract]);

  const viewTrace = async (pid?: string) => {
    const id = pid || productId;
    
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    const parsedId = parseInt(id);
    if (!parsedId) {
      alert('Please enter a valid Product ID');
      return;
    }

    setLoading(true);
    setError('');
    setTraceData(null);

    try {
      const prod = await contract.getProduct(parsedId);
      
      const product: Product = {
        id: prod[0].toString(),
        productName: prod[1],
        batchIds: prod[2].map((x: any) => x.toString()),
        timestamp: new Date(Number(prod[3]) * 1000).toLocaleString(),
        manufacturer: prod[4],
        notes: prod[5]
      };

      const batches: Batch[] = [];
      for (const batchId of product.batchIds) {
        const bb = await contract.getBatch(batchId);
        const batch: Batch = {
          id: bb[0].toString(),
          medicineName: bb[1],
          collectorName: bb[2],
          latitude: bb[3],
          longitude: bb[4],
          timestamp: new Date(Number(bb[5]) * 1000).toLocaleString(),
          collector: bb[6],
          notes: bb[7]
        };
        
        if (batch.latitude && batch.longitude) {
          batch.mapLink = `https://www.openstreetmap.org/?mlat=${batch.latitude}&mlon=${batch.longitude}#map=16/${batch.latitude}/${batch.longitude}`;
        }
        
        batches.push(batch);
      }

      setTraceData({ product, batches });
    } catch (error: any) {
      console.error(error);
      setError('Error: ' + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-gray-900">View Product Trace</h3>
          <p className="text-sm text-gray-500">Complete traceability information</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="viewProductId" className="text-gray-700">Product ID</Label>
          <Input
            id="viewProductId"
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            className="mt-1.5"
          />
        </div>

        <Button
          onClick={() => viewTrace()}
          disabled={loading || !contract}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {loading ? 'Loading...' : 'View Trace'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {traceData && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* Product Information */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <h4 className="text-indigo-900 mb-3">Product Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-900">{traceData.product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="text-gray-900">{traceData.product.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{traceData.product.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manufacturer:</span>
                  <span className="text-gray-900 text-xs">{traceData.product.manufacturer.slice(0, 10)}...{traceData.product.manufacturer.slice(-8)}</span>
                </div>
                {traceData.product.notes && (
                  <div>
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-gray-900 mt-1">{traceData.product.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Batches Information */}
            <div>
              <h4 className="text-gray-900 mb-3">Linked Batches ({traceData.batches.length})</h4>
              {traceData.batches.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  No batches linked to this product yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {traceData.batches.map((batch) => (
                    <div key={batch.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="text-green-900">Batch #{batch.id}</h5>
                        {batch.mapLink && (
                          <a
                            href={batch.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                          >
                            View Map <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Medicine:</span>
                          <span className="text-gray-900">{batch.medicineName}</span>
                        </div>
                        {batch.collectorName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Collector:</span>
                            <span className="text-gray-900">{batch.collectorName}</span>
                          </div>
                        )}
                        {batch.latitude && batch.longitude && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="text-gray-900 text-xs">{batch.latitude.slice(0, 8)}, {batch.longitude.slice(0, 8)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recorded:</span>
                          <span className="text-gray-900 text-xs">{batch.timestamp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="text-gray-900 text-xs">{batch.collector.slice(0, 10)}...{batch.collector.slice(-8)}</span>
                        </div>
                        {batch.notes && (
                          <div>
                            <span className="text-gray-600">Notes:</span>
                            <p className="text-gray-900 mt-1">{batch.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
