"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MonthlyTimesheetGroupProps } from '@/types';
import { getUrgencyStatus, getBorderColorClass } from '@/utils';
import TimesheetItem from './TimesheetItem';

const MonthlyTimesheetGroup: React.FC<MonthlyTimesheetGroupProps> = ({ 
    monthName, 
    timesheets, 
    candidate, 
    onDownload, 
    onPreview, 
    onUpload, 
    onDelete,
    onDownloadSigned
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasUndownloaded = timesheets.some(t => !t.downloaded);
    const hasUnuploaded = timesheets.some(t => t.downloaded && !t.uploaded);
    
    const { urgentCount, overdueCount } = getUrgencyStatus(timesheets);
    const borderColorClass = getBorderColorClass(hasUndownloaded, hasUnuploaded, urgentCount, overdueCount);
    
    return (
        <div className={`border rounded-lg ${borderColorClass}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center">
                    <h4 className="font-semibold text-slate-700">{monthName}</h4>
                    <span className="ml-2 bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full">
                        {timesheets.length} timesheet{timesheets.length !== 1 ? 's' : ''}
                    </span>
                    {overdueCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {overdueCount} OVERDUE
                        </span>
                    )}
                    {urgentCount > 0 && overdueCount === 0 && (
                        <span className="ml-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {urgentCount} URGENT
                        </span>
                    )}
                    {hasUnuploaded && urgentCount === 0 && overdueCount === 0 && (
                        <span className="ml-2 bg-yellow-200 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Pending Upload
                        </span>
                    )}
                    {hasUndownloaded && !hasUnuploaded && (
                        <span className="ml-2 bg-blue-200 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Pending Download
                        </span>
                    )}
                </div>
                {isOpen ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
            </button>
            {isOpen && (
                <div className="px-3 pb-3">
                    <ul className="space-y-2">
                        {timesheets
                            .sort((a, b) => new Date(a.periodEnding).getTime() - new Date(b.periodEnding).getTime())
                            .map(sheet => (
                            <TimesheetItem 
                                key={sheet.id} 
                                sheet={sheet}
                                candidate={candidate}
                                onDownload={() => onDownload(sheet)}
                                onPreview={() => onPreview(sheet)}
                                onUpload={(file) => onUpload(sheet, file)}
                                onDelete={() => onDelete(sheet)}
                                onDownloadSigned={onDownloadSigned ? () => onDownloadSigned(sheet) : undefined}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MonthlyTimesheetGroup;