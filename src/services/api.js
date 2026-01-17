// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || true; // Enable demo mode by default

// Mock data for demo mode
const mockInvoices = {};
let invoiceCounter = 1000;

// Create invoice
export const createInvoice = async (invoiceData) => {
  if (DEMO_MODE) {
    // Demo mode - return mock response
    await new Promise(resolve => setTimeout(resolve, 500));
    const id = `INV-${invoiceCounter++}`;
    mockInvoices[id] = { id, ...invoiceData, createdAt: new Date().toISOString() };
    return { id, ...invoiceData };
  }

  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json();
};

// Fetch single invoice
export const getInvoice = async (id) => {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (mockInvoices[id]) return mockInvoices[id];
    throw new Error('Invoice not found');
  }

  const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
  if (!response.ok) throw new Error('Failed to fetch invoice');
  return response.json();
};

// Fetch all invoices
export const getInvoices = async () => {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Object.values(mockInvoices);
  }

  const response = await fetch(`${API_BASE_URL}/invoices`);
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json();
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockInvoices[id] = { id, ...invoiceData, updatedAt: new Date().toISOString() };
    return mockInvoices[id];
  }

  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData),
  });
  if (!response.ok) throw new Error('Failed to update invoice');
  return response.json();
};

// Delete invoice
export const deleteInvoice = async (id) => {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    delete mockInvoices[id];
    return { success: true };
  }

  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete invoice');
  return response.json();
};

// Generate PDF
export const generatePDF = async (invoiceData) => {
  if (DEMO_MODE) {
    // In demo mode, just trigger the browser's print dialog
    setTimeout(() => window.print(), 100);
    return new Blob(['PDF'], { type: 'application/pdf' });
  }

  const response = await fetch(`${API_BASE_URL}/invoices/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData),
  });
  if (!response.ok) throw new Error('Failed to generate PDF');
  return response.blob();
};
