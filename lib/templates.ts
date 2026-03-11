/**
 * Pre-built workflow templates for common scenarios
 */

import { WorkflowTemplate } from '@/types';

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'corporate-credit-proposal',
    name: 'Corporate Credit Proposal',
    description: 'End-to-end workflow for corporate credit proposals',
    category: 'Banking',
    icon: '🏦',
    tags: ['banking', 'credit', 'proposals', 'automated'],
    steps: [
      {
        id: 'step_1',
        name: 'Client Origination',
        description: 'Identify prospect and collect mandate',
        type: 'input',
        outputs: { clientInfo: 'Client identification details' },
      },
      {
        id: 'step_2',
        name: 'Document Collection',
        description: 'Collect KYC, financials, and business documents',
        type: 'process',
        inputs: { clientInfo: 'Client identification' },
        outputs: { documents: 'Collected documents' },
      },
      {
        id: 'step_3',
        name: 'AI Document Analysis',
        description: 'Use AI to analyze and extract key information from documents',
        type: 'ai',
        inputs: { documents: 'Collected documents' },
        aiPrompt:
          'Analyze the provided financial documents. Extract key metrics like revenue, net income, debt ratios, and cash flow.',
        outputs: { analysis: 'Extracted financial metrics' },
      },
      {
        id: 'step_4',
        name: 'Financial Assessment',
        description: 'AI-powered financial risk assessment',
        type: 'ai',
        inputs: { analysis: 'Extracted financial metrics' },
        aiPrompt:
          'Based on the financial metrics, assess the credit risk. Rate as Low, Medium, or High risk with justification.',
        outputs: { riskAssessment: 'Risk rating and analysis' },
      },
      {
        id: 'step_5',
        name: 'Credit Rating',
        description: 'Generate credit rating and pricing',
        type: 'ai',
        inputs: { riskAssessment: 'Risk assessment' },
        aiPrompt:
          'Based on the risk assessment, assign a credit rating (AAA-CCC) and suggest an appropriate interest rate.',
        outputs: { creditRating: 'Credit rating and pricing' },
      },
      {
        id: 'step_6',
        name: 'CAM Preparation',
        description: 'Generate Credit Appraisal Memo',
        type: 'ai',
        inputs: {
          riskAssessment: 'Risk assessment',
          creditRating: 'Credit rating',
        },
        aiPrompt:
          'Generate a professional Credit Appraisal Memo (CAM) summarizing the analysis, risk assessment, credit rating, and recommendations.',
        outputs: { cam: 'Credit Appraisal Memo' },
      },
      {
        id: 'step_7',
        name: 'Internal Review',
        description: 'Maker-checker and compliance review',
        type: 'decision',
        inputs: { cam: 'CAM' },
        outputs: { reviewStatus: 'Approved or Rejected' },
      },
      {
        id: 'step_8',
        name: 'Committee Approval',
        description: 'Submit to approval committee',
        type: 'decision',
        inputs: { reviewStatus: 'Review status' },
        outputs: { approvalStatus: 'Committee decision' },
      },
      {
        id: 'step_9',
        name: 'Documentation',
        description: 'Generate legal documents and agreements',
        type: 'output',
        inputs: { approvalStatus: 'Approval status' },
      },
      {
        id: 'step_10',
        name: 'Monitoring & EWS',
        description: 'Setup ongoing monitoring and Early Warning Signals',
        type: 'output',
        outputs: { monitoring: 'Monitoring framework configured' },
      },
    ],
  },
  {
    id: 'document-classification',
    name: 'Document Classification & Processing',
    description: 'Automatically classify and process incoming documents',
    category: 'Document Processing',
    icon: '📄',
    tags: ['documents', 'classification', 'processing'],
    steps: [
      {
        id: 'step_1',
        name: 'Document Upload',
        description: 'Upload document for processing',
        type: 'input',
        outputs: { document: 'Uploaded document' },
      },
      {
        id: 'step_2',
        name: 'AI Classification',
        description: 'Classify document using AI',
        type: 'ai',
        inputs: { document: 'Document' },
        aiPrompt:
          'Classify this document. Identify the document type (Invoice, Contract, Receipt, Report, etc.), and extract key entities.',
        outputs: { classification: 'Document classification' },
      },
      {
        id: 'step_3',
        name: 'Data Extraction',
        description: 'Extract structured data from document',
        type: 'ai',
        inputs: { classification: 'Document classification' },
        aiPrompt: 'Extract all key data fields from the document in JSON format.',
        outputs: { extractedData: 'Structured data' },
      },
      {
        id: 'step_4',
        name: 'Quality Check',
        description: 'Verify extracted data quality',
        type: 'decision',
        inputs: { extractedData: 'Extracted data' },
        outputs: { qcStatus: 'Quality check passed or failed' },
      },
      {
        id: 'step_5',
        name: 'Archive',
        description: 'Archive processed document',
        type: 'output',
        inputs: { qcStatus: 'QC status' },
      },
    ],
  },
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding',
    description: 'Automated customer onboarding workflow',
    category: 'Customer Management',
    icon: '👥',
    tags: ['onboarding', 'customers', 'automated'],
    steps: [
      {
        id: 'step_1',
        name: 'Lead Capture',
        description: 'Capture new customer information',
        type: 'input',
        outputs: { customerInfo: 'Customer details' },
      },
      {
        id: 'step_2',
        name: 'KYC Verification',
        description: 'Run KYC checks using AI',
        type: 'ai',
        inputs: { customerInfo: 'Customer info' },
        aiPrompt:
          'Perform KYC verification. Check for compliance requirements and identity verification needs.',
        outputs: { kycStatus: 'KYC verification result' },
      },
      {
        id: 'step_3',
        name: 'Risk Assessment',
        description: 'Assess customer risk profile',
        type: 'ai',
        inputs: { customerInfo: 'Customer info' },
        aiPrompt:
          'Assess the risk profile of this customer based on available information.',
        outputs: { riskProfile: 'Risk assessment' },
      },
      {
        id: 'step_4',
        name: 'Approval Decision',
        description: 'Make approval decision',
        type: 'decision',
        inputs: { kycStatus: 'KYC status', riskProfile: 'Risk profile' },
        outputs: { approvalStatus: 'Approved or Rejected' },
      },
      {
        id: 'step_5',
        name: 'Account Setup',
        description: 'Setup customer account',
        type: 'output',
        inputs: { approvalStatus: 'Approval status' },
      },
    ],
  },
  {
    id: 'contract-analysis',
    name: 'Contract Analysis & Review',
    description: 'AI-powered contract review and analysis',
    category: 'Legal',
    icon: '⚖️',
    tags: ['contracts', 'legal', 'analysis'],
    steps: [
      {
        id: 'step_1',
        name: 'Upload Contract',
        description: 'Upload contract for analysis',
        type: 'input',
        outputs: { contract: 'Uploaded contract' },
      },
      {
        id: 'step_2',
        name: 'AI Contract Analysis',
        description: 'Analyze contract terms using AI',
        type: 'ai',
        inputs: { contract: 'Contract' },
        aiPrompt:
          'Analyze this contract. Identify key terms, obligations, clauses, risks, and any unusual provisions.',
        outputs: { analysis: 'Contract analysis' },
      },
      {
        id: 'step_3',
        name: 'Risk Identification',
        description: 'Identify potential risks',
        type: 'ai',
        inputs: { analysis: 'Contract analysis' },
        aiPrompt:
          'Based on the contract analysis, identify potential legal and business risks.',
        outputs: { risks: 'Identified risks' },
      },
      {
        id: 'step_4',
        name: 'Recommendations',
        description: 'Generate improvement recommendations',
        type: 'ai',
        inputs: { risks: 'Identified risks' },
        aiPrompt:
          'Provide recommendations for contract improvements and risk mitigation.',
        outputs: { recommendations: 'Improvement recommendations' },
      },
      {
        id: 'step_5',
        name: 'Report Generation',
        description: 'Generate final review report',
        type: 'output',
        inputs: { recommendations: 'Recommendations' },
      },
    ],
  },
];

export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return workflowTemplates.find((template) => template.id === id);
}

export function getTemplatesByCategory(
  category: string
): WorkflowTemplate[] {
  return workflowTemplates.filter(
    (template) =>
      template.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories(): string[] {
  const categories = new Set(
    workflowTemplates.map((template) => template.category)
  );
  return Array.from(categories);
}
