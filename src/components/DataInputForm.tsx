import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AAMVAData, ValidationResult } from '../types/aamva';
import { FIELD_GROUPS, JURISDICTIONS, EYE_COLORS, HAIR_COLORS } from '../constants/aamvaFields';
import { validateField } from '../utils/validation';

interface DataInputFormProps {
  data: AAMVAData;
  onChange: (data: Partial<AAMVAData>) => void;
  validation: ValidationResult;
}

const DataInputForm: React.FC<DataInputFormProps> = ({ data, onChange, validation }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    document: true,
    personal: true,
    physical: true,
    address: true,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getFieldError = (fieldId: string): string | null => {
    const error = validation.errors.find(err => err.field === fieldId);
    return error ? error.message : null;
  };

  const handleInputChange = (
    section: 'personal' | 'document',
    field: string,
    value: string
  ) => {
    const newData: Partial<AAMVAData> = {
      [section]: {
        ...data[section],
        [field]: value
      }
    };
    
    onChange(newData);
  };

  const renderField = (field: any, section: 'personal' | 'document') => {
    const { id, label, required, elementId } = field;
    const value = data[section][id] || '';
    const error = getFieldError(id);
    
    // Extract validation as user types
    const validateOnChange = (newValue: string) => {
      const validationError = validateField(id, newValue);
      return validationError;
    };
    
    // General input field render
    const renderInput = () => (
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(section, id, e.target.value)}
        onBlur={() => validateOnChange(value)}
        className={`mt-1 block w-full rounded-md ${error 
          ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } shadow-sm sm:text-sm transition-colors`}
        placeholder={`Enter ${label.toLowerCase()}`}
        required={required}
      />
    );
    
    // Date field with MM/DD/YYYY format helper
    const renderDateField = () => (
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(section, id, e.target.value)}
          className={`mt-1 block w-full rounded-md ${error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm sm:text-sm transition-colors`}
          placeholder="MM/DD/YYYY"
          required={required}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 top-1">
          <span className="text-gray-400 sm:text-xs">MM/DD/YYYY</span>
        </div>
      </div>
    );
    
    // Select field for dropdowns like jurisdictions
    const renderSelectField = (options: { code: string, name: string }[]) => (
      <select
        id={id}
        value={value}
        onChange={(e) => handleInputChange(section, id, e.target.value)}
        className={`mt-1 block w-full rounded-md ${error 
          ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } shadow-sm sm:text-sm transition-colors`}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.code} value={option.code}>
            {option.name} ({option.code})
          </option>
        ))}
      </select>
    );
    
    // Radio buttons for document type
    const renderDocumentTypeField = () => (
      <div className="mt-1 space-x-4">
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            value="DL" 
            checked={value === 'DL'}
            onChange={() => handleInputChange(section, id, 'DL')}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Driver License (DL)</span>
        </label>
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            value="ID" 
            checked={value === 'ID'}
            onChange={() => handleInputChange(section, id, 'ID')}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Identification Card (ID)</span>
        </label>
      </div>
    );
    
    // Gender field options
    const renderGenderField = () => (
      <div className="mt-1 space-x-4">
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            value="M" 
            checked={value === 'M'}
            onChange={() => handleInputChange(section, id, 'M')}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Male (M)</span>
        </label>
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            value="F" 
            checked={value === 'F'}
            onChange={() => handleInputChange(section, id, 'F')}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Female (F)</span>
        </label>
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            value="X" 
            checked={value === 'X'}
            onChange={() => handleInputChange(section, id, 'X')}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Non-binary (X)</span>
        </label>
      </div>
    );
    
    return (
      <div key={id} className="sm:col-span-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {id === 'documentType' && renderDocumentTypeField()}
        {id === 'issuingJurisdiction' && renderSelectField(JURISDICTIONS)}
        {id === 'addressState' && renderSelectField(JURISDICTIONS)}
        {(id === 'issueDate' || id === 'expirationDate' || id === 'dateOfBirth') && renderDateField()}
        {id === 'gender' && renderGenderField()}
        {id === 'eyeColor' && renderSelectField(EYE_COLORS)}
        {id === 'hairColor' && renderSelectField(HAIR_COLORS)}
        {!['documentType', 'issuingJurisdiction', 'addressState', 'issueDate', 'expirationDate', 'dateOfBirth', 'gender', 'eyeColor', 'hairColor'].includes(id) && renderInput()}
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        
        {elementId && (
          <p className="mt-1 text-xs text-gray-400">AAMVA field: {elementId}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        <p>Enter the required information below to generate an AAMVA-compliant PDF417 barcode. Fields marked with an asterisk (*) are mandatory.</p>
      </div>
      
      {FIELD_GROUPS.map((group) => (
        <div key={group.id} className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <button
            type="button"
            className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection(group.id)}
          >
            <h3 className="text-base font-medium text-gray-800">{group.label}</h3>
            {expandedSections[group.id] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections[group.id] && (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                {group.fields.map((field) => renderField(field, group.id === 'document' ? 'document' : 'personal'))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataInputForm;