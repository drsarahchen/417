import React, { useEffect } from 'react';
import { Info } from 'lucide-react';

interface BarcodeDisplayProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({ canvasRef }) => {
  // Determine proper barcode display - using JSBarcode behind the scenes
  useEffect(() => {
    // Canvas is initialized and barcode is generated in the parent component
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <canvas 
          ref={canvasRef} 
          className="max-w-full border border-gray-200 p-4"
        ></canvas>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-4 text-sm text-blue-700">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p>This barcode follows AAMVA PDF417 specifications:</p>
            <ul className="list-disc list-inside mt-1 ml-1">
              <li>3:1 aspect ratio</li>
              <li>Error correction level 5</li>
              <li>Formatted according to AAMVA Version 8.1</li>
              <li>Compatible with standard ID scanners</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        For optimal scanning, ensure printed barcodes maintain a minimum of 200dpi resolution.
        The barcode should be printed at a size where the width is 3 times the height for best results.
      </p>
    </div>
  );
};

export default BarcodeDisplay;