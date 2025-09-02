"use client";

import React from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { TimesheetPreviewModalProps } from '@/types';

const TimesheetPreviewModal: React.FC<TimesheetPreviewModalProps> = ({ 
    candidate, 
    timesheet, 
    onClose, 
    onDownload 
}) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Generate smart header with pure calendar month approach (matches PDF generator)
    const getSmartHeader = (timesheetData: typeof timesheet): string => {
        // Get month from first date (always accurate with pure calendar approach)
        const firstDate = new Date(timesheetData.dates[0]);
        const monthName = firstDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        
        // Determine S1 or S2 from period ending (matches PDF logic exactly)
        const periodEnd = new Date(timesheetData.periodEnding);
        const sheetNumber = periodEnd.getDate() === 15 ? 'S1' : 'S2';
        
        return `WEEKLY TIME SHEET - ${monthName} ${sheetNumber}`;
    };
    
    // Handle click outside to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Timesheet Preview</h2>
                        <button 
                            onClick={onClose} 
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Close Preview"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* Preview Content - Mirroring PDF Layout */}
                    <div className="bg-white border border-slate-200 p-8 rounded-lg">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 mb-2">{getSmartHeader(timesheet)}</h1>
                                <p className="text-base text-slate-700">{candidate.company}</p>
                            </div>
                            <div className="flex items-center" style={{marginLeft: 'auto', paddingRight: '60px'}}>
                                <Image 
                                    src="/Logo.png" 
                                    alt="Company Logo" 
                                    width={60}
                                    height={15}
                                    className="object-contain"
                                />
                                <div className="text-blue-600 font-bold text-sm hidden">WPS</div>
                            </div>
                        </div>
                        
                        {/* Employee Information - Professional Layout */}
                        <div className="grid grid-cols-3 gap-6 mb-6 text-xs">
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-slate-700">Employee:</span>
                                    <div className="border-b border-slate-300 pb-1 mt-1 text-slate-900">{candidate.name}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700">Manager:</span>
                                    <div className="border-b border-slate-300 pb-1 mt-1 text-slate-900">{candidate.manager || ''}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-slate-700">Contact:</span>
                                    <div className="border-b border-slate-300 pb-1 mt-1 text-slate-900">{candidate.contactNumber || ''}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700">Email:</span>
                                    <div className="border-b border-slate-300 pb-1 mt-1 text-slate-900">{candidate.email}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-slate-700">Employee ID:</span>
                                    <div className="border-b border-slate-300 pb-1 mt-1 text-slate-900">{candidate.employeeId || ''}</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Timesheet Table - Compact Professional Style */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-slate-400 text-xs">
                                <thead>
                                    <tr className="bg-blue-600 text-white" style={{backgroundColor: 'rgb(54, 96, 146)'}}>
                                        <th className="border border-slate-400 p-1.5 text-left font-bold">Day</th>
                                        <th className="border border-slate-400 p-1.5 text-left font-bold">Date</th>
                                        <th className="border border-slate-400 p-1.5 text-left font-bold">Working Hours</th>
                                        <th className="border border-slate-400 p-1.5 text-left font-bold">Candidate Signature</th>
                                        <th className="border border-slate-400 p-1.5 text-left font-bold">Supervisor Signature</th>
                                        <th className="border border-slate-400 p-1.5 text-left font-bold">Leave Applied</th>
                                        <th className="border border-slate-400 p-1.5 text-left font-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timesheet.dates.map((date, index) => {
                                        const dateObj = new Date(date);
                                        const dayOfWeek = dateObj.getDay(); // 0=Sunday, 1=Monday, etc.
                                        const dayLabel = daysOfWeek[dayOfWeek];
                                        return (
                                            <tr key={index} className="hover:bg-slate-50">
                                                <td className="border border-slate-400 p-1.5">{dayLabel}</td>
                                                <td className="border border-slate-400 p-1.5">
                                                    {new Date(date).toLocaleDateString('en-CA', { timeZone: 'UTC' })}
                                                </td>
                                                <td className="border border-slate-400 p-1.5">{candidate.workingHours || '08:00 - 16:00'}</td>
                                                <td className="border border-slate-400 p-1.5 h-6"></td>
                                                <td className="border border-slate-400 p-1.5 h-6"></td>
                                                <td className="border border-slate-400 p-1.5 h-6"></td>
                                                <td className="border border-slate-400 p-1.5 h-6"></td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="font-bold" style={{backgroundColor: 'white'}}>
                                        <td className="border border-slate-400 p-1.5 font-bold text-white" style={{backgroundColor: 'rgb(54, 96, 146)'}}>
                                            Days Absent :
                                        </td>
                                        <td className="border border-slate-400 p-1.5 text-slate-900" colSpan={6}>
                                            {/* Empty white cells */}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Signature Section - Compact */}
                        <div className="grid grid-cols-2 gap-8 mt-6">
                            <div>
                                <p className="font-semibold mb-3 text-xs text-slate-700">EMPLOYEE SIGNATURE</p>
                                <div className="border-b border-slate-400 mb-3 h-6"></div>
                                <p className="font-semibold mb-2 text-xs text-slate-700">DATE</p>
                                <div className="border-b border-slate-400 h-4"></div>
                            </div>
                            <div>
                                <p className="font-semibold mb-3 text-xs text-slate-700">MANAGER SIGNATURE</p>
                                <div className="border-b border-slate-400 mb-3 h-6"></div>
                                <p className="font-semibold mb-2 text-xs text-slate-700">DATE</p>
                                <div className="border-b border-slate-400 h-4"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Modal Actions */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button 
                            onClick={onClose} 
                            className="py-2 px-4 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Close Preview
                        </button>
                        <button 
                            onClick={onDownload} 
                            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <Download size={16} className="mr-2" />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimesheetPreviewModal;