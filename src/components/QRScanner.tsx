import React, { useState } from 'react';
import QRCodeScanner from 'react-qr-scanner';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (result: string | null) => {
    if (result) {
      setScanResult(result);
      console.log('Scanned QR code:', result);
      // Placeholder for registration logic
      // This would typically involve sending the scanned data to the backend
    } else {
      setError('Failed to scan QR code. Please try again.');
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Scan QR Code</h2>
      {error && <p className="text-red-500">{error}</p>}
      <QRCodeScanner onResult={handleScan} />
      {scanResult && (
        <div>
          <p className="text-green-600">Scanned successfully!</p>
          <p>Result: {scanResult}</p>
          {/* Registration logic would be implemented here */}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
