# SocialXspark Invoice Generator - Backend Integration Guide

## Frontend Setup

The frontend is now configured for backend integration. Here's what you need to do:

### Environment Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the API endpoint in `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
```

## Backend API Requirements

Your backend needs to implement the following endpoints:

### POST `/api/invoices`
Create a new invoice

**Request Body:**
```json
{
  "invoiceNumber": "SX-5000",
  "date": "2026-01-17",
  "sender": {
    "name": "SocialXspark Agency",
    "email": "billing@socialxspark.com",
    "address": "Mumbai, India",
    "gst": "27AAAAA0000A1Z5"
  },
  "client": {
    "name": "Client Name",
    "address": "Client Address"
  },
  "items": [
    {
      "id": 1,
      "description": "Brand Collaboration",
      "quantity": 1,
      "rate": 10000
    }
  ],
  "bank": {
    "name": "Bank Name",
    "account": "Account Number",
    "ifsc": "IFSC Code"
  },
  "notes": "SocialXspark never asks for social media passwords."
}
```

**Response:**
```json
{
  "id": "invoice_id_123",
  "invoiceNumber": "SX-5000",
  ...
}
```

### GET `/api/invoices`
Fetch all invoices

**Response:**
```json
[
  {
    "id": "invoice_id_123",
    "invoiceNumber": "SX-5000",
    ...
  }
]
```

### GET `/api/invoices/:id`
Fetch a single invoice by ID

**Response:**
```json
{
  "id": "invoice_id_123",
  "invoiceNumber": "SX-5000",
  ...
}
```

### PUT `/api/invoices/:id`
Update an invoice

**Request Body:** Same as POST

**Response:**
```json
{
  "id": "invoice_id_123",
  "invoiceNumber": "SX-5000",
  ...
}
```

### DELETE `/api/invoices/:id`
Delete an invoice

**Response:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

### POST `/api/invoices/pdf`
Generate a PDF for an invoice

**Request Body:** Invoice data object

**Response:** Binary PDF file

## API Service File

The API service is located at: `src/services/api.js`

All API functions are exported and ready to use:
- `createInvoice(invoiceData)` - Create new invoice
- `getInvoice(id)` - Fetch single invoice
- `getInvoices()` - Fetch all invoices
- `updateInvoice(id, invoiceData)` - Update invoice
- `deleteInvoice(id)` - Delete invoice
- `generatePDF(invoiceData)` - Generate PDF

## Custom Hook

Use the `useInvoice` hook (located at `src/hooks/useInvoice.js`) for managing invoice data with backend integration:

```javascript
import { useInvoice } from './hooks/useInvoice';

const { data, updateData, save, fetch, remove, loading, error } = useInvoice(initialData);

// Update local data
updateData({ invoiceNumber: 'SX-5001' });

// Save to backend
await save(invoiceId);

// Fetch from backend
await fetch(invoiceId);

// Delete from backend
await remove(invoiceId);
```

## Error Handling

The application includes error handling with user-friendly messages:
- Error alerts are displayed for 5 seconds
- Success messages are displayed for 3 seconds
- Loading states prevent multiple submissions

## CORS Configuration

Make sure your backend is configured to accept requests from the frontend:

```javascript
// Example CORS configuration (Node.js/Express)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

## Development Server

To run the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or next available port)

## Production Build

To build for production:
```bash
npm run build
```

The build output will be in the `dist/` directory.
