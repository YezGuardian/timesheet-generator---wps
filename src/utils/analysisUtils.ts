import { Candidate, PendingActionsSummary } from '@/types';
import { getDaysUntilPeriodEnd, isTimesheetOverdue } from './dateUtils';

/**
 * Analyzes all candidates and returns a summary of pending actions
 * @param candidates - Array of candidates
 * @returns Summary of pending downloads, uploads, and overdue periods
 */
export const getPendingActionsSummary = (candidates: Candidate[]): PendingActionsSummary => {
    let pendingDownloads = 0;
    let pendingUploads = 0;
    let overduePeriods = 0;
    
    candidates.forEach(candidate => {
        candidate.timesheets.forEach(timesheet => {
            if (!timesheet.downloaded) {
                pendingDownloads++;
            }
            if (timesheet.downloaded && !timesheet.uploaded) {
                pendingUploads++;
                
                // Check if period ended more than 7 days ago
                if (isTimesheetOverdue(timesheet.periodEnding)) {
                    overduePeriods++;
                }
            }
        });
    });
    
    return { pendingDownloads, pendingUploads, overduePeriods };
};

/**
 * Checks if all timesheets are downloaded
 * @param candidates - Array of candidates
 * @returns True if all timesheets are downloaded
 */
export const areAllTimesheetsDownloaded = (candidates: Candidate[]): boolean => {
    return candidates.length > 0 && candidates.every(c => c.timesheets.every(t => t.downloaded));
};

/**
 * Checks if all timesheets are uploaded
 * @param candidates - Array of candidates
 * @returns True if all timesheets are uploaded
 */
export const areAllTimesheetsUploaded = (candidates: Candidate[]): boolean => {
    return candidates.length > 0 && candidates.every(c => c.timesheets.every(t => t.uploaded));
};

/**
 * Gets urgency status for a group of timesheets
 * @param timesheets - Array of timesheets
 * @returns Object with urgent and overdue counts
 */
export const getUrgencyStatus = (timesheets: Array<{ downloaded: boolean; uploaded?: boolean; periodEnding: string }>) => {
    let urgentCount = 0;
    let overdueCount = 0;
    
    timesheets.forEach(timesheet => {
        if (timesheet.downloaded && !timesheet.uploaded) {
            const daysUntilEnd = getDaysUntilPeriodEnd(timesheet.periodEnding);
            
            if (daysUntilEnd < 0) {
                overdueCount++;
            } else if (daysUntilEnd <= 2) {
                urgentCount++;
            }
        }
    });
    
    return { urgentCount, overdueCount };
};

/**
 * Determines the appropriate border color class based on timesheet status
 * @param hasUndownloaded - Whether there are undownloaded timesheets
 * @param hasUnuploaded - Whether there are unuploaded timesheets
 * @param urgentCount - Number of urgent timesheets
 * @param overdueCount - Number of overdue timesheets
 * @returns CSS class string for border styling
 */
export const getBorderColorClass = (
    hasUndownloaded: boolean,
    hasUnuploaded: boolean,
    urgentCount: number,
    overdueCount: number
): string => {
    if (overdueCount > 0) return 'border-red-400 bg-red-50';
    if (urgentCount > 0) return 'border-orange-400 bg-orange-50';
    if (hasUnuploaded) return 'border-yellow-300 bg-yellow-50';
    if (hasUndownloaded) return 'border-blue-300 bg-blue-50';
    return 'border-slate-200 bg-white';
};

/**
 * Gets the appropriate status color class for timesheet items
 * @param uploaded - Whether the timesheet is uploaded
 * @param downloaded - Whether the timesheet is downloaded
 * @returns CSS class string for background color
 */
export const getStatusColorClass = (uploaded?: boolean, downloaded?: boolean): string => {
    if (uploaded) return 'bg-green-100';
    if (downloaded) return 'bg-yellow-100';
    return 'bg-red-100';
};