import { Timesheet, MonthlyTimesheetGeneration, Candidate } from '@/types';

// --- Date Utilities for Timesheet Management ---

/**
 * Pure Calendar Month Approach - Professional and Consistent
 * Each month owns its exact calendar dates (1st to last day)
 * S1: Days 1-15, S2: Days 16-end of month
 * Timesheets may start/end mid-week - this is professional and consistent
 * @param year - The year
 * @param month - The month (0-based, January = 0)
 * @returns Object containing first and second half timesheets
 */
export const generateMonthlyTimesheets = (year: number, month: number): MonthlyTimesheetGeneration => {
    // S1 Period: 1st to 15th of the month
    const s1StartDate = new Date(year, month, 1);
    const s1EndDate = new Date(year, month, 15);
    
    // S2 Period: 16th to last day of month
    const s2StartDate = new Date(year, month, 16);
    const s2EndDate = new Date(year, month + 1, 0); // Last day of current month
    
    // Generate weekdays only for S1 (1st-15th)
    const s1Dates = generateWeekdaysInRange(s1StartDate, s1EndDate);
    
    // Generate weekdays only for S2 (16th-end)
    const s2Dates = generateWeekdaysInRange(s2StartDate, s2EndDate);
    
    const firstHalf: Timesheet = {
        id: Date.now(),
        periodEnding: `${s1EndDate.getFullYear()}-${String(s1EndDate.getMonth() + 1).padStart(2, '0')}-${String(s1EndDate.getDate()).padStart(2, '0')}`,
        dates: s1Dates.map(d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`),
        downloaded: false,
        managerName: '',
        employeeId: '',
    };
    
    const secondHalf: Timesheet = {
        id: Date.now() + 1,
        periodEnding: `${s2EndDate.getFullYear()}-${String(s2EndDate.getMonth() + 1).padStart(2, '0')}-${String(s2EndDate.getDate()).padStart(2, '0')}`,
        dates: s2Dates.map(d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`),
        downloaded: false,
        managerName: '',
        employeeId: '',
    };
    
    return { firstHalf, secondHalf };
};

/**
 * Generate weekdays only (Monday-Friday) within a specific calendar date range
 * Pure calendar approach - uses exact calendar dates but only includes working days
 * @param startDate - Start date of the range
 * @param endDate - End date of the range
 * @returns Array of weekday dates in the range
 */
const generateWeekdaysInRange = (startDate: Date, endDate: Date): Date[] => {
    const weekdays: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // Include Monday-Friday (1-5) only
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            weekdays.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return weekdays;
};

/**
 * Calculates the number of days between current date and period ending
 * @param periodEnding - The period ending date as string
 * @returns Number of days (negative if past due)
 */
