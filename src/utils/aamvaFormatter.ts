import { AAMVAData, ElementIdentifier } from '../types/aamva';
import { AAMVA_COMPLIANCE_INDICATORS, FIELD_DEFINITIONS } from '../constants/aamvaFields';

/**
 * Formats a date string from MM/DD/YYYY to MMDDYYYY format
 */
export function formatDate(date: string): string {
  if (!date) return '';
  
  // Handle different possible input formats
  const normalizedDate = date.replace(/[-/]/g, '/');
  const parts = normalizedDate.split('/');
  
  if (parts.length !== 3) return '';
  
  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
  
  return `${month}${day}${year}`;
}

/**
 * Generates the header for an AAMVA-compliant barcode data string
 */
function generateHeader(data: AAMVAData): string {
  const { version, document } = data;
  const docType = document.documentType;
  const jurisdiction = document.issuingJurisdiction;
  const versionNumber = AAMVA_COMPLIANCE_INDICATORS.VERSIONS[version] || AAMVA_COMPLIANCE_INDICATORS.VERSIONS['08'];
  
  // Compliance indicator and version
  return `${AAMVA_COMPLIANCE_INDICATORS.HEADER}${docType}${versionNumber}${jurisdiction}${AAMVA_COMPLIANCE_INDICATORS.SEGMENT_TERMINATOR}`;
}

/**
 * Creates the driver license subfile based on AAMVA standard
 */
function createDriverLicenseSubfile(data: AAMVAData): string {
  const { personal, document } = data;
  const subfileDesignator = AAMVA_COMPLIANCE_INDICATORS.SUBFILE_DESIGNATORS.DRIVER_LICENSE;
  const fieldSeparator = AAMVA_COMPLIANCE_INDICATORS.FIELD_SEPARATOR;
  const recordSeparator = AAMVA_COMPLIANCE_INDICATORS.RECORD_SEPARATOR;
  
  // Initialize with subfile type
  let subfile = `${recordSeparator}${subfileDesignator}${fieldSeparator}`;
  
  // Add required fields
  // DL Number (DAQ)
  subfile += `${ElementIdentifier.DAQ}${fieldSeparator}${personal.uniqueId}${recordSeparator}`;
  
  // Name fields (DCS, DCT, DCU)
  subfile += `${ElementIdentifier.DCS}${fieldSeparator}${personal.lastName}${recordSeparator}`;
  subfile += `${ElementIdentifier.DCT}${fieldSeparator}${personal.firstName}${recordSeparator}`;
  
  if (personal.middleName) {
    subfile += `${ElementIdentifier.DCU}${fieldSeparator}${personal.middleName}${recordSeparator}`;
  }
  
  // DOB (DDE)
  subfile += `${ElementIdentifier.DDE}${fieldSeparator}${formatDate(personal.dateOfBirth)}${recordSeparator}`;
  
  // Gender (DDF)
  subfile += `${ElementIdentifier.DDF}${fieldSeparator}${personal.gender}${recordSeparator}`;
  
  // Issue and expiration dates (DCF, DCG)
  subfile += `${ElementIdentifier.DCF}${fieldSeparator}${formatDate(document.issueDate)}${recordSeparator}`;
  subfile += `${ElementIdentifier.DCG}${fieldSeparator}${formatDate(document.expirationDate)}${recordSeparator}`;
  
  // Address fields (DAG, DAI, DAJ, DAK)
  subfile += `${ElementIdentifier.DAG}${fieldSeparator}${personal.addressStreet}${recordSeparator}`;
  subfile += `${ElementIdentifier.DAI}${fieldSeparator}${personal.addressCity}${recordSeparator}`;
  subfile += `${ElementIdentifier.DAJ}${fieldSeparator}${personal.addressState}${recordSeparator}`;
  subfile += `${ElementIdentifier.DAK}${fieldSeparator}${personal.addressPostalCode}${recordSeparator}`;
  
  // Physical characteristics (DAY, DAZ, DAU)
  subfile += `${ElementIdentifier.DAY}${fieldSeparator}${personal.eyeColor}${recordSeparator}`;
  subfile += `${ElementIdentifier.DAZ}${fieldSeparator}${personal.hairColor}${recordSeparator}`;
  subfile += `${ElementIdentifier.DAU}${fieldSeparator}${personal.height}${recordSeparator}`;
  
  // Add vehicle class, restrictions, and endorsements
  if (document.vehicleClassifications) {
    subfile += `${ElementIdentifier.DCA}${fieldSeparator}${document.vehicleClassifications}${recordSeparator}`;
  }
  
  if (document.restrictionCodes) {
    subfile += `${ElementIdentifier.DCB}${fieldSeparator}${document.restrictionCodes}${recordSeparator}`;
  }
  
  if (document.endorsementCodes) {
    subfile += `${ElementIdentifier.DCD}${fieldSeparator}${document.endorsementCodes}${recordSeparator}`;
  }
  
  // Add required country field
  subfile += `ZYZ${fieldSeparator}${document.country}${recordSeparator}`;
  
  return subfile;
}

