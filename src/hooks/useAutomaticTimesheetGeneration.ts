"use client";

import { useEffect, useState, useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Candidate } from '@/types';
import { generateMonthlyTimesheets, isTimesheetOverdueByDueDate, isTimesheetUrgentByDueDate } from '@/utils';

export const useAutomaticTimesheetGeneration = (candidates: Candidate[]) => {
    const [lastProcessedMonth, setLastProcessedMonth] = useState<string>('');

    const generateTimesheetsForAllCandidates = useCallback(async (year: number, month: number): Promise<void> => {
        console.log(`Starting timesheet generation for ${year}-${String(month + 1).padStart(2, '0')}...`);
        
        for (const candidate of candidates) {
            // Check if candidate already has timesheets for this month
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            const existingTimesheets = candidate.timesheets.filter(timesheet => {
                const timesheetDate = new Date(timesheet.periodEnding);
                const timesheetMonthKey = `${timesheetDate.getFullYear()}-${String(timesheetDate.getMonth() + 1).padStart(2, '0')}`;
                return timesheetMonthKey === monthKey;
            });
            
            if (existingTimesheets.length > 0) {
                console.log(`Skipping ${candidate.name} - already has ${existingTimesheets.length} timesheet(s) for ${monthKey}`);
                continue;
            }
            
            console.log(`Generating timesheets for ${candidate.name} (${monthKey})`);
            const { firstHalf, secondHalf } = generateMonthlyTimesheets(year, month);
            
            // Set manager name and employee ID from candidate profile
            firstHalf.managerName = candidate.manager;
            firstHalf.employeeId = candidate.employeeId;
            secondHalf.managerName = candidate.manager;
            secondHalf.employeeId = candidate.employeeId;
            
            const candidateRef = doc(db, 'candidates', candidate.id);
            const updatedTimesheets = [...candidate.timesheets, firstHalf, secondHalf];
            await updateDoc(candidateRef, { timesheets: updatedTimesheets });
            
            console.log(`✅ Generated S1 and S2 timesheets for ${candidate.name}`);
        }
        
        console.log(`Completed timesheet generation for ${year}-${String(month + 1).padStart(2, '0')}`);
    }, [candidates]);

    // Enhanced automatic monthly timesheet generation and period monitoring
    useEffect(() => {
        if (candidates.length === 0) return;
        
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        
        // Generate timesheets on the 26th of each month for the NEXT month
        if (currentDay === 26) {
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(currentDate.getMonth() + 1);
            
            const nextMonthKey = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
            
            if (lastProcessedMonth !== nextMonthKey) {
                console.log(`Generating timesheets for ${nextMonthKey} on the 26th`);
                generateTimesheetsForAllCandidates(nextMonth.getFullYear(), nextMonth.getMonth());
                setLastProcessedMonth(nextMonthKey);
            }
        }
        
        // Also check if we missed the 26th (for testing or if app wasn't running)
        // This should generate timesheets for the NEXT month, not the current month
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        const nextMonthKey = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
        if (lastProcessedMonth !== nextMonthKey && currentDay > 26) {
            console.log(`Checking if timesheets needed for next month: ${nextMonthKey}`);
            generateTimesheetsForAllCandidates(nextMonth.getFullYear(), nextMonth.getMonth());
            setLastProcessedMonth(nextMonthKey);
        }
        
        // Check for period endings and show alerts based on due dates
        const checkPeriodEndingsAndAlert = () => {
            let periodsOverdue = 0;
            let periodsUrgent = 0;
            
            candidates.forEach(candidate => {
                candidate.timesheets.forEach(timesheet => {
                    if (!timesheet.uploaded) {
                        if (isTimesheetOverdueByDueDate(timesheet.periodEnding)) {
                            periodsOverdue++;
                        } else if (isTimesheetUrgentByDueDate(timesheet.periodEnding)) {
                            periodsUrgent++;
                        }
                    }
                });
            });
            
            if (periodsOverdue > 0) {
                setTimeout(() => {
                    alert(
                        `🚨 OVERDUE TIMESHEETS!\n\n` +
                        `${periodsOverdue} timesheet${periodsOverdue !== 1 ? 's are' : ' is'} overdue.\n\n` +
                        `Action required:\n` +
                        `• S1 timesheets: Due by 15th of the month\n` +
                        `• S2 timesheets: Due by 1st of next month\n` +
                        `• Get signatures and upload immediately\n\n` +
                        `Upload your signed timesheets now!`
                    );
                }, 2000);
            } else if (periodsUrgent > 0) {
                setTimeout(() => {
                    alert(
                        `⏰ URGENT: Timesheets Due Soon\n\n` +
                        `${periodsUrgent} timesheet${periodsUrgent !== 1 ? 's are' : ' is'} due within 2 days.\n\n` +
                        `Due dates:\n` +
                        `• S1 timesheets: Due by 15th of the month\n` +
                        `• S2 timesheets: Due by 1st of next month\n\n` +
                        `Please prepare to:\n` +
                        `• Get your timesheet signed\n` +
                        `• Upload the signed timesheet`
                    );
                }, 1500);
            }
        };
        
        // Run the check after a short delay to allow UI to load
        const alertTimer = setTimeout(checkPeriodEndingsAndAlert, 3000);
        
        return () => clearTimeout(alertTimer);
    }, [candidates, lastProcessedMonth, generateTimesheetsForAllCandidates]);

    return {
        generateTimesheetsForAllCandidates
    };
};
