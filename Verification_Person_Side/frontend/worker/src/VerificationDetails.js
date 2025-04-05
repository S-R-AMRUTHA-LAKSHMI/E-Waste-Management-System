import React, { useState, useEffect, useRef } from 'react';
import "./VerificationDetails.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const VerificationDetails = ({ request, onBack, onUpdateStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showAssessment, setShowAssessment] = useState(request.status !== 'completed');
    const [showReport, setShowReport] = useState(request.status === 'completed');
    const [predictionData, setPredictionData] = useState({
        itemType: request.predictionData?.itemType || '',
        brand: request.predictionData?.brand || '',
        age: request.predictionData?.age || '',
        condition: request.predictionData?.condition || '',
        weight: request.predictionData?.weight || '',
        materialComposition: request.predictionData?.materialComposition || '',
        batteryIncluded: request.predictionData?.batteryIncluded || '',
        visibleDamage: request.predictionData?.visibleDamage || '',
        screenCondition: request.predictionData?.screenCondition || '',
        rustPresence: request.predictionData?.rustPresence || '',
        wiringCondition: request.predictionData?.wiringCondition || '',
        resalePotential: request.predictionData?.resalePotential || ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [amount, setAmount] = useState(request.amount || request.report?.predictionResult?.finalAmount?.toFixed(2) || '');
    const [isPaid, setIsPaid] = useState(request.isPaid || false);
    const [isCollected, setIsCollected] = useState(request.isCollected || false);
    const [loading, setLoading] = useState(false);
    const [predictionResult, setPredictionResult] = useState(request.predictionResult || null);
    const reportRef = useRef(null);

    const handlePredictionChange = (field, value) => {
        setPredictionData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear validation error for this field when user makes a change
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = [
            'itemType', 'brand', 'age', 'condition', 'weight',
            'materialComposition', 'batteryIncluded', 'visibleDamage',
            'rustPresence', 'wiringCondition', 'resalePotential'
        ];
        
        // Add screen condition if item type requires it
        if (['Laptop', 'Mobile', 'TV'].includes(predictionData.itemType)) {
            requiredFields.push('screenCondition');
        }
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!predictionData[field]) {
                errors[field] = 'This field is required';
            }
        });
        
        // Additional validation for numeric fields
        if (predictionData.age && (isNaN(predictionData.age) || Number(predictionData.age) <= 0)) {
            errors.age = 'Age must be a positive number';
        }
        
        if (predictionData.weight && (isNaN(predictionData.weight) || Number(predictionData.weight) <= 0)) {
            errors.weight = 'Weight must be a positive number';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const getPrediction = async () => {
        if (!validateForm()) {
            // Form has errors, don't proceed
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(predictionData),
            });
            const data = await response.json();
            setPredictionResult(data);
            const finalAmount = data.finalAmount.toFixed(2);
            setAmount(finalAmount);
            
            await onUpdateStatus(request._id, { 
                amount: finalAmount, 
                predictionData, 
                predictionResult: data,
                customerName: request.customerName,
                phone: request.phone,
                address: request.address,
                pickupDate: request.pickupDate,
                pickupTime: request.pickupTime,
                itemDetails: request.itemDetails
            });
        } catch (error) {
            console.error('Prediction error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleStatusUpdate = async () => {
        const updates = {
            amount,
            isPaid,
            isCollected,
            predictionData,
            predictionResult,
            report: {
                ...request.report,
                reportId: request.report?.reportId || `REP-${request._id}-${Date.now()}`,
                verificationDate: request.report?.verificationDate || new Date(),
                paymentStatus: isPaid ? 'Paid' : 'Pending',
                collectionStatus: isCollected ? 'Collected' : 'Pending',
                customerDetails: {
                    name: request.customerName,
                    phone: request.phone,
                    address: request.address,
                    pickupDate: request.pickupDate,
                    pickupTime: request.pickupTime
                },
                itemDetails: request.itemDetails,
                predictionDetails: predictionResult
            },
            customerName: request.customerName,
            phone: request.phone,
            address: request.address,
            pickupDate: request.pickupDate,
            pickupTime: request.pickupTime,
            itemDetails: request.itemDetails
        };
        await onUpdateStatus(request._id, updates);
        setIsEditing(false);
        setShowReport(true);
    };

    const handleShowAssessment = () => {
        setShowAssessment(true);
        setIsEditing(true);
    };

    const handleShowReport = () => {
        setShowReport(true);
        setShowAssessment(false);
    };
    
    // Fixed downloadReport function with report ID split into two lines
    const downloadReport = () => {
      try {
        // Create a new PDF document
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        const col1Width = 40;
        
        // Set initial positions
        let y = 20;
        
        // Add title
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('E-Waste Verification Report', pageWidth / 2, y, { align: 'center' });
        y += 15;
        
        // Report header section
        pdf.setFontSize(11);
        
        // Report ID printed in two lines
        pdf.setFont('helvetica', 'bold');
        pdf.text('Report ID:', margin, y);
        pdf.setFont('helvetica', 'normal');
        
        // Get the report ID and split it into two parts
        const reportId = request.report?.reportId || `REP-${request._id}-${Date.now()}`;
        const halfLength = Math.ceil(reportId.length / 2);
        const firstLine = reportId.substring(0, halfLength);
        const secondLine = reportId.substring(halfLength);
        
        // Print the first line of the report ID
        pdf.text(firstLine, margin + col1Width, y);
        // Print the second line of the report ID
        pdf.text(secondLine, margin + col1Width, y + 5);
        
        // Adjust y position for the second row (add extra 5mm for the second line)
        y += 5;
        
        // Verification Date (aligned with the second line of report ID)
        pdf.setFont('helvetica', 'bold');
        pdf.text('Verification Date:', pageWidth / 2, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          request.report?.verificationDate 
            ? new Date(request.report.verificationDate).toLocaleDateString() 
            : new Date().toLocaleDateString(),
          pageWidth / 2 + col1Width, y
        );
        y += 10;
        
        // Amount and Status - Fixed formatting
        pdf.setFont('helvetica', 'bold');
        pdf.text('Final Amount:', margin, y);
        pdf.setFont('helvetica', 'normal');
        // Format the amount properly with a space after the currency symbol
        pdf.text(`₹ ${amount}`, margin + col1Width, y);
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Status:', pageWidth / 2, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Payment: ${isPaid ? 'Paid' : 'Pending'}`, pageWidth / 2 + col1Width, y);
        y += 7;
        pdf.text(`Collection: ${isCollected ? 'Collected' : 'Pending'}`, pageWidth / 2 + col1Width, y);
        y += 15;
        
        // Customer Details section
        pdf.setFont('helvetica', 'bold');
        pdf.text('Customer Details', margin, y);
        pdf.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;
        
        // Customer information
        const customerInfo = [
          { label: 'Name:', value: request.customerName },
          { label: 'Phone:', value: request.phone },
          { label: 'Address:', value: request.address },
          { label: 'Pickup Details:', value: `${request.pickupDate} at ${request.pickupTime}` }
        ];
        
        // Display in two columns with proper spacing
        for (let i = 0; i < customerInfo.length; i += 2) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(customerInfo[i].label, margin, y);
          pdf.setFont('helvetica', 'normal');
          
          // Trim long values and handle overflow
          const value1 = customerInfo[i].value;
          const maxWidth = pageWidth / 2 - margin - col1Width - 5; // 5mm buffer
          pdf.text(value1, margin + col1Width, y, { 
            maxWidth: maxWidth 
          });
          
          if (i + 1 < customerInfo.length) {
            pdf.setFont('helvetica', 'bold');
            pdf.text(customerInfo[i + 1].label, pageWidth / 2, y);
            pdf.setFont('helvetica', 'normal');
            
            // Trim long values and handle overflow
            const value2 = customerInfo[i + 1].value;
            pdf.text(value2, pageWidth / 2 + col1Width, y, { 
              maxWidth: maxWidth 
            });
          }
          y += 10;
        }
        
        y += 5;
        
        // Assessment Details section
        pdf.setFont('helvetica', 'bold');
        pdf.text('Assessment Details', margin, y);
        pdf.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;
        
        // Assessment information
        const assessmentInfo = [
          { label: 'Item Type:', value: predictionData.itemType },
          { label: 'Brand:', value: predictionData.brand },
          { label: 'Age:', value: `${predictionData.age} years` },
          { label: 'Condition:', value: predictionData.condition },
          { label: 'Weight:', value: `${predictionData.weight} kg` },
          { label: 'Material Composition:', value: predictionData.materialComposition },
          { label: 'Battery Included:', value: predictionData.batteryIncluded },
          { label: 'Visible Damage:', value: predictionData.visibleDamage }
        ];
        
        // Add screen condition if applicable
        if (['Laptop', 'Mobile', 'TV'].includes(predictionData.itemType)) {
          assessmentInfo.push({ label: 'Screen Condition:', value: predictionData.screenCondition });
        }
        
        assessmentInfo.push(
          { label: 'Rust Presence:', value: predictionData.rustPresence },
          { label: 'Wiring Condition:', value: predictionData.wiringCondition },
          { label: 'Resale Potential:', value: predictionData.resalePotential }
        );
        
        // Display in two columns with overflow to new page if needed and improved spacing
        for (let i = 0; i < assessmentInfo.length; i += 2) {
          // Check if we need a new page
          if (y > 270) {
            pdf.addPage();
            y = 20;
          }
          
          pdf.setFont('helvetica', 'bold');
          pdf.text(assessmentInfo[i].label, margin, y);
          pdf.setFont('helvetica', 'normal');
          
          // Handle long values with proper spacing
          const maxWidth = pageWidth / 2 - margin - col1Width - 5; // 5mm buffer
          pdf.text(assessmentInfo[i].value, margin + col1Width, y, { 
            maxWidth: maxWidth 
          });
          
          if (i + 1 < assessmentInfo.length) {
            pdf.setFont('helvetica', 'bold');
            pdf.text(assessmentInfo[i + 1].label, pageWidth / 2, y);
            pdf.setFont('helvetica', 'normal');
            pdf.text(assessmentInfo[i + 1].value, pageWidth / 2 + col1Width, y, { 
              maxWidth: maxWidth 
            });
          }
          y += 10;
        }
        
        // Add footer
        y = pdf.internal.pageSize.getHeight() - 10;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.text('This is an electronically generated report.', pageWidth / 2, y, { align: 'center' });
        
        pdf.save(`E-Waste-Verification-Report-${request._id}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };
        const renderCustomerDetails = () => (
        <div className="details-box">
            
            <h2 className="section-header">Customer Details</h2>
            
            <div className="grid-container">
                <div className="animate-fade-in">
                    <p className="font-semibold">Name:</p>
                    <p>{request.customerName}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <p className="font-semibold">Phone:</p>
                    <p>{request.phone}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p className="font-semibold">Address:</p>
                    <p>{request.address}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <p className="font-semibold">Pickup Details:</p>
                    <p>{request.pickupDate} at {request.pickupTime}</p>
                </div>
                <div className="animate-fade-in col-span-2" style={{ animationDelay: '0.4s' }}>
                    <p className="font-semibold">Item Details:</p>
                    <p>{request.itemDetails}</p>
                </div>
            </div>
        </div>
    );

    const renderReport = () => (
        <div className="details-box" ref={reportRef}>
            <h2 className="section-header" style={{ color: '#000000', fontWeight: 'bold', fontSize: '24px' }}>E-Waste Verification Report</h2>
            <div className="grid-container">
                <div className="animate-fade-in">
                    <p className="font-semibold" style={{ color: '#000000' }}>Report ID:</p>
                    <p style={{ color: '#000000' }}>{request.report?.reportId || `REP-${request._id}-${Date.now()}`}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <p className="font-semibold" style={{ color: '#000000' }}>Verification Date:</p>
                    <p style={{ color: '#000000' }}>{request.report?.verificationDate 
                        ? new Date(request.report.verificationDate).toLocaleDateString() 
                        : new Date().toLocaleDateString()}
                    </p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p className="font-semibold" style={{ color: '#000000' }}>Final Amount:</p>
                    <p style={{ color: '#000000', fontWeight: 'bold' }}>₹{amount}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <p className="font-semibold" style={{ color: '#000000' }}>Status:</p>
                    <span className={`status-badge ${isPaid ? 'success' : 'pending'}`} style={{ color: '#000000', fontWeight: 'bold' }}>
                        Payment: {isPaid ? 'Paid' : 'Pending'}
                    </span>
                    <span className={`status-badge ${isCollected ? 'success' : 'pending'}`} style={{ color: '#000000', fontWeight: 'bold' }}>
                        Collection: {isCollected ? 'Collected' : 'Pending'}
                    </span>
                </div>
                
                <div className="animate-fade-in col-span-2" style={{ animationDelay: '0.4s' }}>
                    <h3 className="font-semibold mt-4" style={{ color: '#000000', borderBottom: '1px solid #000', paddingBottom: '5px', marginTop: '15px' }}>Customer Details</h3>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <p className="font-semibold" style={{ color: '#000000' }}>Name:</p>
                    <p style={{ color: '#000000' }}>{request.customerName}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <p className="font-semibold" style={{ color: '#000000' }}>Phone:</p>
                    <p style={{ color: '#000000' }}>{request.phone}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <p className="font-semibold" style={{ color: '#000000' }}>Address:</p>
                    <p style={{ color: '#000000' }}>{request.address}</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <p className="font-semibold" style={{ color: '#000000' }}>Pickup Details:</p>
                    <p style={{ color: '#000000' }}>{request.pickupDate} at {request.pickupTime}</p>
                </div>
                
                {predictionData && (
                    <>
                        <div className="animate-fade-in col-span-2" style={{ animationDelay: '0.6s' }}>
                            <h3 className="font-semibold mt-4" style={{ color: '#000000', borderBottom: '1px solid #000', paddingBottom: '5px', marginTop: '15px' }}>Assessment Details:</h3>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Item Type:</p>
                            <p style={{ color: '#000000' }}>{predictionData.itemType}</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Brand:</p>
                            <p style={{ color: '#000000' }}>{predictionData.brand}</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Age:</p>
                            <p style={{ color: '#000000' }}>{predictionData.age} years</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Condition:</p>
                            <p style={{ color: '#000000' }}>{predictionData.condition}</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Weight:</p>
                            <p style={{ color: '#000000' }}>{predictionData.weight} kg</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Material Composition:</p>
                            <p style={{ color: '#000000' }}>{predictionData.materialComposition}</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Battery Included:</p>
                            <p style={{ color: '#000000' }}>{predictionData.batteryIncluded}</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Visible Damage:</p>
                            <p style={{ color: '#000000' }}>{predictionData.visibleDamage}</p>
                        </div>
                        {['Laptop', 'Mobile', 'TV'].includes(predictionData.itemType) && (
                            <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
                                <p className="font-semibold" style={{ color: '#000000' }}>Screen Condition:</p>
                                <p style={{ color: '#000000' }}>{predictionData.screenCondition}</p>
                            </div>
                        )}
                        <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Rust Presence:</p>
                            <p style={{ color: '#000000' }}>{predictionData.rustPresence}</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Wiring Condition:</p>
                            <p style={{ color: '#000000' }}>{predictionData.wiringCondition}</p>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
                            <p className="font-semibold" style={{ color: '#000000' }}>Resale Potential:</p>
                            <p style={{ color: '#000000' }}>{predictionData.resalePotential}</p>
                        </div>
                    </>
                )}
            </div>
            
            <div className="action-buttons hidden-in-pdf">
                <button onClick={downloadReport} className="primary-button">
                    Download Report as PDF
                </button>
            </div>
        </div>
    );

    const renderPaymentCollection = (isEditable) => (
        <div className="details-box">
            <h2 className="section-header">Payment & Collection Status</h2>
            <div className="grid-container">
                <div className="animate-fade-in">
                    <p className="font-semibold">Amount:</p>
                    <p>₹{amount}</p>
                </div>
                {isEditable ? (
                    <>
                        <div className="checkbox-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <input
                                type="checkbox"
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                                className="custom-checkbox"
                            />
                            <label>Payment Received</label>
                        </div>
                        <div className="checkbox-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <input
                                type="checkbox"
                                checked={isCollected}
                                onChange={(e) => setIsCollected(e.target.checked)}
                                className="custom-checkbox"
                            />
                            <label>Item Collected</label>
                        </div>
                        <button
                            onClick={handleStatusUpdate}
                            className="primary-button animate-fade-in"
                            style={{ animationDelay: '0.3s' }}
                        >
                            Update Status
                        </button>
                    </>
                ) : (
                    <>
                        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <span className={`status-badge ${isPaid ? 'success' : 'pending'}`}>
                                Payment Status: {isPaid ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <span className={`status-badge ${isCollected ? 'success' : 'pending'}`}>
                                Collection Status: {isCollected ? 'Collected' : 'Pending'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="primary-button animate-fade-in"
                            style={{ animationDelay: '0.3s' }}
                        >
                            Edit Status
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    const renderPredictionForm = () => {
        const getBrandOptions = (itemType) => {
            const brandMap = {
                'Laptop': ['Dell', 'HP', 'Lenovo', 'Apple', 'Acer'],
                'Mobile': ['Samsung', 'Apple', 'OnePlus', 'Vivo', 'Oppo'],
                'TV': ['Sony', 'LG', 'Samsung', 'Panasonic'],
                'Refrigerator': ['LG', 'Samsung', 'Whirlpool', 'Godrej'],
                'Washing Machine': ['IFB', 'Bosch', 'LG', 'Samsung'],
                'Microwave': ['Samsung', 'LG', 'Panasonic'],
                'Printer': ['HP', 'Epson', 'Canon'],
                'AC': ['Voltas', 'LG', 'Hitachi', 'Daikin']
            };
            return brandMap[itemType] || [];
        };

        const formFields = [
            { label: 'Item Type', field: 'itemType', type: 'select', options: ['Laptop', 'Mobile', 'TV', 'Refrigerator', 'Washing Machine', 'Microwave', 'Printer', 'AC'] },
            { label: 'Brand', field: 'brand', type: 'select', options: getBrandOptions(predictionData.itemType), disabled: !predictionData.itemType },
            { label: 'Age (Years)', field: 'age', type: 'number', min: '1', max: '15' },
            { label: 'Condition', field: 'condition', type: 'select', options: ['Working', 'Partially Working', 'Non-Working', 'Scrap'] },
            { label: 'Weight (kg)', field: 'weight', type: 'number', step: '0.1', min: '0.5', max: '60' },
            { label: 'Material Composition', field: 'materialComposition', type: 'select', options: ['Plastic, Metal', 'Glass, Plastic, Metal', 'Metal, Plastic', 'Plastic, Glass', 'Plastic'] },
            { label: 'Battery Included', field: 'batteryIncluded', type: 'select', options: ['Yes', 'No'] },
            { label: 'Visible Damage', field: 'visibleDamage', type: 'select', options: ['Yes', 'No'] },
            { label: 'Screen Condition', field: 'screenCondition', type: 'select', options: ['No Damage', 'Minor Scratches', 'Cracked', 'Missing Parts'], disabled: !['Laptop', 'Mobile', 'TV'].includes(predictionData.itemType) },
            { label: 'Rust Presence', field: 'rustPresence', type: 'select', options: ['Yes', 'No'] },
            { label: 'Wiring Condition', field: 'wiringCondition', type: 'select', options: ['Intact', 'Slightly Worn', 'Damaged Wires'] },
            { label: 'Resale Potential', field: 'resalePotential', type: 'select', options: ['High', 'Medium', 'Low'] }
        ];

        return (
            <div className="details-box">
                <h2 className="section-header">E-Waste Assessment</h2>
                {Object.keys(validationErrors).length > 0 && (
                    <div className="validation-summary error-message mb-4">
                        Please fill in all required fields to calculate the price.
                    </div>
                )}
                <div className="grid-container">
                    {formFields.map((field, index) => (
                        <div key={field.field} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <label className="block mb-2">
                                {field.label} {field !== 'screenCondition' && <span className="text-red-500">*</span>}
                                {field.field === 'screenCondition' && ['Laptop', 'Mobile', 'TV'].includes(predictionData.itemType) && <span className="text-red-500">*</span>}
                            </label>
                            {field.type === 'select' ? (
                                <div>
                                    <select
                                        className={`form-control ${validationErrors[field.field] ? 'error-border' : ''}`}
                                        value={predictionData[field.field]}
                                        onChange={(e) => handlePredictionChange(field.field, e.target.value)}
                                        disabled={field.disabled}
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {validationErrors[field.field] && <div className="error-message">{validationErrors[field.field]}</div>}
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type={field.type}
                                        className={`form-control ${validationErrors[field.field] ? 'error-border' : ''}`}
                                        value={predictionData[field.field]}
                                        onChange={(e) => handlePredictionChange(field.field, e.target.value)}
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
                                    />
                                    {validationErrors[field.field] && <div className="error-message">{validationErrors[field.field]}</div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={getPrediction}
                    disabled={loading}
                    className="primary-button w-full mt-6"
                >
                    {loading ? 'Calculating...' : 'Calculate Price'}
                </button>

                {predictionResult && (
                    <div className="results-container">
                        <h3 className="font-bold mb-2">Assessment Results:</h3>
                        <p className="font-bold animate-fade-in" style={{ animationDelay: '0.2s' }}>Final Amount: ₹{predictionResult.finalAmount.toFixed(2)}</p>
                        
                        {request.status !== 'completed' && (
                            <button 
                                onClick={handleShowReport} 
                                className="secondary-button mt-4 animate-fade-in" 
                                style={{ animationDelay: '0.3s' }}
                            >
                                View Verification Report
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Add CSS styles for errors
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .error-border {
                border: 1px solid #ff5555 !important;
            }
            .error-message {
                color: #ff5555;
                font-size: 0.8rem;
                margin-top: 2px;
            }
            .validation-summary {
                background-color: #fff5f5;
                color: #ff5555;
                padding: 10px;
                border-radius: 4px;
                border-left: 4px solid #ff5555;
            }
            .hidden-in-pdf {
                /* These elements won't be included in PDF */
            }
            @media print {
                .hidden-in-pdf {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={onBack}
                className="back-button mb-6"
            >
                ← Back
            </button>
            
            {renderCustomerDetails()}
            
            {request.status === 'completed' ? (
                // For completed requests
                <>
                    {showReport && renderReport()}
                    {!showAssessment && (
                        <div className="action-buttons mb-6">
                            <button onClick={handleShowAssessment} className="primary-button">
                                Edit Assessment
                            </button>
                        </div>
                    )}
                    {showAssessment && renderPredictionForm()}
                    {renderPaymentCollection(isEditing)}
                </>
            ) : (
                // For non-completed requests
                <>
                    {showAssessment && renderPredictionForm()}
                    {showReport && renderReport()}
                    {!showReport && predictionResult && (
                        <div className="action-buttons mb-6">
                            <button onClick={handleShowReport} className="primary-button">
                                View Verification Report
                            </button>
                        </div>
                    )}
                    {renderPaymentCollection(isEditing)}
                </>
            )}
        </div>
    );
};

export default VerificationDetails;