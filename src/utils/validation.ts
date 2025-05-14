import { AAMVAData, ValidationResult, ValidationError } from '../types/aamva';
import { FIELD_DEFINITIONS } from '../constants/aamvaFields';

/**
 * Validates date format (MM/DD/YYYY)
 */
export function isValidDate(date: string): boolean {
  if (!date) return false;
  
  // Handle different possible input formats
  const normalizedDate = date.replace(/[-/]/g, '/');
  const parts = normalizedDate.split('/');
  
  if (parts.length !== 3) return false;
  
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(month) || isNaN(day) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  
  const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Check for leap year
  if (month === 2 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))) {
    maxDaysInMonth[1] = 29;
  }
  
  if (day < 1 || day > maxDaysInMonth[month - 1]) return false;
  
  // Ensure year is reasonable (not too far in the past or future)
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear + 100) return false;
  
  return true;
}

/**
 * Validates a field against its corresponding regex pattern in FIELD_DEFINITIONS
 */
function isValidField(field: string, value: string): boolean {
  if (!FIELD_DEFINITIONS[field]) return true; // Skip unknown fields
  
  const { regex } = FIELD_DEFINITIONS[field];
  if (!regex) return true;
  
  return regex.test(value);
}

/**
 * Validates a complete AAMVA data object
 */
export function validateAAMVAData(data: AAMVAData): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Validate document fields
  if (!data.document.documentType || !['DL', 'ID'].includes(data.document.documentType)) {
    errors.push({
      field: 'documentType',
      message: 'Document type must be DL (Driver License) or ID (Identification Card)'
    });
  }
  
  if (!data.document.issuingJurisdiction || data.document.issuingJurisdiction.length !== 2) {
    errors.push({
      field: 'issuingJurisdiction',
      message: 'Issuing jurisdiction must be a valid 2-character code'
    });
  }
  
  if (!isValidDate(data.document.issueDate)) {
    errors.push({
      field: 'issueDate',
      message: 'Issue date must be in format MM/DD/YYYY'
    });
  }
  
  if (!isValidDate(data.document.expirationDate)) {
    errors.push({
      field: 'expirationDate',
      message: 'Expiration date must be in format MM/DD/YYYY'
    });
  }
  
  // Validate personal information
  if (!data.personal.firstName || data.personal.firstName.length > 40) {
    errors.push({
      field: 'firstName',
      message: 'First name is required and must be 40 characters or less'
    });
  }
  
  if (!data.personal.lastName || data.personal.lastName.length > 40) {
    errors.push({
      field: 'lastName',
      message: 'Last name is required and must be 40 characters or less'
    });
  }
  
  if (data.personal.middleName && data.personal.middleName.length > 40) {
    errors.push({
      field: 'middleName',
      message: 'Middle name must be 40 characters or less'
    });
  }
  
  if (!isValidDate(data.personal.dateOfBirth)) {
    errors.push({
      field: 'dateOfBirth',
      message: 'Date of birth must be in format MM/DD/YYYY'
    });
  }
  
  if (!data.personal.gender || !['M', 'F', 'X'].includes(data.personal.gender)) {
    errors.push({
      field: 'gender',
      message: 'Gender must be M (Male), F (Female), or X (Non-binary)'
    });
  }
  
  // Validate address
  if (!data.personal.addressStreet || data.personal.addressStreet.length > 35) {
    errors.push({
      field: 'addressStreet',
      message: 'Street address is required and must be 35 characters or less'
    });
  }
  
  if (!data.personal.addressCity || data.personal.addressCity.length > 20) {
    errors.push({
      field: 'addressCity',
      message: 'City is required and must be 20 characters or less'
    });
  }
  
  if (!data.personal.addressState || data.personal.addressState.length !== 2) {
    errors.push({
      field: 'addressState',
      message: 'State must be a valid 2-character code'
    });
  }
  
  if (!data.personal.addressPostalCode || !/^\d{5}(-\d{4})?$/.test(data.personal.addressPostalCode)) {
    errors.push({
      field: 'addressPostalCode',
      message: 'Postal code must be in format 12345 or 12345-6789'
    });
  }
  
  // Validate physical characteristics
  if (!data.personal.eyeColor) {
    errors.push({
      field: 'eyeColor',
      message: 'Eye color is required'
    });
  }
  
  if (!data.personal.hairColor) {
    errors.push({
      field: 'hairColor',
      message: 'Hair color is required'
    });
  }
  
  if (!data.personal.height) {
    errors.push({
      field: 'height',
      message: 'Height is required'
    });
  }
  
  if (!data.personal.weight) {
    errors.push({
      field: 'weight',
      message: 'Weight is required'
    });
  }
  
  if (!data.personal.uniqueId) {
    errors.push({
      field: 'uniqueId',
      message: 'Document number/unique ID is required'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a field individually and returns an error message if invalid
 */
export function validateField(field: string, value: string): string | null {
  if (field === 'documentType' && (!value || !['DL', 'ID'].includes(value))) {
    return 'Document type must be DL (Driver License) or ID (Identification Card)';
  }
  
  if (field === 'issuingJurisdiction' && (!value || value.length !== 2)) {
    return 'Issuing jurisdiction must be a valid 2-character code';
  }
  
  if ((field === 'issueDate' || field === 'expirationDate' || field === 'dateOfBirth') && !isValidDate(value)) {
    return `${field === 'dateOfBirth' ? 'Date of birth' : (field === 'issueDate' ? 'Issue date' : 'Expiration date')} must be in format MM/DD/YYYY`;
  }
  
  if (field === 'gender' && (!value || !['M', 'F', 'X'].includes(value))) {
    return 'Gender must be M (Male), F (Female), or X (Non-binary)';
  }
  
  if (field === 'addressPostalCode' && (!value || !/^\d{5}(-\d{4})?$/.test(value))) {
    return 'Postal code must be in format 12345 or 12345-6789';
  }
  
  if (field === 'addressState' && (!value || value.length !== 2)) {
    return 'State must be a valid 2-character code';
  }
  
  return null;
}