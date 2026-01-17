# SocialXspark Billing Platform

A professional invoice generation and billing suite built with React (Vite) and Node.js.

![SocialXspark Invoice](https://via.placeholder.com/800x400?text=SocialXspark+Billing+Platform)

## Features

- **Professional Invoice Generation:** Create detailed invoices with custom branding.
- **PDF Export:** Generate high-quality PDF invoices for print or email using the integrated backend service.
- **Invoice Management:** Create, Read, Update, and Delete invoices.
- **Live Preview:** Real-time preview of the invoice as you edit.
- **Tax & Commission:** Configurable GST and Agency Commission settings.

## Project Structure

The project is divided into two main parts:

- **`socialx-invoice/`**: The Frontend application (React + Vite + Tailwind CSS).
- **`backend/`**: The implementation of the API service (Node.js + Express + PDFKit).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend Server

The backend handles data persistence and PDF generation.

```bash
cd backend
npm install
node server.js
```

> The server will start on **http://localhost:3000**

### 2. Start the Frontend Application

The frontend is the user interface for managing invoices.

```bash
cd socialx-invoice
npm install
npm run dev
```

> The application will likely start on **http://localhost:5178** (check terminal output).

## API Documentation

The backend provides the following RESTful endpoints:

- `GET /api/invoices` - Retrieve all invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/:id` - Retrieve a specific invoice
- `PUT /api/invoices/:id` - Update an invoice
- `DELETE /api/invoices/:id` - Delete an invoice
- `POST /api/invoices/pdf` - Generate a PDF file for an invoice

## Technologies

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Express.js, PDFKit, CORS, Body-Parser
- **Storage:** JSON-based file system (Simple persistence)

## Troubleshooting

- **PDF not downloading?** Ensure the backend is running on port 3000.
- **Styles missing?** Ensure dependencies are installed and the dev server is running.
