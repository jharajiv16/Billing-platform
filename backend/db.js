import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve('invoices.json');

// Initialize DB with some sample data if it doesn't exist
let invoices = {};

// Load data from file on startup
if (fs.existsSync(DB_FILE)) {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    invoices = JSON.parse(data);
    console.log(`Loaded ${Object.keys(invoices).length} invoices from ${DB_FILE}`);
  } catch (err) {
    console.error('Error loading database:', err);
  }
}

// Helper to save data
const saveDB = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(invoices, null, 2));
  } catch (err) {
    console.error('Error saving database:', err);
  }
};

export const db = {
  getInvoices: () => Object.values(invoices),
  
  getInvoice: (id) => invoices[id],
  
  createInvoice: (invoice) => {
    // Generate simple ID if not provided (though frontend might generate one, backend should ensure it)
    const id = invoice.id || `INV-${Date.now()}`;
    const newInvoice = { ...invoice, id, createdAt: new Date().toISOString() };
    invoices[id] = newInvoice;
    saveDB();
    return newInvoice;
  },
  
  updateInvoice: (id, updates) => {
    if (!invoices[id]) return null;
    invoices[id] = { ...invoices[id], ...updates, updatedAt: new Date().toISOString() };
    saveDB();
    return invoices[id];
  },
  
  deleteInvoice: (id) => {
    if (!invoices[id]) return false;
    delete invoices[id];
    saveDB();
    return true;
  }
};
