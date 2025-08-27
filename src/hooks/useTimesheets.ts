"use client";

import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { Candidate, Timesheet } from '@/types';
import { generateMonthlyTimesheets, generatePDF } from '@/utils';

export const useTimesheets = () => {
    const addTimesheet = async (
        candidateId: string, 
        candidates: Candidate[],
        selectedMonth: string, 
        managerName: string, 
        employeeId: string
    ): Promise<void> => {
        try {
            console.log('Adding timesheet for:', { candidateId, selectedMonth, managerName, employeeId });
            
            // Parse the selected month (format: "YYYY-MM")
            const [year, month] = selectedMonth.split('-').map(Number);
            
            // Generate both S1 and S2 for the month using pure calendar approach
            const { firstHalf, secondHalf } = generateMonthlyTimesheets(year, month - 1); // month - 1 because Date months are 0-based
            
            // Update with manager and employee info
            firstHalf.managerName = managerName;
            firstHalf.employeeId = employeeId;
            secondHalf.managerName = managerName;
            secondHalf.employeeId = employeeId;
            
            console.log('Generated S1 timesheet:', firstHalf);
            console.log('Generated S2 timesheet:', secondHalf);
            
            const candidateRef = doc(db, 'candidates', candidateId);
            const currentCandidate = candidates.find(c => c.id === candidateId);
            
            if (currentCandidate) {
                // Add both S1 and S2 timesheets for the month
                const updatedTimesheets = [...currentCandidate.timesheets, firstHalf, secondHalf];
                await updateDoc(candidateRef, { timesheets: updatedTimesheets });
                
                const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                console.log(`✅ S1 and S2 timesheets added successfully for ${monthName}!`);
                alert(`Monthly timesheets generated successfully for ${monthName}!\n\nGenerated:\n• S1: Days 1-15 (${firstHalf.dates.length} working days)\n• S2: Days 16-end (${secondHalf.dates.length} working days)\n\nYou can now preview and download both timesheets.`);
            } else {
                console.error('Candidate not found:', candidateId);
                alert('Error: Candidate not found. Please try again.');
            }
        } catch (error) {
            console.error('Error adding timesheet:', error);
            alert('Failed to generate timesheet. Please check your connection and try again.');
        }
    };

    const handleDownload = async (
        candidate: Candidate, 
        timesheet: Timesheet
    ): Promise<void> => {
        try {
            await generatePDF(candidate, timesheet);
            const candidateRef = doc(db, 'candidates', candidate.id);
            const updatedTimesheets = candidate.timesheets.map(t => 
                t.id === timesheet.id ? { ...t, downloaded: true } : t
            );
            await updateDoc(candidateRef, { timesheets: updatedTimesheets });
            
            // Show success message and remind user to upload signed timesheet
            setTimeout(() => {
                alert(
                    `Timesheet downloaded successfully!\n\n` +
                    `Next steps:\n` +
                    `1. Print and fill out the timesheet\n` +
                    `2. Get it signed by your manager\n` +
                    `3. Upload the signed timesheet back to the system\n\n` +
                    `Remember: Upload is required to keep your timesheets up to date.`
                );
            }, 500);
        } catch (error) {
            console.error('Error downloading timesheet:', error);
            alert('Failed to download timesheet. Please try again.');
        }
    };

    const handleUploadTimesheet = async (
        candidate: Candidate, 
        timesheet: Timesheet, 
        file: File
    ): Promise<void> => {
        try {
            // Validate file type
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file.');
                return;
            }
            
            const fileName = `${candidate.name.replace(/\s+/g, '_')}_${timesheet.periodEnding}_${file.name}`;
            // Use company-based folder structure
            const storageRef = ref(storage, `companies/${encodeURIComponent(candidate.company)}/${candidate.id}/${fileName}`);
            
            console.log('Uploading file:', { fileName, size: file.size, type: file.type });
            
            // Upload the file
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            
            console.log('File uploaded successfully. Download URL:', downloadURL);
            
            const candidateRef = doc(db, 'candidates', candidate.id);
            const updatedTimesheets = candidate.timesheets.map(t => 
                t.id === timesheet.id 
                    ? { ...t, uploaded: true, uploadedFileName: fileName, uploadedAt: new Date().toISOString() }
                    : t
            );
            await updateDoc(candidateRef, { timesheets: updatedTimesheets });
            
            alert(`✅ Timesheet uploaded successfully!\n\nFile: ${fileName}\nSize: ${(file.size / 1024).toFixed(1)} KB\n\nYou can view this file later in the download section.`);
        } catch (error: unknown) {
            console.error('Error uploading timesheet:', error);
            
            // Provide specific error messages
            let errorMessage = 'Failed to upload timesheet. Please try again.';
            
            if (error instanceof Error) {
                if (error.message.includes('storage/unauthorized')) {
                    errorMessage = 'Upload failed: Unauthorized access. Please check your permissions.';
                } else if (error.message.includes('storage/unknown')) {
                    errorMessage = 'Upload failed: Network error. Please check your connection and try again.';
                } else {
                    errorMessage = `Upload failed: ${error.message}`;
                }
            }
            
            alert(errorMessage);
        }
    };
    
    const handleDownloadSignedTimesheet = async (
        candidate: Candidate, 
        timesheet: Timesheet
    ): Promise<void> => {
        try {
            if (!timesheet.uploaded || !timesheet.uploadedFileName) {
                alert('No signed timesheet has been uploaded for this period.');
                return;
            }
            
            // Use company-based folder structure for download
            const storageRef = ref(storage, `companies/${encodeURIComponent(candidate.company)}/${candidate.id}/${timesheet.uploadedFileName}`);
            const downloadURL = await getDownloadURL(storageRef);
            
            // Open the file in a new tab
            window.open(downloadURL, '_blank');
            
            console.log('Signed timesheet downloaded:', downloadURL);
        } catch (error: unknown) {
            console.error('Error downloading signed timesheet:', error);
            
            let errorMessage = 'Failed to download signed timesheet. Please try again.';
            
            if (error instanceof Error) {
                if (error.message.includes('storage/object-not-found')) {
                    errorMessage = 'Signed timesheet not found. It may have been deleted or moved.';
                } else if (error.message.includes('storage/unauthorized')) {
                    errorMessage = 'Download failed: Unauthorized access. Please check your permissions.';
                } else {
                    errorMessage = `Download failed: ${error.message}`;
                }
            }
            
            alert(errorMessage);
        }
    };
    const deleteTimesheet = async (
        candidateId: string, 
        timesheetId: number, 
        candidates: Candidate[]
    ): Promise<void> => {
        try {
            const candidateRef = doc(db, 'candidates', candidateId);
            const currentCandidate = candidates.find(c => c.id === candidateId);
            if (currentCandidate) {
                const updatedTimesheets = currentCandidate.timesheets.filter(t => t.id !== timesheetId);
                await updateDoc(candidateRef, { timesheets: updatedTimesheets });
            }
        } catch (error) {
            console.error('Error deleting timesheet:', error);
            throw error;
        }
    };

    return {
        addTimesheet,
        handleDownload,
        handleUploadTimesheet,
        handleDownloadSignedTimesheet,
        deleteTimesheet
    };
};