type LineItem = {
  date?: null | string;
  description?: null | string;
  discount?: null | number;
  end_date?: null | string;
  hsn?: null | string;
  id?: null | number;
  order?: null | number;
  price?: null | number;
  quantity?: null | number;
  reference?: null | string;
  section?: null | string;
  sku?: null | string;
  start_date?: null | string;
  tags?: null | null[];
  tax?: null | number;
  tax_rate?: null | number;
  total?: null | number;
  type?: null | string;
  unit_of_measure?: null | string;
};

type TaxLine = {
  base?: null | number;
  name?: null | string;
  order?: null | number;
  rate?: null | number;
  total?: null | number;
};

type Vendor = {
  address?: null | string;
  category?: null | string;
  email?: null | string;
  fax_number?: null | string;
  name?: null | string;
  phone_number?: null | string;
  raw_name?: null | string;
  vendor_logo?: null | string;
  vendor_reg_number?: null | string;
  vendor_type?: null | string;
  web?: null | string;
};

type Payment = {
  card_number?: null | string;
  display_name?: null | string;
  terms?: null | number;
  type?: null | string;
};

export type VeryfiReceipt = {
  abn_number?: null | string;
  account_number?: null | string;
  bill_to_address?: null | string;
  bill_to_name?: null | string;
  bill_to_vat_number?: null | string;
  card_number?: null | string;
  cashback?: null | number;
  category?: null | string;
  created?: null | string;
  currency_code?: null | string;
  date?: null | string;
  delivery_date?: null | string;
  discount?: null | number;
  document_reference_number?: null | string;
  document_title?: null | string;
  document_type?: null | string;
  due_date?: null | string;
  duplicate_of?: null | number;
  external_id?: null | string;
  id?: null | number;
  img_file_name?: null | string;
  img_thumbnail_url?: null | string;
  img_url?: null | string;
  insurance?: null | number;
  invoice_number?: null | string;
  is_duplicate?: null | number;
  line_items?: null | LineItem[];
  notes?: null | string;
  ocr_text?: null | string;
  order_date?: null | string;
  payment?: null | Payment;
  payment_display_name?: null | string;
  payment_terms?: null | string;
  payment_type?: null | string;
  phone_number?: null | string;
  purchase_order_number?: null | string;
  rounding?: null | number;
  service_end_date?: null | string;
  service_start_date?: null | string;
  ship_date?: null | string;
  ship_to_address?: null | string;
  ship_to_name?: null | string;
  shipping?: null | number;
  store_number?: null | string;
  subtotal?: null | number;
  tax?: null | number;
  tax_lines?: null | TaxLine[];
  tip?: null | number;
  total?: null | number;
  total_weight?: null | string;
  tracking_number?: null | string;
  updated?: null | string;
  vat_number?: null | string;
  vendor?: null | Vendor;
  vendor_account_number?: null | string;
  vendor_bank_name?: null | string;
  vendor_bank_number?: null | string;
  vendor_bank_swift?: null | string;
  vendor_iban?: null | string;
};

type ItemType = 'food' | 'product' | 'discount' | LineItem['type'];

export interface ReceiptItem {
  id: LineItem['id'];
  name: LineItem['description'];
  quantity: LineItem['quantity'];
  price: LineItem['price'];
  total: LineItem['total'];
  date: LineItem['date'];
  type: ItemType;
}

export interface ReceiptVendor {
  name: VeryfiReceipt['vendor']['name'];
  rawName: VeryfiReceipt['vendor']['raw_name'];
  address: VeryfiReceipt['vendor']['address'];
  storeNumber: VeryfiReceipt['store_number'];
}

export interface ReceiptPayment {
  cardNumber: VeryfiReceipt['payment']['card_number'];
  displayName: VeryfiReceipt['payment']['display_name'];
  terms: VeryfiReceipt['payment']['terms'];
  type: VeryfiReceipt['payment']['type'];
}

export interface Receipt {
  id: VeryfiReceipt['id'];
  currency: VeryfiReceipt['currency_code'];
  type: 'receipt' | VeryfiReceipt['document_type'];
  vendor: ReceiptVendor;
  total: VeryfiReceipt['total'];
  payment: ReceiptPayment;
  items: ReceiptItem[];
}
