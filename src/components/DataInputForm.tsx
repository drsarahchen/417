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
    
    const validateOnChange = (newValue: string) => {
      const validationError = validateField(id, newValue);
      return validationError;
    };
    
    const renderInput = () => (
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(section, id, e.target.value)}
        onBlur={() => validateOnChange(value)}
        className={`glass-input w-full ${error ? 'border-red-400' : ''}`}
        placeholder={`Enter ${label.toLowerCase()}`}
        required={required}
      />
    );
    
    const renderDateField = () => (
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(section, id, e.target.value)}
          className={`glass-input w-full pr-24 ${error ? 'border-red-400' : ''}`}
          placeholder="MM/DD/YYYY"
          required={required}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <span className="text-white/40 text-sm">MM/DD/YYYY</span>
        </div>
      </div>
    );
    
    const renderSelectField = (options: { code: string, name: string }[]) => (
      <select
        id={id}
        value={value}
        onChange={(e) => handleInputChange(section, id, e.target.value)}
        className={`glass-input w-full ${error ? 'border-red-400' : ''}`}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.code} value={option.code} className="bg-[#2A2A2A] text-white">
            {option.name} ({option.code})
          </option>
        ))}
      </select>
    );
    
    const renderDocumentTypeField = () => (
      <div className="mt-1 space-x-4">
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            value="DL" 
            checked={value === 'DL'}
            onChange={() => handleInputChange(section, id, 'DL')}
            className="h-4 w-4 border-white/30 text-blue-400 focus:ring-blue-400/50 bg-white/10"
          />
          <span className="ml-2 text-sm text-white/80">Driver License (DL)</span>
        </label>
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            value="ID" 
            checked={value === 'ID'}
            onChange={() => handleInputChange(section, id, 'ID')}
            className="h-4 w-4 border-white/30 text-blue-400 focus:ring-blue-400/50 bg-white/10"
          />
          <span className="ml-2 text-sm text-white/80">Identification Card (ID)</span>
        </label>
      </div>
    );
    
    const renderGenderField = () => (
      <div className="mt-1 space-x-4">
        {[
          { value: 'M', label: 'Male (M)' },
          { value: 'F', label: 'Female (F)' },
          { value: 'X', label: 'Non-binary (X)' }
        ].map(option => (
          <label key={option.value} className="inline-flex items-center">
            <input 
              type="radio" 
              value={option.value} 
              checked={value === option.value}
              onChange={() => handleInputChange(section, id, option.value)}
              className="h-4 w-4 border-white/30 text-blue-400 focus:ring-blue-400/50 bg-white/10"
            />
            <span className="ml-2 text-sm text-white/80">{option.label}</span>
          </label>
        ))}
      </div>
    );
    
    return (
      <div key={id} className="sm:col-span-2">
        <label htmlFor={id} className="glass-label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
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
          <p className="glass-error">{error}</p>
        )}
        
        {elementId && (
          <p className="glass-field-hint">AAMVA field: {elementId}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-white/60">
        <p>Enter the required information below to generate an AAMVA-compliant PDF417 barcode. Fields marked with an asterisk (*) are mandatory.</p>
      </div>
      
      {FIELD_GROUPS.map((group) => (
        <div key={group.id} className="glass-section">
          <button
            type="button"
            className="glass-section-header"
            onClick={() => toggleSection(group.id)}
          >
            <h3 className="text-base font-medium text-white/90">{group.label}</h3>
            {expandedSections[group.id] ? (
              <ChevronUp className="h-5 w-5 text-white/60" />
            ) : (
              <ChevronDown className="h-5 w-5 text-white/60" />
            )}
          </button>
          
          {expandedSections[group.id] && (
            <div className="glass-section-content">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
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