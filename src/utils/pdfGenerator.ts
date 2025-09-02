import 'jspdf-autotable';
import { Candidate, Timesheet } from '@/types';

// --- PDF Generation Logic ---
export const generatePDF = async (candidate: Candidate, timesheet: Timesheet): Promise<void> => {
    try {
        // Dynamic imports for reliable plugin attachment in client environment
        const jsPDF = (await import('jspdf')).default;
        const autoTableModule = await import('jspdf-autotable');
        
        const doc = new jsPDF({ orientation: 'landscape' });
        
        // Properly attach the autoTable plugin using the default export
        const autoTable = autoTableModule.default || autoTableModule.autoTable || autoTableModule;
        
        // Ensure plugin is attached to jsPDF
        if (typeof autoTable === 'function') {
            // Call autoTable directly with doc as first parameter
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const callAutoTable = (options: any) => autoTable(doc, options);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (doc as any).autoTable = callAutoTable;
        } else {
            throw new Error('autoTable plugin not loaded correctly');
        }
        
        // Verify the function is properly attached
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (doc as any).autoTable !== 'function') {
            throw new Error('Failed to attach autoTable function to jsPDF instance');
        }
        
        // Load local logo with proper aspect ratio
        try {
            const logoResponse = await fetch('/Logo.png');
            const logoBlob = await logoResponse.blob();
            const logoDataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(logoBlob);
            });
            
            // Create an image element to get natural dimensions
            const img = new Image();
            await new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.src = logoDataUrl;
            });
            
            // Calculate proportional size (max height 15, maintain aspect ratio)
            const maxHeight = 15; // Smaller logo
            const aspectRatio = img.width / img.height;
            const logoHeight = maxHeight;
            const logoWidth = logoHeight * aspectRatio;
            
            // Position logo with safe margin from right edge for perfect alignment
            // Move to x=220 for better positioning within landscape A4 boundaries
            const logoX = 220; // Moved further left for perfect alignment
            doc.addImage(logoDataUrl, 'PNG', logoX, 8, logoWidth, logoHeight);
        } catch (error) {
            console.warn('Could not load logo:', error);
            // Fallback: just show company name without logo
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('WPS', 220, 20);
        }
        
        // Generate smart header with pure calendar month approach
        const getSmartHeader = (timesheet: Timesheet): string => {
            // Get month from first date (always accurate with pure calendar approach)
            const firstDate = new Date(timesheet.dates[0]);
            const monthName = firstDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
            
            // Determine S1 or S2 from period ending
            const periodEnd = new Date(timesheet.periodEnding);
            const sheetNumber = periodEnd.getDate() === 15 ? 'S1' : 'S2';
            
            return `WEEKLY TIME SHEET - ${monthName} ${sheetNumber}`;
        };
        
        // Header - reduced size for better fit
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(getSmartHeader(timesheet), 14, 25);
        
        // Company name
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(candidate.company, 14, 35);
        
        // Employee information section - professional aligned layout
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        
        // Create a clean, aligned layout with consistent spacing
        const leftCol = 14;
        const leftValueCol = 50;
        const middleCol = 120;
        const middleValueCol = 145;
        const rightCol = 200;
        const rightValueCol = 235;
        
        // Labels
        doc.text('Employee:', leftCol, 45);
        doc.text('Manager:', leftCol, 55);
        doc.text('Contact:', middleCol, 45);
        doc.text('Email:', middleCol, 55);
        doc.text('Employee ID:', rightCol, 45);
        
        // Values with consistent alignment
        doc.setFont('helvetica', 'normal');
        doc.text(candidate.name, leftValueCol, 45);
        doc.text(candidate.manager || '', leftValueCol, 55);
        doc.text(candidate.contactNumber || '', middleValueCol, 45);
        doc.text(candidate.email, middleValueCol, 55);
        doc.text(candidate.employeeId || '', rightValueCol, 45);
        
        // Professional underlines with consistent length
        const lineLength = 65;
        doc.setLineWidth(0.3);
        doc.line(leftValueCol, 47, leftValueCol + lineLength, 47); // Employee name
        doc.line(leftValueCol, 57, leftValueCol + lineLength, 57); // Manager
        doc.line(middleValueCol, 47, middleValueCol + 50, 47); // Contact
        doc.line(middleValueCol, 57, middleValueCol + 50, 57); // Email
        doc.line(rightValueCol, 47, rightValueCol + 40, 47); // Employee ID
        
        const tableColumn = [["Day", "Date", "Working Hours", "Candidate Signature", "Supervisor Signature", "Leave Applied", "Total"]];
        const tableRows: string[][] = [];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        timesheet.dates.forEach((date) => {
            const dateObj = new Date(date);
            const dayOfWeek = dateObj.getDay(); // 0=Sunday, 1=Monday, etc.
            const dayLabel = daysOfWeek[dayOfWeek];
            
            tableRows.push([
                dayLabel,
                new Date(date).toLocaleDateString('en-CA', { timeZone: 'UTC' }),
                candidate.workingHours || '08:00 - 16:00',
                '', // Candidate Signature
                '', // Supervisor Signature
                '', // Leave Applied
                ''  // Total
            ]);
        });
        
        // Add "Days Absent" row
        tableRows.push([
            'Days Absent :', '', '', '', '', '', ''
        ]);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).autoTable({
            head: tableColumn, 
            body: tableRows, 
            startY: 70, // Start higher to fit on single page
            theme: 'grid',
            headStyles: { 
                fillColor: [54, 96, 146], // Blue color to match reference
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9 // Smaller font
            },
            styles: { 
                cellPadding: 2, // Reduced padding
                fontSize: 8, // Smaller font
                lineWidth: 0.3,
                minCellHeight: 8 // Compact rows
            },
            columnStyles: { 
                0: { cellWidth: 30 }, // Day
                1: { cellWidth: 30 }, // Date
                2: { cellWidth: 35 }, // Working Hours
                3: { cellWidth: 50 }, // Candidate Signature
                4: { cellWidth: 50 }, // Supervisor Signature
                5: { cellWidth: 30 }, // Leave Applied
                6: { cellWidth: 25 }  // Total
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            didParseCell: function(data: any) {
                // Make "Days Absent" row blue only for the first column, white for others
                if (data.row.index === tableRows.length - 1) {
                    if (data.column.index === 0) {
                        // Only first column is blue
                        data.cell.styles.fillColor = [54, 96, 146];
                        data.cell.styles.textColor = [255, 255, 255];
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        // Other columns are white
                        data.cell.styles.fillColor = [255, 255, 255];
                        data.cell.styles.textColor = [0, 0, 0];
                        data.cell.styles.fontStyle = 'normal';
                    }
                }
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const finalY = (doc as any).lastAutoTable.finalY + 10; // Reduced spacing
        
        // Signature section - compact
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        
        // Employee signature section (left side)
        doc.text('EMPLOYEE SIGNATURE', 20, finalY);
        doc.line(20, finalY + 10, 130, finalY + 10); // Shorter signature line
        
        doc.text('DATE', 20, finalY + 18);
        doc.line(20, finalY + 22, 130, finalY + 22); // Date line
        
        // Manager signature section (right side)
        doc.text('MANAGER SIGNATURE', 160, finalY);
        doc.line(160, finalY + 10, 270, finalY + 10); // Shorter signature line
        
        doc.text('DATE', 160, finalY + 18);
        doc.line(160, finalY + 22, 270, finalY + 22); // Date line
        
        // Ensure content fits on single page by checking page height
        const pageHeight = doc.internal.pageSize.height;
        const currentY = finalY + 30;
        
        if (currentY > pageHeight - 20) {
            console.warn('Content may not fit on single page. Current Y:', currentY, 'Page height:', pageHeight);
        }
        
        doc.save(`weekly_timesheet_${candidate.name.replace(' ', '_')}_${timesheet.periodEnding}.pdf`);
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
        throw error;
    }
};