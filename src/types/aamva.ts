// Main types for AAMVA data

export type DocumentType = 'DL' | 'ID';

export type AAMVAVersion = '08' | '09' | '10';

export type JurisdictionCode = string; // 2-character code

export interface PersonalData {
  firstName: string;
  lastName: string;
  middleName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  dateOfBirth: string; // Format: MMDDYYYY
  gender: 'M' | 'F' | 'X';
  eyeColor: string;
  hairColor: string;
  height: string; // Format: inches or cm
  weight: string; // Format: pounds or kg
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  country: string;
  placeOfBirth?: string;
  nationality?: string;
  uniqueId: string; // Driver License/ID number
}

export interface DocumentData {
  documentType: DocumentType;
  issueDate: string; // Format: MMDDYYYY
  expirationDate: string; // Format: MMDDYYYY
  issuingJurisdiction: JurisdictionCode;
  country: string; // Usually 'USA' or 'CAN'
  restrictionCodes?: string;
  endorsementCodes?: string;
  vehicleClassifications?: string;
}

export interface OptionalData {
  [key: string]: string;
}

export interface AAMVAData {
  version: AAMVAVersion;
  personal: PersonalData;
  document: DocumentData;
  optional?: OptionalData;
}

// Element identifier types
export const enum ElementIdentifier {
  // Mandatory Data Elements
  DCA = 'DCA', // Jurisdiction-specific vehicle class
  DCB = 'DCB', // Jurisdiction-specific restriction codes
  DCD = 'DCD', // Jurisdiction-specific endorsement codes
  DCS = 'DCS', // Last name
  DCT = 'DCT', // First name
  DCU = 'DCU', // Middle name/initial
  DAG = 'DAG', // Street address
  DAI = 'DAI', // City
  DAJ = 'DAJ', // State
  DAK = 'DAK', // Postal code
  DAQ = 'DAQ', // Document number
  DCF = 'DCF', // Document issue date
  DCG = 'DCG', // Document expiration date
  DDE = 'DDE', // Date of birth
  DDF = 'DDF', // Gender
  DAU = 'DAU', // Height
  DAY = 'DAY', // Eye color
  DAZ = 'DAZ', // Hair color
  DCI = 'DCI', // Place of birth
  DCJ = 'DCJ', // Unique identifier
  DCK = 'DCK', // Inventory control number
  DBK = 'DBK', // Document discriminator
  DAW = 'DAW', // Weight range
  DAX = 'DAX', // Weight (pounds)
  DDH = 'DDH', // Date document is issued
  DBA = 'DBA', // Expiration date
  DBC = 'DBC', // Date of birth
  DAC = 'DAC', // Physical description – weight (kg)
  DAD = 'DAD', // Physical description – eye color
  DAE = 'DAE', // Physical description – height (cm)
  DAF = 'DAF', // Physical description – weight (pounds)
  DAH = 'DAH', // Street name
  DCE = 'DCE', // Family name truncation
  DCH = 'DCH', // Under 18 Until
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}