export const getDaysUntilPeriodEnd = (periodEnding: string): number => {
    const periodEnd = new Date(periodEnding);
    const today = new Date();
    const timeDiff = periodEnd.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

/**
 * Checks if a timesheet period is overdue (ended more than 7 days ago)
 * @param periodEnding - The period ending date as string
 * @returns True if overdue
 */
export const isTimesheetOverdue = (periodEnding: string): boolean => {
    const daysSincePeriodEnd = -getDaysUntilPeriodEnd(periodEnding);
    return daysSincePeriodEnd > 7;
};

/**
 * Checks if a timesheet period is urgent (ending within 2 days)
 * @param periodEnding - The period ending date as string
 * @returns True if urgent
 */
export const isTimesheetUrgent = (periodEnding: string): boolean => {
    const daysUntilEnd = getDaysUntilPeriodEnd(periodEnding);
    return daysUntilEnd > 0 && daysUntilEnd <= 2;
};

/**
 * Gets the month key for grouping timesheets (YYYY-MM format)
 * @param date - Date object or date string
 * @returns Month key as string
 */
export const getMonthKey = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Gets the month name for display purposes
 * @param date - Date object or date string
 * @returns Month name as string (e.g., "January 2025")
 */
export const getMonthName = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

/**
 * Calculates the due date for a timesheet based on S1/S2 logic
 * S1 (first half): Due when week 2 begins (around day 15)
 * S2 (second half): Due when new month begins (day 1 of next month)
 * @param periodEnding - The period ending date as string
 * @returns Due date as string
 */
export const calculateDueDate = (periodEnding: string): string => {
    const periodEndDate = new Date(periodEnding);
    const year = periodEndDate.getFullYear();
    const month = periodEndDate.getMonth();
    const day = periodEndDate.getDate();
    
    // Determine if this is S1 or S2 based on the period ending date
    if (day <= 15) {
        // S1: Due when week 2 begins (around 15th of same month)
        const dueDate = new Date(year, month, 15);
        return dueDate.toISOString().split('T')[0];
    } else {
        // S2: Due when new month begins (1st of next month)
        const dueDate = new Date(year, month + 1, 1);
        return dueDate.toISOString().split('T')[0];
    }
};

/**
 * Checks if a timesheet is overdue based on its due date
 * @param periodEnding - The period ending date as string
 * @returns True if overdue
 */
export const isTimesheetOverdueByDueDate = (periodEnding: string): boolean => {
    const dueDate = new Date(calculateDueDate(periodEnding));
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    dueDate.setHours(0, 0, 0, 0);
    
    return today > dueDate;
};

/**
 * Checks if a timesheet is urgent (due within 2 days)
 * @param periodEnding - The period ending date as string
 * @returns True if urgent
 */
export const isTimesheetUrgentByDueDate = (periodEnding: string): boolean => {
    const dueDate = new Date(calculateDueDate(periodEnding));
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return daysDiff > 0 && daysDiff <= 2;
};

/**
 * Checks if user is trying to generate timesheets early (before 26th automation)
 * @param selectedDate - The selected start date for timesheet
 * @returns Object with warning info
 */
export const checkEarlyGeneration = (selectedDate: string): {
    shouldWarn: boolean;
    targetMonth: string;
    isNextMonth: boolean;
    automationDate: string;
} => {
    const selected = new Date(selectedDate);
    const today = new Date();
    
    // Determine which month the timesheet is for
    const timesheetMonth = selected.getMonth();
    const timesheetYear = selected.getFullYear();
    const targetMonth = `${timesheetYear}-${String(timesheetMonth + 1).padStart(2, '0')}`;
    
    // Check if it's for next month
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const isNextMonth = (timesheetYear === currentYear && timesheetMonth === currentMonth + 1) ||
                       (timesheetYear === currentYear + 1 && currentMonth === 11 && timesheetMonth === 0);
    
    // Automation date (26th of current month for next month's timesheets)
    const automationDate = new Date(currentYear, currentMonth, 26);
    
    // Should warn if:
    // 1. Generating for next month AND it's before the 26th
    // 2. Or generating for current month after automation would have run
    const shouldWarn = isNextMonth && today < automationDate;
    
    return {
        shouldWarn,
        targetMonth,
        isNextMonth,
        automationDate: automationDate.toISOString().split('T')[0]
    };
};

/**
 * Enhanced check for existing timesheets with detailed conflict info
 * @param candidates - Array of candidates
 * @param candidateId - Target candidate ID
 * @param selectedDate - Selected start date
 * @returns Conflict information
 */
export const checkTimesheetConflicts = (candidates: Candidate[], candidateId: string, selectedDate: string): {
    hasConflicts: boolean;
    conflictingTimesheets: Timesheet[];
    monthKey: string;
} => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) {
        return { hasConflicts: false, conflictingTimesheets: [], monthKey: '' };
    }
    
    const selected = new Date(selectedDate);
    const monthKey = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}`;
    
    const conflictingTimesheets = candidate.timesheets.filter((timesheet: Timesheet) => {
        const timesheetDate = new Date(timesheet.periodEnding);
        const timesheetMonthKey = `${timesheetDate.getFullYear()}-${String(timesheetDate.getMonth() + 1).padStart(2, '0')}`;
        return timesheetMonthKey === monthKey;
    });
    
    return {
        hasConflicts: conflictingTimesheets.length > 0,
        conflictingTimesheets,
        monthKey
    };
};

/**
 * Gets the timesheet's calendar month (always accurate with pure calendar approach)
 * @param timesheet - Timesheet object
 * @returns Month key as string (YYYY-MM format)
 */
export const getTimesheetCalendarMonth = (timesheet: Timesheet): string => {
    // Since we use pure calendar approach, we can determine month from any date
    const firstDate = new Date(timesheet.dates[0]);
    return `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Determines if timesheet is S1 or S2 based on its period ending date
 * @param timesheet - Timesheet object
 * @returns 'S1' or 'S2'
 */
export const getTimesheetPeriod = (timesheet: Timesheet): 'S1' | 'S2' => {
    const periodEnd = new Date(timesheet.periodEnding);
    const dayOfMonth = periodEnd.getDate();
    
    // S1 ends on 15th, S2 ends on last day of month
    return dayOfMonth === 15 ? 'S1' : 'S2';
};