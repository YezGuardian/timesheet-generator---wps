// --- Type Definitions for Timesheet Management Application ---

export interface UploadLog {
  fileName: string;
  uploadedAt: string;
}

export interface Timesheet {
  id: number;
  periodEnding: string;
  dates: string[];
  downloaded: boolean;
  managerName: string;
  employeeId: string;
  uploaded?: boolean;
  uploadedFileName?: string;
  uploadedAt?: string;
  uploadHistory?: UploadLog[];
}

export interface Candidate {
  id: string;
  name: string;
  company: string;
  email: string;
  contactNumber: string;
  manager: string;
  employeeId: string;
  timesheets: Timesheet[];
}



// Component Props Types
export interface HeaderProps {
  onAddCandidate: () => void;
}

export interface CandidateListProps {
  candidates: Candidate[];
  onAddTimesheet: (candidateId: string, selectedMonth: string, managerName: string, employeeId: string) => void;
  onDownload: (candidate: Candidate, timesheet: Timesheet) => void;
  onPreview: (candidate: Candidate, timesheet: Timesheet) => void;
  onEditCandidate: (candidate: Candidate) => void;
  onUploadTimesheet: (candidate: Candidate, timesheet: Timesheet, file: File) => void;
  onDeleteCandidate: (candidateId: string) => void;
  onDeleteTimesheet: (candidateId: string, timesheetId: number) => void;
  onDownloadSigned?: (candidate: Candidate, timesheet: Timesheet) => void;
}

export interface CompanyGroupProps extends Omit<CandidateListProps, 'candidates'> {
  company: string;
  candidates: Candidate[];
  allCandidates?: Candidate[]; // For conflict checking across all candidates
}

export interface CandidateCardProps extends Omit<CandidateListProps, 'candidates'> {
  candidate: Candidate;
  allCandidates?: Candidate[]; // For conflict checking
}

export interface EditCandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
  onEditCandidate: (candidate: { name: string; company: string; email: string; contactNumber: string; manager: string; employeeId: string; }) => void;
}

export interface TimesheetItemProps {
  sheet: Timesheet;
  candidate: Candidate;
  onDownload: () => void;
  onPreview: () => void;
  onUpload: (file: File) => void;
  onDelete: () => void;
  onDownloadSigned?: () => void;
}

export interface MonthlyTimesheetGroupProps {
  monthName: string;
  timesheets: Timesheet[];
  candidate: Candidate;
  onDownload: (timesheet: Timesheet) => void;
  onPreview: (timesheet: Timesheet) => void;
  onUpload: (timesheet: Timesheet, file: File) => void;
  onDelete: (timesheet: Timesheet) => void;
  onDownloadSigned?: (timesheet: Timesheet) => void;
}

export interface AddCandidateModalProps {
  onClose: () => void;
  onAddCandidate: (candidate: { name: string; company: string; email: string; contactNumber: string; manager: string; employeeId: string; }) => void;
  candidates: Candidate[];
}

export interface TimesheetPreviewModalProps {
  candidate: Candidate;
  timesheet: Timesheet;
  onClose: () => void;
  onDownload: () => void;
}

// Utility Types
export interface PendingActionsSummary {
  pendingDownloads: number;
  pendingUploads: number;
  overduePeriods: number;
}

export interface MonthlyTimesheetGeneration {
  firstHalf: Timesheet;
  secondHalf: Timesheet;
}

// Form Data Types
export interface CandidateFormData {
  name: string;
  company: string;
  email: string;
  contactNumber: string;
  manager: string;
  employeeId: string;
}