/**
 * Calculate checksum for the encoded data
 * This is a simple implementation and would need to be expanded for production use
 */
function calculateChecksum(data: string): string {
  let sum = 0;
  
  for (let i = 0; i < data.length; i++) {
    sum += data.charCodeAt(i);
  }
  
  // Format as 4-digit hex number padded with leading zeros
  return sum.toString(16).padStart(4, '0').toUpperCase();
}

/**
 * Format AAMVA data into a correctly structured string for PDF417 encoding
 */
export function formatAAMVAData(data: AAMVAData): string {
  const header = generateHeader(data);
  const driverLicenseData = createDriverLicenseSubfile(data);
  
  // Combine all parts
  const encodedData = `${header}${driverLicenseData}`;
  
  // Calculate and append checksum
  const checksum = calculateChecksum(encodedData);
  
  return `${encodedData}${AAMVA_COMPLIANCE_INDICATORS.RECORD_SEPARATOR}ZYZ${AAMVA_COMPLIANCE_INDICATORS.FIELD_SEPARATOR}${checksum}`;
}

/**
 * Formats the raw AAMVA data into a human-readable format for preview
 */
export function formatAAMVADataForPreview(data: AAMVAData): Record<string, string> {
  const formattedData: Record<string, string> = {};

  // Document information
  formattedData['Document Type'] = data.document.documentType;
  formattedData['Issuing Jurisdiction'] = data.document.issuingJurisdiction;
  formattedData['AAMVA Version'] = data.version;
  formattedData['Document Number'] = data.personal.uniqueId;
  formattedData['Issue Date'] = formatDate(data.document.issueDate);
  formattedData['Expiration Date'] = formatDate(data.document.expirationDate);
  
  // Personal information
  formattedData['Name'] = `${data.personal.lastName}, ${data.personal.firstName} ${data.personal.middleName || ''}`.trim();
  formattedData['Date of Birth'] = formatDate(data.personal.dateOfBirth);
  formattedData['Gender'] = data.personal.gender;
  
  // Address information
  formattedData['Address'] = data.personal.addressStreet;
  formattedData['City'] = data.personal.addressCity;
  formattedData['State'] = data.personal.addressState;
  formattedData['Postal Code'] = data.personal.addressPostalCode;
  formattedData['Country'] = data.document.country;
  
  // Physical characteristics
  formattedData['Eye Color'] = data.personal.eyeColor;
  formattedData['Hair Color'] = data.personal.hairColor;
  formattedData['Height'] = data.personal.height;
  formattedData['Weight'] = data.personal.weight;
  
  // Optional information
  if (data.document.vehicleClassifications) {
    formattedData['Vehicle Class'] = data.document.vehicleClassifications;
  }
  
  if (data.document.restrictionCodes) {
    formattedData['Restriction Codes'] = data.document.restrictionCodes;
  }
  
  if (data.document.endorsementCodes) {
    formattedData['Endorsement Codes'] = data.document.endorsementCodes;
  }
  
  return formattedData;
}