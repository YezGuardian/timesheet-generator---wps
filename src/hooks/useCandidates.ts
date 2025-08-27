"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Candidate, CandidateFormData, Timesheet } from '@/types';
import { generateMonthlyTimesheets } from '@/utils';

export const useCandidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
                const candidatesData = snapshot.docs.map(doc => ({ 
                    ...doc.data(), 
                    id: doc.id 
                })) as Candidate[];
                setCandidates(candidatesData);
                setIsLoading(false);
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase connection error.", error);
            setIsLoading(false);
        }
    }, []);

    const addCandidate = async (candidate: CandidateFormData): Promise<void> => {
        try {
            // Create the new candidate with empty timesheets initially
            const newCandidateData: CandidateFormData & { timesheets: Timesheet[] } = { ...candidate, timesheets: [] };
            
            // Check if we should auto-generate timesheets for next month
            const currentDate = new Date();
            const currentDay = currentDate.getDate();
            
            // If it's after the 26th, auto-generate timesheets for next month
            if (currentDay >= 26) {
                const nextMonth = new Date(currentDate);
                nextMonth.setMonth(currentDate.getMonth() + 1);
                
                console.log(`Auto-generating timesheets for new candidate: ${candidate.name}`);
                const { firstHalf, secondHalf } = generateMonthlyTimesheets(nextMonth.getFullYear(), nextMonth.getMonth());
                
                // Set manager name and employee ID from candidate profile
                firstHalf.managerName = candidate.manager;
                firstHalf.employeeId = candidate.employeeId;
                secondHalf.managerName = candidate.manager;
                secondHalf.employeeId = candidate.employeeId;
                
                // Add the timesheets to the new candidate
                newCandidateData.timesheets = [firstHalf, secondHalf];
                
                const nextMonthName = nextMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                console.log(`✅ Auto-generated S1 and S2 timesheets for ${candidate.name} (${nextMonthName})`);
            }
            
            await addDoc(collection(db, 'candidates'), newCandidateData);
        } catch (error) {
            console.error('Error adding candidate:', error);
            throw error;
        }
    };

    const editCandidate = async (candidateId: string, updatedData: CandidateFormData): Promise<void> => {
        try {
            const candidateRef = doc(db, 'candidates', candidateId);
            await updateDoc(candidateRef, { ...updatedData });
        } catch (error) {
            console.error('Error editing candidate:', error);
            throw error;
        }
    };

    const deleteCandidate = async (candidateId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, 'candidates', candidateId));
        } catch (error) {
            console.error('Error deleting candidate:', error);
            throw error;
        }
    };

    return {
        candidates,
        isLoading,
        addCandidate,
        editCandidate,
        deleteCandidate
    };
};