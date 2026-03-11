/**
 * Type definitions for the Workflow AI application
 */

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'input' | 'process' | 'decision' | 'output' | 'ai';
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  status?: 'pending' | 'in-progress' | 'completed' | 'failed';
  aiPrompt?: string;
  nextStepId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  templateId?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  tags?: string[];
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface PDFDocument {
  id: string;
  name: string;
  content: string;
  uploadedAt: string;
  pages: number;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface ExecutionResult {
  stepId: string;
  status: 'success' | 'failed';
  output?: any;
  error?: string;
}
