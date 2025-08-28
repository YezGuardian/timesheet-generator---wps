"use client";

import React, { useState, useRef } from 'react';
import { CheckCircle, AlertCircle, Download, Eye, Upload, Trash2, Replace, History } from 'lucide-react';
import { TimesheetItemProps, UploadLog } from '@/types';
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
    const [showLog, setShowLog] = useState(false);
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
        <>
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

                    {sheet.uploaded && (
                        <>
                            {onDownloadSigned && (
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
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors disabled:opacity-50"
                                title="Update Signed Timesheet"
                            >
                                <Replace size={16} className="mr-1" />
                                {isUploading ? 'Updating...' : 'Update'}
                            </button>
                        </>
                    )}

                    {sheet.uploadHistory && sheet.uploadHistory.length > 0 && (
                        <button
                            onClick={() => setShowLog(true)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            title="View Upload History"
                        >
                            <History size={16} />
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

            {showLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Upload History</h3>
                        <ul className="space-y-2 text-sm">
                            {sheet.uploadHistory?.map((log: UploadLog, index: number) => (
                                <li key={index} className="p-2 bg-slate-50 rounded-md">
                                    <p className="font-semibold">{log.fileName}</p>
                                    <p className="text-slate-500">{new Date(log.uploadedAt).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowLog(false)}
                            className="mt-4 py-2 px-4 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TimesheetItem;
