import { ElementIdentifier } from '../types/aamva';

export const JURISDICTIONS = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  // Canadian provinces
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' },
];

export const EYE_COLORS = [
  { code: 'BLK', name: 'Black' },
  { code: 'BLU', name: 'Blue' },
  { code: 'BRO', name: 'Brown' },
  { code: 'GRY', name: 'Gray' },
  { code: 'GRN', name: 'Green' },
  { code: 'HAZ', name: 'Hazel' },
  { code: 'MAR', name: 'Maroon' },
  { code: 'PNK', name: 'Pink' },
  { code: 'DIC', name: 'Dichromatic' },
  { code: 'UNK', name: 'Unknown' },
];

export const HAIR_COLORS = [
  { code: 'BAL', name: 'Bald' },
  { code: 'BLK', name: 'Black' },
  { code: 'BLN', name: 'Blond' },
  { code: 'BRO', name: 'Brown' },
  { code: 'GRY', name: 'Gray' },
  { code: 'RED', name: 'Red/Auburn' },
  { code: 'SDY', name: 'Sandy' },
  { code: 'WHI', name: 'White' },
  { code: 'UNK', name: 'Unknown' },
];

// Field definitions with max lengths and formats based on AAMVA 8.1
export const FIELD_DEFINITIONS = {
  [ElementIdentifier.DCS]: { maxLength: 40, description: 'Last Name', required: true, regex: /^[A-Za-z0-9,'-.]+$/ },
  [ElementIdentifier.DCT]: { maxLength: 40, description: 'First Name', required: true, regex: /^[A-Za-z0-9,'-.]+$/ },
  [ElementIdentifier.DCU]: { maxLength: 40, description: 'Middle Name', required: false, regex: /^[A-Za-z0-9,'-.]*$/ },
  [ElementIdentifier.DAG]: { maxLength: 35, description: 'Street Address', required: true, regex: /^[A-Za-z0-9,.'#\- ]+$/ },
  [ElementIdentifier.DAI]: { maxLength: 20, description: 'City', required: true, regex: /^[A-Za-z0-9,.'#\- ]+$/ },
  [ElementIdentifier.DAJ]: { maxLength: 2, description: 'State', required: true, regex: /^[A-Z]{2}$/ },
  [ElementIdentifier.DAK]: { maxLength: 11, description: 'Postal Code', required: true, regex: /^[0-9]{5}(-[0-9]{4})?$/ },
  [ElementIdentifier.DAQ]: { maxLength: 25, description: 'Document Number', required: true, regex: /^[A-Za-z0-9-]+$/ },
  [ElementIdentifier.DCF]: { maxLength: 8, description: 'Document Issue Date', required: true, regex: /^[0-9]{8}$/ },
  [ElementIdentifier.DCG]: { maxLength: 8, description: 'Document Expiration Date', required: true, regex: /^[0-9]{8}$/ },
  [ElementIdentifier.DDE]: { maxLength: 8, description: 'Date of Birth', required: true, regex: /^[0-9]{8}$/ },
  [ElementIdentifier.DDF]: { maxLength: 1, description: 'Gender', required: true, regex: /^[MFX1-9]$/ },
  [ElementIdentifier.DAU]: { maxLength: 6, description: 'Height', required: true, regex: /^[0-9]{3}(cm|in)$/ },
  [ElementIdentifier.DAY]: { maxLength: 3, description: 'Eye Color', required: true, regex: /^(BLK|BLU|BRO|GRY|GRN|HAZ|MAR|PNK|DIC|UNK)$/ },
  [ElementIdentifier.DAZ]: { maxLength: 3, description: 'Hair Color', required: true, regex: /^(BAL|BLK|BLN|BRO|GRY|RED|SDY|WHI|UNK)$/ },
  [ElementIdentifier.DCA]: { maxLength: 4, description: 'Vehicle Class', required: false, regex: /^[A-Z0-9]{1,4}$/ },
  [ElementIdentifier.DCB]: { maxLength: 10, description: 'Restrictions', required: false, regex: /^[A-Z0-9]{0,10}$/ },
  [ElementIdentifier.DCD]: { maxLength: 5, description: 'Endorsements', required: false, regex: /^[A-Z0-9]{0,5}$/ },
};

// AAMVA field groups for UI organization
export const FIELD_GROUPS = [
  {
    id: 'document',
    label: 'Document Information',
    fields: [
      { id: 'documentType', label: 'Document Type', required: true },
      { id: 'issuingJurisdiction', label: 'Issuing Jurisdiction', required: true },
      { id: 'uniqueId', label: 'Document Number', required: true, elementId: ElementIdentifier.DAQ },
      { id: 'issueDate', label: 'Issue Date', required: true, elementId: ElementIdentifier.DCF },
      { id: 'expirationDate', label: 'Expiration Date', required: true, elementId: ElementIdentifier.DCG },
      { id: 'vehicleClassifications', label: 'Vehicle Class', required: false, elementId: ElementIdentifier.DCA },
      { id: 'restrictionCodes', label: 'Restrictions', required: false, elementId: ElementIdentifier.DCB },
      { id: 'endorsementCodes', label: 'Endorsements', required: false, elementId: ElementIdentifier.DCD },
    ]
  },
  {
    id: 'personal',
    label: 'Personal Information',
    fields: [
      { id: 'lastName', label: 'Last Name', required: true, elementId: ElementIdentifier.DCS },
      { id: 'firstName', label: 'First Name', required: true, elementId: ElementIdentifier.DCT },
      { id: 'middleName', label: 'Middle Name', required: false, elementId: ElementIdentifier.DCU },
      { id: 'dateOfBirth', label: 'Date of Birth', required: true, elementId: ElementIdentifier.DDE },
      { id: 'gender', label: 'Gender', required: true, elementId: ElementIdentifier.DDF },
    ]
  },
  {
    id: 'physical',
    label: 'Physical Characteristics',
    fields: [
      { id: 'eyeColor', label: 'Eye Color', required: true, elementId: ElementIdentifier.DAY },
      { id: 'hairColor', label: 'Hair Color', required: true, elementId: ElementIdentifier.DAZ },
      { id: 'height', label: 'Height', required: true, elementId: ElementIdentifier.DAU },
      { id: 'weight', label: 'Weight (lbs)', required: true },
    ]
  },
  {
    id: 'address',
    label: 'Address Information',
    fields: [
      { id: 'addressStreet', label: 'Street Address', required: true, elementId: ElementIdentifier.DAG },
      { id: 'addressCity', label: 'City', required: true, elementId: ElementIdentifier.DAI },
      { id: 'addressState', label: 'State', required: true, elementId: ElementIdentifier.DAJ },
      { id: 'addressPostalCode', label: 'Postal Code', required: true, elementId: ElementIdentifier.DAK },
      { id: 'country', label: 'Country', required: true },
    ]
  }
];

// AAMVA Compliance Indicators
export const AAMVA_COMPLIANCE_INDICATORS = {
  HEADER: '@\n\u001E\rANSI ',
  FILE_TYPE: 'DL',
  VERSIONS: {
    '08': '00080',
    '09': '00090',
    '10': '00100',
  },
  ISSUER_ID_NUMBER: 'IIN',
  PDF417_OFFSET: 'PDF',
  SEGMENT_TERMINATOR: '\n',
  RECORD_SEPARATOR: '\u001E',
  FIELD_SEPARATOR: '\u001F',
  SUBFILE_DESIGNATORS: {
    HEADER: 'H',
    DRIVER_LICENSE: 'L',
    IDENTIFICATION: 'I',
    ZV: 'Z', // Jurisdiction-specific data
  }
};