'use client';

import React, { useState } from 'react';
import { Workflow, WorkflowStep, PDFDocument } from '@/types';
import { FileUploader } from './FileUploader';

interface WorkflowBuilderProps {
  workflow: Workflow;
  onSave: (workflow: Workflow) => void;
  onBack: () => void;
}

export function WorkflowBuilder({ workflow, onSave, onBack }: WorkflowBuilderProps) {
  const [name, setName] = useState(workflow.name);
  const [description, setDescription] = useState(workflow.description);
  const [steps, setSteps] = useState(workflow.steps);
  const [uploadedDocs, setUploadedDocs] = useState<PDFDocument[]>([]);
  const [showPDFUpload, setShowPDFUpload] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      name: 'New Step',
      description: 'Step description',
      type: 'process',
    };
    setSteps([...steps, newStep]);
  };

  const handleUpdateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  const handleFileUpload = async (file: File, content: string) => {
    const doc: PDFDocument = {
      id: `doc_${Date.now()}`,
      name: file.name,
      content,
      uploadedAt: new Date().toISOString(),
      pages: 1, // Would need to count actual pages
    };

    setUploadedDocs([...uploadedDocs, doc]);
    setShowPDFUpload(false);

    // Optionally analyze and suggest workflow steps
    await analyzePDFAndSuggestSteps(doc);
  };

  const analyzePDFAndSuggestSteps = async (doc: PDFDocument) => {
    try {
      setIsGenerating(true);

      const response = await fetch('/api/pdf/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentContent: doc.content.substring(0, 3000),
          analysisType: 'categorize',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Document analysis:', data.data?.analysis);
        // You could auto-generate steps based on analysis
      }
    } catch (error) {
      console.error('Error analyzing PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const updatedWorkflow: Workflow = {
      ...workflow,
      name,
      description,
      steps,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedWorkflow);
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex((s) => s.id === stepId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Builder</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Workflow
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Workflow Details */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Workflow Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📄 Upload Documents
              </h2>

              {!showPDFUpload ? (
                <button
                  onClick={() => setShowPDFUpload(true)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Upload PDF
                </button>
              ) : (
                <div>
                  <FileUploader
                    onFileUpload={handleFileUpload}
                    isLoading={isGenerating}
                  />
                  <button
                    onClick={() => setShowPDFUpload(false)}
                    className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Close
                  </button>
                </div>
              )}

              {uploadedDocs.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-sm text-gray-900 mb-2">
                    Uploaded Documents:
                  </h3>
                  <div className="space-y-2">
                    {uploadedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-2 bg-gray-100 rounded text-sm text-gray-700"
                      >
                        {doc.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Workflow Stats
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Steps:</span>
                  <span className="font-medium">{steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Steps:</span>
                  <span className="font-medium">
                    {steps.filter((s) => s.type === 'ai').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Decision Points:</span>
                  <span className="font-medium">
                    {steps.filter((s) => s.type === 'decision').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Workflow Steps
                </h2>
                <button
                  onClick={handleAddStep}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  + Add Step
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {steps.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <p className="mb-4">No steps added yet</p>
                    <button
                      onClick={handleAddStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                    >
                      Add First Step
                    </button>
                  </div>
                ) : (
                  steps.map((step, index) => (
                    <div key={step.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                              {index + 1}
                            </span>
                            {editingStepId === step.id ? (
                              <input
                                type="text"
                                value={step.name}
                                onChange={(e) =>
                                  handleUpdateStep(step.id, {
                                    name: e.target.value,
                                  })
                                }
                                className="text-lg font-semibold px-2 py-1 border border-blue-300 rounded"
                              />
                            ) : (
                              <h3 className="text-lg font-semibold text-gray-900">
                                {step.name}
                              </h3>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 ml-11">
                            {step.description}
                          </p>
                        </div>

                        {/* Step Type Badge */}
                        <select
                          value={step.type}
                          onChange={(e) =>
                            handleUpdateStep(step.id, {
                              type: e.target.value as any,
                            })
                          }
                          className="px-3 py-1 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="input">Input</option>
                          <option value="process">Process</option>
                          <option value="decision">Decision</option>
                          <option value="output">Output</option>
                          <option value="ai">AI</option>
                        </select>
                      </div>

                      {step.type === 'ai' && (
                        <div className="ml-11 mb-3 p-3 bg-blue-50 rounded">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            AI Prompt:
                          </label>
                          <textarea
                            value={step.aiPrompt || ''}
                            onChange={(e) =>
                              handleUpdateStep(step.id, {
                                aiPrompt: e.target.value,
                              })
                            }
                            placeholder="Enter the AI prompt for this step..."
                            rows={2}
                            className="w-full px-2 py-1 border border-blue-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      <div className="flex space-x-2 ml-11">
                        {editingStepId === step.id ? (
                          <button
                            onClick={() => setEditingStepId(null)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingStepId(step.id)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                          >
                            Edit
                          </button>
                        )}

                        {index > 0 && (
                          <button
                            onClick={() => moveStep(step.id, 'up')}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                          >
                            ↑
                          </button>
                        )}

                        {index < steps.length - 1 && (
                          <button
                            onClick={() => moveStep(step.id, 'down')}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                          >
                            ↓
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteStep(step.id)}
                          className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
