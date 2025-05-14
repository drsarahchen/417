import React, { useState, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { AlertCircle, Loader2, Download, CheckCircle2 } from 'lucide-react';
import DataInputForm from './DataInputForm';
import BarcodeDisplay from './BarcodeDisplay';
import { AAMVAData, ValidationResult } from '../types/aamva';
import { formatAAMVAData, formatAAMVADataForPreview } from '../utils/aamvaFormatter';
import { validateAAMVAData } from '../utils/validation';

// Initial empty state for AAMVA data
const initialAAMVAData: AAMVAData = {
  version: '08',
  personal: {
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'M',
    eyeColor: '',
    hairColor: '',
    height: '',
    weight: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressPostalCode: '',
    country: 'USA',
    uniqueId: '',
  },
  document: {
    documentType: 'DL',
    issueDate: '',
    expirationDate: '',
    issuingJurisdiction: '',
    country: 'USA',
    restrictionCodes: '',
    endorsementCodes: '',
    vehicleClassifications: '',
  },
};

const BarcodeGenerator: React.FC = () => {
  const [aamvaData, setAamvaData] = useState<AAMVAData>(initialAAMVAData);
  const [encodedData, setEncodedData] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, errors: [] });
  const [step, setStep] = useState<'form' | 'preview' | 'barcode'>('form');
  const [loading, setLoading] = useState<boolean>(false);
  const [formattedPreview, setFormattedPreview] = useState<Record<string, string>>({});
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleDataChange = (newData: Partial<AAMVAData>) => {
    setAamvaData(prevData => ({
      ...prevData,
      ...newData,
      personal: {
        ...prevData.personal,
        ...(newData.personal || {}),
      },
      document: {
        ...prevData.document,
        ...(newData.document || {}),
      },
    }));
  };
  
  const validateAndPreview = () => {
    const validationResult = validateAAMVAData(aamvaData);
    setValidation(validationResult);
    
    if (validationResult.isValid) {
      setFormattedPreview(formatAAMVADataForPreview(aamvaData));
      setStep('preview');
    } else {
      const firstErrorField = document.getElementById(validationResult.errors[0].field);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  };
  
  const generateBarcode = () => {
    setLoading(true);
    
    const formattedData = formatAAMVAData(aamvaData);
    setEncodedData(formattedData);
    
    setTimeout(() => {
      try {
        if (canvasRef.current) {
          JsBarcode(canvasRef.current, formattedData, {
            format: "PDF417",
            width: 3,
            height: 1,
            fontSize: 0,
            lineColor: "#FFFFFF",
            errorLevel: 5,
            flat: true,
          });
        }
        
        setStep('barcode');
      } catch (error) {
        console.error('Error generating barcode:', error);
        setValidation({
          isValid: false,
          errors: [{ field: 'general', message: 'Failed to generate barcode. Check your data format.' }]
        });
      } finally {
        setLoading(false);
      }
    }, 100);
  };
  
  const downloadBarcode = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${aamvaData.document.documentType}_${aamvaData.personal.lastName}_${aamvaData.personal.firstName}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const resetForm = () => {
    setAamvaData(initialAAMVAData);
    setEncodedData('');
    setValidation({ isValid: false, errors: [] });
    setStep('form');
  };
  
  return (
    <div className="glass-panel overflow-hidden">
      <div className="bg-black/20 p-6 border-b border-white/10">
        <div className="flex items-center justify-center max-w-2xl mx-auto">
          <div className={`flex-1 text-center relative ${step === 'form' ? 'text-blue-400' : 'text-white/60'}`}>
            <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center border-2 
              ${step === 'form' ? 'border-blue-400 bg-blue-400/10' : 'border-white/20 bg-black/20'}`}>
              1
            </div>
            <p className="mt-2 text-sm">Enter Data</p>
            <div className="absolute w-1/2 h-0.5 bg-white/10 top-4 left-full z-0"></div>
          </div>
          
          <div className={`flex-1 text-center relative ${step === 'preview' ? 'text-blue-400' : 'text-white/60'}`}>
            <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center border-2 
              ${step === 'preview' ? 'border-blue-400 bg-blue-400/10' : 'border-white/20 bg-black/20'}`}>
              2
            </div>
            <p className="mt-2 text-sm">Review</p>
            <div className="absolute w-1/2 h-0.5 bg-white/10 top-4 right-1/2 z-0"></div>
            <div className="absolute w-1/2 h-0.5 bg-white/10 top-4 left-1/2 z-0"></div>
          </div>
          
          <div className={`flex-1 text-center ${step === 'barcode' ? 'text-blue-400' : 'text-white/60'}`}>
            <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center border-2 
              ${step === 'barcode' ? 'border-blue-400 bg-blue-400/10' : 'border-white/20 bg-black/20'}`}>
              3
            </div>
            <p className="mt-2 text-sm">Generate</p>
            <div className="absolute w-1/2 h-0.5 bg-white/10 top-4 right-full z-0"></div>
          </div>
        </div>
      </div>
      
      {validation.errors.length > 0 && step === 'form' && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 m-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-300">Please correct the following errors:</h3>
              <ul className="mt-1 text-sm text-red-200 list-disc list-inside">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {step === 'form' && (
        <div className="p-6">
          <DataInputForm 
            data={aamvaData} 
            onChange={handleDataChange} 
            validation={validation}
          />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={validateAndPreview}
              className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/20 transition-colors duration-200"
            >
              Review and Generate
            </button>
          </div>
        </div>
      )}
      
      {step === 'preview' && (
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-300">Validation Complete</h3>
                  <p className="mt-1 text-sm text-blue-200">
                    Your data has been validated and meets AAMVA standards. Please review the information below before generating the barcode.
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-4">Data Preview</h3>
            
            <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden mb-6">
              <div className="divide-y divide-white/10">
                {Object.entries(formattedPreview).map(([key, value]) => (
                  <div key={key} className="flex px-4 py-3">
                    <div className="w-1/3 font-medium text-white/80">{key}</div>
                    <div className="w-2/3 text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-4">Barcode Information</h3>
            <div className="bg-black/20 rounded-lg border border-white/10 p-4 mb-6">
              <ul className="text-sm space-y-2 text-white/80">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>The barcode will be generated using PDF417 format with Error Correction Level 5</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>3:1 aspect ratio will be used as required by AAMVA standards</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Data will be formatted according to AAMVA Version 8.1 specifications</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>The barcode will be machine-readable by standard ID scanners</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setStep('form')}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/10 transition-colors duration-200"
              >
                Back to Form
              </button>
              <button
                onClick={generateBarcode}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/20 transition-colors duration-200"
              >
                Generate Barcode
              </button>
            </div>
          </div>
        </div>
      )}
      
      {step === 'barcode' && (
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
                <p className="text-white/60">Generating barcode...</p>
              </div>
            ) : (
              <>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-green-300">Barcode Generated Successfully</h3>
                      <p className="mt-1 text-sm text-green-200">
                        Your AAMVA-compliant PDF417 barcode has been created. You can download the image or reset to create a new barcode.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Generated Barcode</h3>
                <div className="bg-black/20 border border-white/10 rounded-lg p-4 flex items-center justify-center mb-6">
                  <BarcodeDisplay canvasRef={canvasRef} />
                </div>
                
                <div className="flex flex-wrap justify-between gap-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/10 transition-colors duration-200"
                  >
                    Create New Barcode
                  </button>
                  <button
                    onClick={downloadBarcode}
                    className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/20 transition-colors duration-200 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Barcode
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeGenerator;