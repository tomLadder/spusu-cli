// Authentication & Session
export interface AuthSession {
  sessionId: string;
  phoneNumber: string;
  expiresAt?: number;
}

export interface LoginStatus {
  loggedIn: boolean;
  billingContractId?: number;
  name?: string;
  hasWriteAccess?: boolean;
  isContractAdmin?: boolean;
}

// Customer Info
export interface Customer {
  customerNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  eMail: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
  language: {
    language: string;
    shortName: string;
    name: string;
    nameInLanguage: string;
  };
  isCompany: boolean;
}

// Invoices
export interface Invoice {
  id: number;
  billperiod: string;
  invoiceNumber: string;
  invoiceDate: string;
  total: {
    amount: number;
    currencyCode: string;
  };
  statusText: string;
  status: 'PAID' | 'OPEN' | 'OVERDUE';
  deliveryText: string;
  delivery: 'INVOICE_ONLINE' | 'INVOICE_PAPER';
  download: boolean;
  itemisedBill: boolean;
}

export interface InvoicesResponse {
  contractStartMonth: number;
  contractStartYear: number;
  year: number;
  invoices: Invoice[];
  paymentMethod: string;
  paymentMethodState: string;
}

// Tariffs & Contracts
export interface Tariff {
  contractType: 'POSTPAID' | 'PREPAID';
  productKey: string;
  phoneAccountId: number;
  phoneNumber: string;
  tariffName: string;
  companyName: string;
  lastname: string;
  firstname: string;
  birthDay: string;
  previousProviderId?: number;
  portingDateTime?: string;
  terminationType?: string;
  isSigned: boolean;
  isPreValidated: boolean;
  portingErrors: string[];
  status: string;
  transferPrepaidCredit: boolean;
}

// Config
export interface Config {
  auth?: AuthSession;
  settings: {
    outputFormat: 'pretty' | 'json';
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
