"use client";

import React from 'react';
import { AlertTriangle, Calendar, X } from 'lucide-react';

interface TimesheetWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
    targetMonth: string;
    currentDate: Date;
}

const TimesheetWarningModal: React.FC<TimesheetWarningModalProps> = ({
    isOpen,
    onClose,
    onProceed,
    targetMonth,
    currentDate
}) => {
    if (!isOpen) return null;

    const current26th = new Date(currentDate.getFullYear(), currentDate.getMonth(), 26);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const isGeneratingNextMonth = targetMonth === `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;

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
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <AlertTriangle className="text-orange-500 mr-3" size={24} />
                            <h2 className="text-xl font-bold text-slate-900">Early Timesheet Generation</h2>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="mb-6">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start">
                                <Calendar className="text-orange-500 mr-2 mt-0.5" size={16} />
                                <div className="text-sm text-orange-800">
                                    <p className="font-semibold mb-2">Automated Schedule Notice</p>
                                    {isGeneratingNextMonth ? (
                                        <p>
                                            Timesheets for <strong>{targetMonth}</strong> will be automatically 
                                            generated on <strong>{current26th.toLocaleDateString()}</strong> (26th of this month).
                                        </p>
                                    ) : (
                                        <p>
                                            You&rsquo;re generating timesheets outside the standard automation schedule.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-sm text-slate-600 space-y-2">
                            <p><strong>Standard Process:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Timesheets auto-generate on the 26th of each month</li>
                                <li>S1 timesheets due by 15th of the month</li>
                                <li>S2 timesheets due by 1st of next month</li>
                            </ul>
                            
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500">
                                    <strong>Note:</strong> Manual generation will not interfere with automatic 
                                    scheduling. The system will check for existing timesheets before creating duplicates.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-2 px-4 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Wait for Automation
                        </button>
                        <button 
                            onClick={onProceed}
                            className="flex-1 py-2 px-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Generate Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimesheetWarningModal;