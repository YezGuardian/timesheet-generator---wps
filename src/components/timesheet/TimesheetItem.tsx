"use client";

import React, { useState, useRef } from 'react';
import { CheckCircle, AlertCircle, Download, Eye, Upload, Trash2 } from 'lucide-react';
import { TimesheetItemProps } from '@/types';
import { getStatusColorClass, getTimesheetPeriod } from '@/utils';

const TimesheetItem: React.FC<TimesheetItemProps> = ({ 
    sheet, 
    onDownload, 
    onPreview, 
    onUpload, 
    onDelete,
    onDownloadSigned
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please select a PDF file.');
                return;
            }
            setIsUploading(true);
            try {
                await onUpload(file);
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const handleDelete = () => {
        const periodType = getTimesheetPeriod(sheet);
        const confirmed = window.confirm(
            `Are you sure you want to delete this timesheet?\n\n` +
            `${periodType} Period Ending: ${new Date(sheet.periodEnding).toLocaleDateString('en-CA', { timeZone: 'UTC' })}\n` +
            `${sheet.managerName ? `Manager: ${sheet.managerName}\n` : ''}` +
            `${sheet.employeeId ? `Employee ID: ${sheet.employeeId}\n` : ''}\n` +
            `This action cannot be undone.`
        );
        
        if (confirmed) {
            onDelete();
        }
    };

    const getStatusIcon = () => {
        if (sheet.uploaded) return <CheckCircle size={18} className="text-green-600 mr-2" />;
        if (sheet.downloaded) return <AlertCircle size={18} className="text-yellow-600 mr-2" />;
        return <AlertCircle size={18} className="text-red-600 mr-2" />;
    };

    const periodType = getTimesheetPeriod(sheet);

    return (
        <li className={`flex items-center justify-between p-2 rounded-lg ${getStatusColorClass(sheet.uploaded, sheet.downloaded)}`}>
            <div className="flex items-center">
                {getStatusIcon()}
                <div>
                    <span className="font-medium text-slate-700 text-sm">
                        {periodType} Period Ending: {new Date(sheet.periodEnding).toLocaleDateString('en-CA', { timeZone: 'UTC' })}
                    </span>
                    <div className="text-xs text-slate-500">
                        {sheet.managerName && `Manager: ${sheet.managerName}`}
                        {sheet.employeeId && ` | Employee ID: ${sheet.employeeId}`}
                        {sheet.uploaded && sheet.uploadedAt && (
                            <div className="text-green-600 font-medium">
                                ✓ Uploaded: {new Date(sheet.uploadedAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={onPreview} 
                    className="flex items-center text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors" 
                    title="Preview Timesheet"
                >
                    <Eye size={16} className="mr-1" />
                </button>
                <button 
                    onClick={onDownload} 
                    className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors" 
                    title="Download PDF"
                >
                    <Download size={16} className="mr-1" />
                </button>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                
                {!sheet.uploaded && (
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center text-sm font-semibold text-green-600 hover:text-green-800 transition-colors disabled:opacity-50" 
                        title="Upload Signed Timesheet"
                    >
                        <Upload size={16} className="mr-1" />
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                )}
                
                {sheet.uploaded && onDownloadSigned && (
                    <button 
                        onClick={onDownloadSigned}
                        className="flex items-center text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors" 
                        title="Download Signed Timesheet"
                    >
                        <Download size={16} className="mr-1" />
                        View
                    </button>
                )}
                
                <button 
                    onClick={handleDelete} 
                    className="text-slate-400 hover:text-red-500 transition-colors" 
                    title="Delete Timesheet"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    );
};

export default TimesheetItem;