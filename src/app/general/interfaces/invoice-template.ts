import { InvoiceItem } from "./invoice-item";

export interface InvoiceTemplate {
  invoiceNumber: string;
  invoiceDate: string;
  cooNumber: string;
  cooDate: string;
  poNumber: string;
  subject: string;
  billTo: string;
  shipTo?: string;
  items: InvoiceItem[];
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  signatory: {
    name: string;
    position: string;
  };
}