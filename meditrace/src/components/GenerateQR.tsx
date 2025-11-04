import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { QrCode } from 'lucide-react';
import { CONTRACT_ADDRESS } from './WalletConnect';

declare global {
  interface Window {
    QRCode?: any;
  }
}

export function GenerateQR() {
  const [productId, setProductId] = useState('');
  const [qrCanvas, setQrCanvas] = useState<HTMLCanvasElement | null>(null);
  const [qrUrl, setQrUrl] = useState('');
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);

  useEffect(() => {
    // Load QRCode library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js';
    script.async = true;
    script.onload = () => setQrCodeLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateQR = async () => {
    if (!productId) {
      alert('Please enter a Product ID');
      return;
    }

    if (!qrCodeLoaded || !window.QRCode) {
      alert('QR Code library is still loading. Please try again.');
      return;
    }

    const url = `${window.location.origin}${window.location.pathname}?product=${productId}&contract=${CONTRACT_ADDRESS}`;
    setQrUrl(url);

    try {
      const canvas = await window.QRCode.toCanvas(url, { 
        width: 280,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      });
      setQrCanvas(canvas);
    } catch (error) {
      console.error('QR generation error:', error);
      alert('Failed to generate QR code');
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
          <QrCode className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-gray-900">Generate QR Code</h3>
          <p className="text-sm text-gray-500">For product traceability</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="qrProductId" className="text-gray-700">Product ID</Label>
          <Input
            id="qrProductId"
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            className="mt-1.5"
          />
        </div>

        <Button
          onClick={generateQR}
          disabled={!qrCodeLoaded}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          Generate QR Code
        </Button>

        {qrCanvas && (
          <div className="space-y-3">
            <div className="flex justify-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
              <div 
                ref={(el) => {
                  if (el && qrCanvas && !el.hasChildNodes()) {
                    el.appendChild(qrCanvas);
                  }
                }}
                className="bg-white p-3 rounded-lg shadow-lg"
              />
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-gray-600 break-all">
                <span className="text-gray-500">URL:</span> {qrUrl}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Scan this QR code to view the product trace
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
