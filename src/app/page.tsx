"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, Timesheet } from '@/types';
import { getPendingActionsSummary, areAllTimesheetsUploaded } from '@/utils';
import { useCandidates, useTimesheets, useAutomaticTimesheetGeneration } from '@/hooks';
import { Header, StatusNotifications } from '@/components/layout';
import { CompanyView } from '@/components/company';
import { AddCandidateModal, EditCandidateModal, TimesheetPreviewModal, SearchBar } from '@/components/ui';

export default function App() {
    const { candidates, isLoading, addCandidate, editCandidate, deleteCandidate } = useCandidates();
    const { addTimesheet, handleDownload, handleUploadTimesheet, handleDownloadSignedTimesheet, deleteTimesheet } = useTimesheets();
    useAutomaticTimesheetGeneration(candidates);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewTimesheet, setPreviewTimesheet] = useState<{candidate: Candidate, timesheet: Timesheet} | null>(null);
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true after mounting to handle hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Event handlers
    const handlePreview = (candidate: Candidate, timesheet: Timesheet) => {
        setPreviewTimesheet({ candidate, timesheet });
    };

    const handleEditCandidate = (candidate: Candidate) => {
        setEditingCandidate(candidate);
    };

    const handleAddTimesheet = (candidateId: string, selectedMonth: string, managerName: string, employeeId: string) => {
        addTimesheet(candidateId, candidates, selectedMonth, managerName, employeeId);
    };

    const handleTimesheetDownload = (candidate: Candidate, timesheet: Timesheet) => {
        handleDownload(candidate, timesheet);
    };

    const handleDownloadSigned = (candidate: Candidate, timesheet: Timesheet) => {
        handleDownloadSignedTimesheet(candidate, timesheet);
    };

    const handleTimesheetDelete = (candidateId: string, timesheetId: number) => {
        deleteTimesheet(candidateId, timesheetId, candidates);
    };

    const handleCandidateEdit = (updatedData: { name: string; company: string; email: string; contactNumber: string; manager: string; employeeId: string; }) => {
        if (editingCandidate) {
            editCandidate(editingCandidate.id, updatedData);
            setEditingCandidate(null);
        }
    };

    // Calculate status for notifications
    const pendingActions = getPendingActionsSummary(candidates);
    const allUploaded = areAllTimesheetsUploaded(candidates);

    const filteredCandidates = useMemo(() => {
        let filtered = candidates;

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(candidate =>
                candidate.name.toLowerCase().includes(searchLower) ||
                candidate.email.toLowerCase().includes(searchLower) ||
                candidate.company.toLowerCase().includes(searchLower)
            );
        }

        if (statusFilter) {
            filtered = filtered.map(candidate => {
                const filteredTimesheets = candidate.timesheets.filter(timesheet => {
                    if (statusFilter === 'uploaded') return timesheet.uploaded;
                    if (statusFilter === 'downloaded') return timesheet.downloaded && !timesheet.uploaded;
                    if (statusFilter === 'pending') return !timesheet.downloaded;
                    return true;
                });
                return { ...candidate, timesheets: filteredTimesheets };
            }).filter(candidate => candidate.timesheets.length > 0);
        }

        if (monthFilter) {
            filtered = filtered.map(candidate => {
                const filteredTimesheets = candidate.timesheets.filter(timesheet => {
                    return timesheet.periodEnding.substring(0, 7) === monthFilter;
                });
                return { ...candidate, timesheets: filteredTimesheets };
            }).filter(candidate => candidate.timesheets.length > 0);
        }

        return filtered;
    }, [candidates, searchQuery, statusFilter, monthFilter]);


    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-700">Loading data from Firestore...</div>
    }

    // Render nothing on server, only on client after hydration
    if (!isClient) {
        return null;
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
            <div className="container mx-auto p-4 md:p-8">
                <Header onAddCandidate={() => setIsModalOpen(true)} />
                
                <StatusNotifications 
                    candidatesCount={candidates.length}
                    pendingActions={pendingActions}
                    allUploaded={allUploaded}
                />

                <div className="flex justify-between items-center mb-4">
                    <SearchBar 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        monthFilter={monthFilter}
                        setMonthFilter={setMonthFilter}
                        candidates={candidates}
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>List</button>
                        <button onClick={() => setViewMode('kanban')} className={`px-4 py-2 rounded-lg ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>Kanban</button>
                    </div>
                </div>
                
                <CompanyView
                    viewMode={viewMode}
                    candidates={filteredCandidates}
                    onAddTimesheet={handleAddTimesheet}
                    onDownload={handleTimesheetDownload}
                    onPreview={handlePreview}
                    onEditCandidate={handleEditCandidate}
                    onUploadTimesheet={handleUploadTimesheet}
                    onDeleteCandidate={deleteCandidate}
                    onDeleteTimesheet={handleTimesheetDelete}
                    onDownloadSigned={handleDownloadSigned}
                />
                
                {isModalOpen && (
                    <AddCandidateModal 
                        onClose={() => setIsModalOpen(false)} 
                        onAddCandidate={addCandidate} 
                        candidates={candidates}
                    />
                )}
                
                {editingCandidate && (
                    <EditCandidateModal 
                        candidate={editingCandidate}
                        onClose={() => setEditingCandidate(null)}
                        onEditCandidate={handleCandidateEdit}
                    />
                )}
                
                {previewTimesheet && (
                    <TimesheetPreviewModal 
                        candidate={previewTimesheet.candidate} 
                        timesheet={previewTimesheet.timesheet} 
                        onClose={() => setPreviewTimesheet(null)}
                        onDownload={() => {
                            handleTimesheetDownload(previewTimesheet.candidate, previewTimesheet.timesheet);
                            setPreviewTimesheet(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}