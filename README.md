# WPS Timesheet Automated Generator

A modern, full-stack web application for automatically generating and managing employee timesheets with real-time data synchronization, PDF generation, and company-based organization. Built with Next.js, TypeScript, Firebase, and deployed on Vercel.

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.1.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## 🌟 Features

### 🤖 **Automated Timesheet Generation**
- Automatic timesheet creation on the 26th of each month for the following month
- Bi-weekly timesheet generation (S1: 1st-15th, S2: 16th-end of month)
- Smart conflict detection to prevent duplicate timesheets
- Early generation warnings to maintain workflow consistency
- Auto-generation for new candidates added after the 26th

### 📊 **Candidate Management**
- Add, edit, and delete candidate profiles
- Organize candidates by company affiliation
- Real-time data synchronization across all users
- Email and contact information tracking

### 📅 **Advanced Timesheet Features**
- Generate monthly timesheets with both S1 and S2 periods
- Automatic calculation of work days (Monday-Friday only)
- Track timesheet status (downloaded/pending/uploaded)
- Visual indicators for completion status
- Overdue and urgent timesheet detection
- Month/year selector for future timesheet generation only

### 📄 **PDF Export & Signed Document Management**
- Professional PDF timesheet generation using jsPDF
- Landscape orientation with company branding
- WPS logo integration
- Structured layout with signature sections
- Automatic file naming with candidate and date information
- Upload and download of signed timesheets
- Company-based folder structure for document organization in Firebase Storage
- Secure storage with Firebase Storage rules

### 🏢 **Company Organization**
- Group candidates by company
- Collapsible company sections
- Visual alerts for pending timesheets
- Company-level progress tracking

### 🔄 **Real-time Synchronization**
- Firebase Firestore integration
- Live updates across all connected clients
- Automatic data persistence
- Offline capability with sync on reconnection

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Clean, professional interface
- Intuitive navigation and interactions
- Status indicators and visual feedback
- Accessible design patterns

## 🏗️ Architecture

### **Frontend Stack**
- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Build Tool**: Turbopack (Next.js)

### **Backend & Database**
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase (configured)
- **Real-time**: Firestore onSnapshot listeners
- **Storage**: Cloud-based with Firebase

### **PDF Generation**
- **Library**: jsPDF with autoTable plugin
- **Features**: Dynamic layouts, company branding
- **Format**: Landscape orientation, professional styling

### **Deployment**
- **Platform**: Vercel
- **CI/CD**: Automatic deployment from GitHub
- **Environment**: Production-ready with optimizations

## 📁 Project Structure

