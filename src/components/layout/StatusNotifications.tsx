"use client";

import React from 'react';
import { PendingActionsSummary } from '@/types';

interface StatusNotificationsProps {
    candidatesCount: number;
    pendingActions: PendingActionsSummary;
    allUploaded: boolean;
}

const StatusNotifications: React.FC<StatusNotificationsProps> = ({ 
    candidatesCount, 
    pendingActions, 
    allUploaded 
}) => {
    const { pendingDownloads, pendingUploads, overduePeriods } = pendingActions;

    if (candidatesCount === 0) return null;

    return (
        <>
            {/* Overdue Alert */}
            {overduePeriods > 0 && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm" role="alert">
                    <p className="font-bold">🚨 Urgent Action Required</p>
                    <p>
                        {overduePeriods} timesheet{overduePeriods !== 1 ? 's' : ''} {overduePeriods === 1 ? 'is' : 'are'} overdue for upload! 
                        Period{overduePeriods !== 1 ? 's' : ''} ended more than 7 days ago.
                    </p>
                </div>
            )}
            
            {/* Upload Pending Alert */}
            {pendingUploads > 0 && overduePeriods === 0 && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-6 shadow-sm" role="alert">
                    <p className="font-bold">📋 Upload Pending</p>
                    <p>
                        {pendingUploads} timesheet{pendingUploads !== 1 ? 's have' : ' has'} been downloaded but not yet uploaded. 
                        Please upload signed timesheets.
                    </p>
                </div>
            )}
            
            {/* Download Ready Alert */}
            {pendingDownloads > 0 && (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg mb-6 shadow-sm" role="alert">
                    <p className="font-bold">⬇️ Download Ready</p>
                    <p>
                        {pendingDownloads} timesheet{pendingDownloads !== 1 ? 's are' : ' is'} ready for download.
                    </p>
                </div>
            )}
            
            {/* All Up to Date Alert */}
            {allUploaded && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-sm" role="alert">
                    <p className="font-bold">✅ All Good!</p>
                    <p>All timesheets are up to date - downloaded and uploaded!</p>
                </div>
            )}
        </>
    );
};

export default StatusNotifications;