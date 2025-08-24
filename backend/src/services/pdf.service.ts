import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class PdfService {
  async generateDashboardReport(data: any, res: Response) {
    const doc = new PDFKit();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard-report.pdf');
    
    // Pipe the PDF to response
    doc.pipe(res);
    
    // Add header
    doc.fontSize(20).text('Galloways Insurance - Admin Dashboard Report', 50, 50);
    doc.fontSize(14).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);
    
    let yPosition = 120;
    
    // Summary Statistics
    doc.fontSize(16).text('Summary Statistics', 50, yPosition);
    yPosition += 30;
    
    doc.fontSize(12)
       .text(`Total Claims: ${data.totalClaims}`, 50, yPosition)
       .text(`Total Consultations: ${data.totalConsultations}`, 250, yPosition);
    yPosition += 20;
    
    doc.text(`Total Outsourcing Requests: ${data.totalOutsourcingRequests}`, 50, yPosition)
       .text(`Total Payments: ${data.totalPayments}`, 250, yPosition);
    yPosition += 20;
    
    doc.text(`Total Diaspora Requests: ${data.totalDiasporaRequests}`, 50, yPosition)
       .text(`Monthly Revenue: KSh ${data.monthlyRevenue?.toLocaleString() || 0}`, 250, yPosition);
    yPosition += 40;
    
    // Claims Section
    if (data.allSubmissions?.claims?.length > 0) {
      doc.fontSize(16).text('Claims Details', 50, yPosition);
      yPosition += 30;
      
      data.allSubmissions.claims.forEach((claim: any, index: number) => {
        if (yPosition > 700) { // Add new page if needed
          doc.addPage();
          yPosition = 50;
        }
        
        doc.fontSize(10)
           .text(`${index + 1}. Policy: ${claim.policyNumber} | Client: ${claim.clientEmail}`, 50, yPosition)
           .text(`   Incident: ${claim.incidentType} | Amount: KSh ${claim.claimAmount?.toLocaleString() || 0}`, 50, yPosition + 15)
           .text(`   Status: ${claim.status} | Date: ${new Date(claim.createdAt).toLocaleDateString()}`, 50, yPosition + 30);
        yPosition += 50;
      });
      yPosition += 20;
    }
    
    // Outsourcing Section
    if (data.allSubmissions?.outsourcing?.length > 0) {
      if (yPosition > 600) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(16).text('Outsourcing Requests', 50, yPosition);
      yPosition += 30;
      
      data.allSubmissions.outsourcing.forEach((request: any, index: number) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        doc.fontSize(10)
           .text(`${index + 1}. Company: ${request.companyName} | Email: ${request.contactEmail}`, 50, yPosition)
           .text(`   Service: ${request.serviceType} | Budget: ${request.budgetRange}`, 50, yPosition + 15)
           .text(`   Status: ${request.status} | Date: ${new Date(request.createdAt).toLocaleDateString()}`, 50, yPosition + 30);
        yPosition += 50;
      });
      yPosition += 20;
    }
    
    // Consultations Section
    if (data.allSubmissions?.consultations?.length > 0) {
      if (yPosition > 600) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(16).text('Consultations', 50, yPosition);
      yPosition += 30;
      
      data.allSubmissions.consultations.forEach((consultation: any, index: number) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        doc.fontSize(10)
           .text(`${index + 1}. Name: ${consultation.fullName} | Email: ${consultation.email}`, 50, yPosition)
           .text(`   Service: ${consultation.serviceType}`, 50, yPosition + 15)
           .text(`   Status: ${consultation.status} | Date: ${new Date(consultation.createdAt).toLocaleDateString()}`, 50, yPosition + 30);
        yPosition += 50;
      });
      yPosition += 20;
    }
    
    // Payments Section
    if (data.allSubmissions?.payments?.length > 0) {
      if (yPosition > 600) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(16).text('Payments', 50, yPosition);
      yPosition += 30;
      
      data.allSubmissions.payments.forEach((payment: any, index: number) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        doc.fontSize(10)
           .text(`${index + 1}. Policy: ${payment.policyNumber} | Client: ${payment.clientEmail}`, 50, yPosition)
           .text(`   Amount: KSh ${payment.amount?.toLocaleString() || 0} | Method: ${payment.paymentMethod}`, 50, yPosition + 15)
           .text(`   Status: ${payment.status} | Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 50, yPosition + 30);
        yPosition += 50;
      });
      yPosition += 20;
    }
    
    // Diaspora Requests Section
    if (data.allSubmissions?.diaspora?.length > 0) {
      if (yPosition > 600) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(16).text('Diaspora Requests', 50, yPosition);
      yPosition += 30;
      
      data.allSubmissions.diaspora.forEach((request: any, index: number) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        doc.fontSize(10)
           .text(`${index + 1}. Name: ${request.fullName} | Email: ${request.email}`, 50, yPosition)
           .text(`   Country: ${request.currentCountry} | Service: ${request.serviceType}`, 50, yPosition + 15)
           .text(`   Status: ${request.status} | Date: ${new Date(request.createdAt).toLocaleDateString()}`, 50, yPosition + 30);
        yPosition += 50;
      });
    }
    
    // Finalize the PDF
    doc.end();
  }
}
