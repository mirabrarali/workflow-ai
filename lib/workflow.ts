/**
 * Workflow storage and management utilities
 */

import { Workflow } from '@/types';

const STORAGE_KEY = 'workflows';

export function saveWorkflow(workflow: Workflow): void {
  try {
    const workflows = getAllWorkflows();
    const existingIndex = workflows.findIndex((w) => w.id === workflow.id);

    if (existingIndex > -1) {
      workflows[existingIndex] = workflow;
    } else {
      workflows.push(workflow);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    }
  } catch (error) {
    console.error('Failed to save workflow:', error);
  }
}

export function getWorkflowById(id: string): Workflow | null {
  try {
    const workflows = getAllWorkflows();
    return workflows.find((w) => w.id === id) || null;
  } catch (error) {
    console.error('Failed to get workflow:', error);
    return null;
  }
}

export function getAllWorkflows(): Workflow[] {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get workflows:', error);
    return [];
  }
}

export function deleteWorkflow(id: string): void {
  try {
    const workflows = getAllWorkflows();
    const filtered = workflows.filter((w) => w.id !== id);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (error) {
    console.error('Failed to delete workflow:', error);
  }
}

export function createWorkflowFromTemplate(
  templateId: string,
  templateSteps: any[]
): Workflow {
  const workflow: Workflow = {
    id: `workflow_${Date.now()}`,
    name: `Workflow - ${new Date().toLocaleDateString()}`,
    description: `Created from template: ${templateId}`,
    status: 'draft',
    steps: templateSteps,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    templateId,
  };

  return workflow;
}

export function duplicateWorkflow(workflow: Workflow): Workflow {
  return {
    ...workflow,
    id: `workflow_${Date.now()}`,
    name: `${workflow.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function searchWorkflows(query: string): Workflow[] {
  const workflows = getAllWorkflows();
  const lowerQuery = query.toLowerCase();

  return workflows.filter(
    (w) =>
      w.name.toLowerCase().includes(lowerQuery) ||
      w.description.toLowerCase().includes(lowerQuery) ||
      w.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