```
wps-timesheet/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout with fonts and metadata
│   │   ├── page.tsx             # Main application component
│   │   └── favicon.ico          # Application icon
│   ├── components/
│   │   ├── candidate/           # Candidate management components
│   │   ├── layout/              # Header and status components
│   │   ├── timesheet/           # Timesheet display components
│   │   └── ui/                  # Modal and utility components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAutomaticTimesheetGeneration.ts # Automated generation logic
│   │   ├── useCandidates.ts     # Candidate management hooks
│   │   └── useTimesheets.ts     # Timesheet management hooks
│   ├── utils/                   # Utility functions
│   │   ├── dateUtils.ts         # Date calculation and formatting
│   │   └── pdfGenerator.ts      # PDF generation logic
│   ├── types/                   # TypeScript interfaces and types
│   │   └── index.ts             # All type definitions
│   └── firebase.js              # Firebase configuration and initialization
├── public/                      # Static assets (logo, favicon)
├── .eslintrc.json              # ESLint configuration for TypeScript
├── eslint.config.mjs           # Modern ESLint flat config
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment configuration
├── firebase.json               # Firebase deployment configuration
├── firebase.storage.rules      # Firebase Storage security rules
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YezGuardian/wps-timesheet-app.git
   cd wps-timesheet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update `src/firebase.js` with your Firebase project credentials
   - Ensure Firestore is enabled in your Firebase console

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - If port 3000 is occupied, Next.js will automatically use the next available port

## 📦 Dependencies

### Core Dependencies
- **next**: 15.5.0 - React framework with SSR/SSG
- **react**: 19.1.0 - UI library
- **react-dom**: 19.1.0 - React DOM renderer
- **typescript**: 5 - Type safety and developer experience

### Feature Dependencies
- **firebase**: 12.1.0 - Backend services and Firestore
- **jspdf**: 3.0.1 - PDF generation
- **jspdf-autotable**: 5.0.2 - Table formatting for PDFs
- **lucide-react**: 0.541.0 - Modern icon library

### Development Dependencies
- **@tailwindcss/postcss**: 4 - CSS framework
- **eslint**: 9 - Code linting
- **eslint-config-next**: 15.5.0 - Next.js ESLint rules

## 🎯 Key Components

### **Main Application (`page.tsx`)**
The core component containing all application logic:
- State management for candidates and timesheets
- Firebase integration and real-time listeners
- PDF generation functionality
- Modal management for candidate creation
- Automatic timesheet generation hooks

### **Component Hierarchy**
```
App
├── Header                    # Title and "Add Candidate" button
├── Status Alerts            # System-wide notifications
├── CandidateList           # Main content area
│   └── CompanyGroup        # Collapsible company sections
│       └── CandidateCard   # Individual candidate management
│           ├── Monthly Timesheet Generator
│           └── TimesheetItem # Timesheet status and actions
└── AddCandidateModal       # Candidate creation form
```

### **Data Models**

#### Candidate Interface
```typescript
interface Candidate {
  id: string;          // Firestore document ID
  name: string;        // Full name
  company: string;     // Company affiliation
  email: string;       // Contact email
  contactNumber: string; // Contact phone number
  manager: string;     // Manager name
  employeeId: string;  // Employee ID
  timesheets: Timesheet[]; // Associated timesheets
}
```

#### Timesheet Interface
```typescript
interface Timesheet {
  id: number;          // Unique identifier
  periodEnding: string; // Period ending date (YYYY-MM-DD)
  dates: string[];     // Working days in the period
  downloaded: boolean; // Download status
  managerName: string; // Manager name
  employeeId: string;  // Employee ID
  uploaded?: boolean;  // Upload status
  uploadedFileName?: string; // Uploaded file name
  uploadedAt?: string; // Upload timestamp
}
```

## 🔧 Configuration

### **Firebase Setup**
The application requires a Firebase project with Firestore enabled:

1. Create a new Firebase project
2. Enable Firestore Database
3. Copy your Firebase config to `src/firebase.js`
4. Update Firestore security rules as needed

### **ESLint Configuration**
Custom ESLint rules for jsPDF integration:
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

### **Vercel Deployment**
The application is configured for automatic deployment:
- **Domain**: Auto-generated Vercel URL
- **Build Command**: `npm run build`
- **Environment**: Production optimized
- **Deployment**: Automatic on GitHub push

## 📝 Usage Guide

### **Adding Candidates**
1. Click "Add Candidate" in the header
2. Fill in candidate information:
   - Full name
   - Company name
   - Email address
   - Contact number
   - Manager name
   - Employee ID
3. Click "Add Candidate" to save
4. If added after the 26th, timesheets for the next month are automatically generated

### **Generating Timesheets**
1. Navigate to a candidate card
2. Use the month/year selector to choose a future month
3. Click "Generate Monthly Timesheets" to create both S1 and S2 timesheets
4. The system automatically calculates working days for each period

### **Downloading PDFs**
1. Click the preview icon to view the timesheet
2. Click the download icon to generate and download the PDF
3. The PDF generates automatically with:
   - Company branding and WPS logo
   - Professional timesheet layout
   - Candidate information pre-filled
   - Signature sections for employee and manager

### **Signing and Uploading Timesheets**
1. Print the downloaded PDF and get it signed by the manager
2. Click the "Upload" button next to the timesheet
3. Select the signed PDF file
4. The file is stored in company-based folders in Firebase Storage

### **Viewing Signed Timesheets**
1. After uploading, a "View" button appears
2. Click the "View" button to download and view the signed timesheet
3. Files are organized by company and candidate in Firebase Storage

### **Managing Data**
- **Delete candidates**: Click the trash icon in candidate cards
- **Delete timesheets**: Click the trash icon next to timesheet items
- **Company organization**: Candidates are automatically grouped by company
- **Status tracking**: Visual indicators show download and upload status

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

### **Development Workflow**
1. Make changes to source files
2. Development server auto-reloads with Turbopack
3. TypeScript provides real-time type checking
4. ESLint enforces code quality standards
5. Tailwind CSS enables rapid styling

### **Production Build**
The application is optimized for production:
- **Bundle size**: ~215KB First Load JS
- **Rendering**: Static generation where possible
- **Performance**: Optimized with Next.js 15.5.0
- **SEO**: Proper metadata and structure

## 🔒 Security Considerations

- **Firebase Security Rules**: Configure Firestore rules for your use case
- **Environment Variables**: Store sensitive config in environment variables
- **Client-side Security**: Firebase credentials are safe for client-side use
- **Data Validation**: Input validation on both client and server

## 🚀 Deployment

The application is automatically deployed to Vercel:

1. **GitHub Integration**: Pushes to main branch trigger deployments
2. **Build Process**: Automated build and optimization
3. **Environment**: Production-ready with CDN
4. **Monitoring**: Vercel provides analytics and performance monitoring

### **Manual Deployment**
```
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Firebase**
