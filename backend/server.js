import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SocialXspark Invoice Backend is running' });
});

// GET /api/invoices - Fetch all invoices
app.get('/api/invoices', (req, res) => {
  const invoices = db.getInvoices();
  res.json(invoices);
});

// GET /api/invoices/:id - Fetch single invoice
app.get('/api/invoices/:id', (req, res) => {
  const invoice = db.getInvoice(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  res.json(invoice);
});

// POST /api/invoices - Create new invoice
app.post('/api/invoices', (req, res) => {
  try {
    const newInvoice = db.createInvoice(req.body);
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/invoices/:id - Update invoice
app.put('/api/invoices/:id', (req, res) => {
  try {
    const updatedInvoice = db.updateInvoice(req.params.id, req.body);
    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/invoices/:id - Delete invoice
app.delete('/api/invoices/:id', (req, res) => {
  const success = db.deleteInvoice(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  res.json({ success: true, message: 'Invoice deleted successfully' });
});

// Helper: Generate PDF
const generateInvoicePDF = async (invoice, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

  doc.pipe(res);

  // --- PDF Generation Logic ---
  
  // Header
  doc.rect(0, 0, doc.page.width, 10).fill('#ea580c'); // orange-600

  // Logos and Title
  doc.fontSize(20).fillColor('#ea580c').font('Helvetica-Bold').text('SocialXspark', 50, 50);
  doc.fontSize(10).fillColor('#6b7280').text('Professional Growth Billing Suite', 50, 75);

  doc.fontSize(24).fillColor('#111827').text('INVOICE', 0, 50, { align: 'right' });
  doc.fontSize(10).fillColor('#ea580c').text(`#${invoice.invoiceNumber}`, 0, 80, { align: 'right' });

  // Generate QR Code
  try {
    const totalAmount = invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0) * (1 + (invoice.gstRate || 18)/100);
    const qrData = `Invoice: ${invoice.invoiceNumber}\nDate: ${invoice.date}\nTotal: ${totalAmount.toFixed(2)}\nBilled To: ${invoice.client.name}`;
    const qrBuffer = await QRCode.toBuffer(qrData, { width: 100, margin: 0 });
    
    // Embed QR Code (Top right, below Invoice #)
    doc.image(qrBuffer, doc.page.width - 150, 110, { width: 100 });
  } catch (err) {
    console.error('QR Gen Error:', err);
  }

  doc.moveDown();
  doc.rect(50, 100, 500, 1).fill('#fed7aa'); // orange-200 divider
  
  // Meta Info
  const topMetaY = 115;
  doc.fontSize(10).fillColor('#9ca3af').font('Helvetica-Bold').text('DATE', 50, topMetaY);
  doc.fillColor('#111827').font('Helvetica').text(invoice.date, 50, topMetaY + 15);

  doc.fillColor('#9ca3af').font('Helvetica-Bold').text('CURRENCY', 200, topMetaY, { align: 'left' });
  doc.fillColor('#111827').font('Helvetica').text('INR / USD', 200, topMetaY + 15, { align: 'left' });

  // Addresses
  const addressY = 160;
  
  // Sender (From)
  doc.rect(50, addressY, 230, 80).fill('#fff7ed'); // orange-50
  doc.fillColor('#ea580c').font('Helvetica-Bold').text('FROM', 60, addressY + 10);
  doc.fillColor('#111827').font('Helvetica-Bold').text(invoice.sender.name, 60, addressY + 25);
  doc.fillColor('#4b5563').font('Helvetica').text(invoice.sender.email, 60, addressY + 40);
  doc.text(invoice.sender.address, 60, addressY + 55, { width: 200 });

  // Client (To)
  doc.rect(300, addressY, 250, 80).fill('#eff6ff'); // blue-50
  doc.fillColor('#2563eb').font('Helvetica-Bold').text('BILL TO', 310, addressY + 10);
  doc.fillColor('#111827').font('Helvetica-Bold').text(invoice.client.name, 310, addressY + 25);
  doc.fillColor('#4b5563').font('Helvetica').text(invoice.client.address || '', 310, addressY + 40, { width: 230 });

  // Items Table
  const tableTop = 260;
  doc.rect(50, tableTop, 500, 25).fill('#ffedd5'); // orange-100 header
  
  doc.fillColor('#111827').font('Helvetica-Bold');
  doc.text('Description', 60, tableTop + 7);
  doc.text('Qty', 350, tableTop + 7, { width: 50, align: 'center' });
  doc.text('Rate', 410, tableTop + 7, { width: 60, align: 'right' });
  doc.text('Amount', 480, tableTop + 7, { width: 60, align: 'right' });

  let itemY = tableTop + 30;
  invoice.items.forEach((item, i) => {
    if (i % 2 === 0) doc.rect(50, itemY - 5, 500, 20).fill('#f9fafb'); // gray-50 stripe
    
    doc.fillColor('#374151').font('Helvetica').text(item.description, 60, itemY);
    doc.text(item.quantity.toString(), 350, itemY, { width: 50, align: 'center' });
    doc.text(item.rate.toLocaleString(), 410, itemY, { width: 60, align: 'right' });
    
    const amount = item.quantity * item.rate;
    doc.fillColor('#ea580c').font('Helvetica-Bold').text(amount.toLocaleString(), 480, itemY, { width: 60, align: 'right' });
    
    itemY += 20;
  });

  doc.moveTo(50, itemY).lineTo(550, itemY).stroke('#fed7aa');

  // Totals
  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const gstRate = invoice.gstRate || 18; 
  const gstAmount = (subtotal * gstRate) / 100;
  const total = subtotal + gstAmount;

  const totalsY = itemY + 20;
  const totalsLeft = 350;

  doc.fillColor('#4b5563').font('Helvetica').text('Subtotal', totalsLeft, totalsY);
  doc.fillColor('#111827').font('Helvetica-Bold').text(subtotal.toLocaleString(), 480, totalsY, { align: 'right' });

  doc.fillColor('#4b5563').font('Helvetica').text(`GST (${gstRate}%)`, totalsLeft, totalsY + 15);
  doc.fillColor('#111827').font('Helvetica-Bold').text(gstAmount.toLocaleString(), 480, totalsY + 15, { align: 'right' });

  doc.rect(totalsLeft, totalsY + 35, 200, 25).fill('#ea580c');
  doc.fillColor('#ffffff').font('Helvetica-Bold').text('TOTAL', totalsLeft + 10, totalsY + 42);
  doc.text(total.toLocaleString(), 480, totalsY + 42, { align: 'right' });


  // Footer / Banking
  const footerY = 550;
  if (invoice.bank && (invoice.bank.name || invoice.bank.account)) {
    doc.rect(50, footerY, 230, 60).fill('#eff6ff'); // blue-50
    doc.fillColor('#2563eb').font('Helvetica-Bold').text('PAYMENT DETAILS', 60, footerY + 10);
    doc.fillColor('#374151').font('Helvetica').text(`Bank: ${invoice.bank.name || '-'}`, 60, footerY + 25);
    doc.text(`A/c: ${invoice.bank.account || '-'}`, 60, footerY + 37);
    doc.text(`IFSC: ${invoice.bank.ifsc || '-'}`, 60, footerY + 49);
  }

  if (invoice.notes) {
    doc.rect(300, footerY, 250, 60).fill('#fefce8'); // yellow-50
    doc.fillColor('#ca8a04').font('Helvetica-Bold').text('NOTES', 310, footerY + 10);
    doc.fillColor('#374151').font('Helvetica').text(invoice.notes, 310, footerY + 25, { width: 230 });
  }

  doc.end();
};

// GET /api/invoices/:id/pdf - Generate PDF for existing invoice
app.get('/api/invoices/:id/pdf', async (req, res) => {
  const invoice = db.getInvoice(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  await generateInvoicePDF(invoice, res);
});

// POST /api/invoices/pdf - Generate PDF from request body (Preview)
app.post('/api/invoices/pdf', async (req, res) => {
  await generateInvoicePDF(req.body, res);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
