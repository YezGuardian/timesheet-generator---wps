"use client";

import React from 'react';
import { CandidateListProps, Candidate } from '@/types';
import CompanyGroup from './CompanyGroup';

const CandidateList: React.FC<CandidateListProps> = ({ candidates, ...props }) => {
    const groupedByCompany = candidates.reduce((acc, candidate) => {
        (acc[candidate.company] = acc[candidate.company] || []).push(candidate);
        return acc;
    }, {} as Record<string, Candidate[]>);

    return (
        <div className="space-y-8">
            {candidates.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-slate-700">No Candidates Found</h2>
                    <p className="text-slate-500 mt-2">
                        Click &ldquo;Add Candidate&rdquo; to create a profile and start generating timesheets.
                    </p>
                </div>
            ) : (
                Object.entries(groupedByCompany).map(([company, companyCandidates]) => (
                    <CompanyGroup 
                        key={company} 
                        company={company} 
                        candidates={companyCandidates} 
                        allCandidates={candidates} 
                        {...props} 
                    />
                ))
            )}
        </div>
    );
};

export default CandidateList;