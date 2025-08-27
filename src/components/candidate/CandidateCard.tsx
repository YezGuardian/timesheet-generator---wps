"use client";

import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CandidateCardProps } from '@/types';
import { getMonthName, getTimesheetCalendarMonth } from '@/utils';
import { MonthlyTimesheetGroup } from '@/components/timesheet';

const CandidateCard: React.FC<CandidateCardProps> = ({ 
    candidate, 
    onAddTimesheet, 
    onDownload, 
    onPreview, 
    onEditCandidate, 
    onUploadTimesheet, 
    onDeleteCandidate, 
    onDeleteTimesheet,
    onDownloadSigned
}) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    
    // Generate future month options (next 12 months)
    const generateFutureMonths = () => {
        const months = [];
        const currentDate = new Date();
        
        for (let i = 1; i <= 12; i++) {
            const futureDate = new Date(currentDate);
            futureDate.setMonth(currentDate.getMonth() + i);
            
            const value = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;
            const label = futureDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            months.push({ value, label });
        }
        
        return months;
    };
    
    const handleAddTimesheet = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedMonth) {
            // Check for conflicts first
            const monthKey = selectedMonth;
            const existingTimesheets = candidate.timesheets.filter(timesheet => {
                const timesheetDate = new Date(timesheet.periodEnding);
                const timesheetMonthKey = `${timesheetDate.getFullYear()}-${String(timesheetDate.getMonth() + 1).padStart(2, '0')}`;
                return timesheetMonthKey === monthKey;
            });
            
            if (existingTimesheets.length > 0) {
                alert(
                    `Timesheets already exist for this month!\n\n` +
                    `Found ${existingTimesheets.length} existing timesheet${existingTimesheets.length !== 1 ? 's' : ''} ` +
                    `for ${monthKey}.\n\n` +
                    `Please check the existing timesheets before creating new ones.`
                );
                return;
            }
            
            // Generate both S1 and S2 timesheets for the selected month
            onAddTimesheet(candidate.id, selectedMonth, candidate.manager, candidate.employeeId);
            setSelectedMonth('');
        }
    };
    
    const handleDeleteCandidate = () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete this candidate?\n\n` +
            `Name: ${candidate.name}\n` +
            `Email: ${candidate.email}\n` +
            `Employee ID: ${candidate.employeeId}\n` +
            `Manager: ${candidate.manager}\n\n` +
            `This will also delete all ${candidate.timesheets.length} associated timesheets.\n` +
            `This action cannot be undone.`
        );
        
        if (confirmed) {
            onDeleteCandidate(candidate.id);
        }
    };
    
    // Group timesheets by month using pure calendar approach
    const timesheetsByMonth = candidate.timesheets.reduce((acc, timesheet) => {
        // Use the new pure calendar month detection
        const monthKey = getTimesheetCalendarMonth(timesheet);
        const date = new Date(timesheet.dates[0]); // Use first date for month name
        const monthName = getMonthName(date);
        
        if (!acc[monthKey]) {
            acc[monthKey] = {
                name: monthName,
                timesheets: []
            };
        }
        acc[monthKey].timesheets.push(timesheet);
        return acc;
    }, {} as Record<string, { name: string; timesheets: typeof candidate.timesheets }>);
    
    const monthKeys = Object.keys(timesheetsByMonth).sort().reverse(); // Most recent first
    
    return (
        <>
            <div className="bg-slate-50 rounded-lg border border-slate-200">
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{candidate.name}</h3>
                            <p className="text-sm text-slate-500">{candidate.email}</p>
                            <p className="text-xs text-slate-400">ID: {candidate.employeeId} | Manager: {candidate.manager}</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => onEditCandidate(candidate)} 
                                className="text-slate-400 hover:text-blue-500 transition-colors" 
                                title="Edit Candidate"
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={handleDeleteCandidate} 
                                className="text-slate-400 hover:text-red-500 transition-colors" 
                                title="Delete Candidate"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handleAddTimesheet} className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                        <div className="flex-grow">
                            <label htmlFor={`month-${candidate.id}`} className="block text-xs font-medium text-slate-600 mb-1">
                                Select Month for Timesheet Generation
                            </label>
                            <select 
                                id={`month-${candidate.id}`}
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(e.target.value)} 
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                required
                            >
                                <option value="">Select a future month...</option>
                                {generateFutureMonths().map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full sm:w-auto flex items-center justify-center bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-900 transition-colors mt-2 sm:mt-5"
                        >
                            <Plus size={16} className="mr-2" />
                            Generate Monthly Timesheets
                        </button>
                    </form>
                    <div className="mt-4">
                        {candidate.timesheets.length > 0 ? (
                            <div className="space-y-4">
                                {monthKeys.map(monthKey => {
                                    const monthData = timesheetsByMonth[monthKey];
                                    return (
                                        <MonthlyTimesheetGroup
                                            key={monthKey}
                                            monthName={monthData.name}
                                            timesheets={monthData.timesheets}
                                            candidate={candidate}
                                            onDownload={(timesheet) => onDownload(candidate, timesheet)}
                                            onPreview={(timesheet) => onPreview(candidate, timesheet)}
                                            onUpload={(timesheet, file) => onUploadTimesheet(candidate, timesheet, file)}
                                            onDelete={(timesheet) => onDeleteTimesheet(candidate.id, timesheet.id)}
                                            onDownloadSigned={(timesheet) => onDownloadSigned && onDownloadSigned(candidate, timesheet)}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic text-center py-2">No timesheets generated yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CandidateCard;