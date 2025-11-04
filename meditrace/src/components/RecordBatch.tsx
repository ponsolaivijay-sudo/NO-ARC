import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { MapPin, Package } from 'lucide-react';

interface RecordBatchProps {
  contract: any;
}

export function RecordBatch({ contract }: RecordBatchProps) {
  const [medicineName, setMedicineName] = useState('');
  const [collectorName, setCollectorName] = useState('');
  const [notes, setNotes] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const captureLocation = () => {
    setLocationStatus('Requesting location...');
    
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not available in your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toString();
        const lon = position.coords.longitude.toString();
        setLatitude(lat);
        setLongitude(lon);
        setLocationStatus(`Captured: ${lat.slice(0, 8)}, ${lon.slice(0, 8)}`);
      },
      (error) => {
        setLocationStatus('Location error: ' + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  const recordBatch = async () => {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    const herbName = medicineName || 'unknown';
    const collector = collectorName || '';

    if (!latitude || !longitude) {
      if (!confirm('No GPS location captured. Continue without geotag?')) {
        return;
      }
    }

    setLoading(true);
    setResult('');

    try {
      const tx = await contract.createBatch(
        herbName,
        collector,
        latitude,
        longitude,
        notes
      );
      setResult('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      
      const idBN = await contract.batchCount();
      const id = idBN.toString();
      
      setResult(`✓ Batch recorded successfully — Batch ID: ${id}`);
      
      // Clear form
      setMedicineName('');
      setCollectorName('');
      setNotes('');
      setLatitude('');
      setLongitude('');
      setLocationStatus('');
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
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-gray-900">Record Medicine Batch</h3>
          <p className="text-sm text-gray-500">Collector Information</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="medicineName" className="text-gray-700">Medicine Name</Label>
          <Input
            id="medicineName"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="Enter medicine name"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="collectorName" className="text-gray-700">Collector Name (Optional)</Label>
          <Input
            id="collectorName"
            value={collectorName}
            onChange={(e) => setCollectorName(e.target.value)}
            placeholder="Enter collector name"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="batchNotes" className="text-gray-700">Notes</Label>
          <Textarea
            id="batchNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional information about this batch"
            rows={3}
            className="mt-1.5"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={captureLocation}
            variant="outline"
            className="flex-1 border-blue-300 hover:bg-blue-50"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Capture GPS Location
          </Button>
        </div>

        {locationStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">{locationStatus}</p>
          </div>
        )}

        <Button
          onClick={recordBatch}
          disabled={loading || !contract}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {loading ? 'Recording...' : 'Record Batch On-Chain'}
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
