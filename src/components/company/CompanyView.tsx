"use client";

import React from 'react';
import { CandidateListProps } from '@/types';
import CompanyListItem from './CompanyListItem';
import CompanyKanbanItem from './CompanyKanbanItem';

interface CompanyViewProps extends CandidateListProps {
  viewMode: 'list' | 'kanban';
}

const CompanyView: React.FC<CompanyViewProps> = ({ viewMode, candidates, ...props }) => {
    const groupedByCompany = candidates.reduce((acc, candidate) => {
        (acc[candidate.company] = acc[candidate.company] || []).push(candidate);
        return acc;
    }, {} as Record<string, typeof candidates>);

    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {Object.entries(groupedByCompany).map(([company, companyCandidates]) => (
                    <CompanyListItem 
                        key={company} 
                        company={company} 
                        candidates={companyCandidates} 
                        {...props} 
                    />
                ))}
            </div>
        );
    }

    if (viewMode === 'kanban') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupedByCompany).map(([company, companyCandidates]) => (
                    <CompanyKanbanItem 
                        key={company} 
                        company={company} 
                        candidates={companyCandidates} 
                        {...props} 
                    />
                ))}
            </div>
        );
    }

    return null;
};

export { CompanyView };
