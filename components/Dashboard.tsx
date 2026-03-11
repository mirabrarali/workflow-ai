'use client';

import React, { useState, useEffect } from 'react';
import { Workflow, WorkflowTemplate } from '@/types';
import {
  getAllWorkflows,
  saveWorkflow,
  createWorkflowFromTemplate,
} from '@/lib/workflow';
import {
  workflowTemplates,
  getAllCategories,
  getTemplatesByCategory,
} from '@/lib/templates';
import { WorkflowBuilder } from './WorkflowBuilder';

interface DashboardProps {
  showChat?: boolean;
}

export function Dashboard({ showChat = true }: DashboardProps) {
  const [view, setView] = useState<'templates' | 'workflows' | 'builder'>(
    'templates'
  );
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkflowTemplate | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load workflows from localStorage
    const loadedWorkflows = getAllWorkflows();
    setWorkflows(loadedWorkflows);

    // Load categories
    const allCategories = getAllCategories();
    setCategories(['All', ...allCategories]);
  }, []);

  const handleCreateFromTemplate = (template: WorkflowTemplate) => {
    const newWorkflow = createWorkflowFromTemplate(
      template.id,
      template.steps
    );
    newWorkflow.name = template.name;
    newWorkflow.description = template.description;
    saveWorkflow(newWorkflow);
    setSelectedWorkflow(newWorkflow);
    setView('builder');
  };

  const handleSaveWorkflow = (workflow: Workflow) => {
    saveWorkflow(workflow);
    const updated = getAllWorkflows();
    setWorkflows(updated);
    setView('workflows');
  };

  const handleDeleteWorkflow = (id: string) => {
    const updated = workflows.filter((w) => w.id !== id);
    setWorkflows(updated);
    // Note: In a real app, you'd also delete from localStorage
  };

  const getDisplayTemplates = () => {
    let templates = workflowTemplates;

    if (selectedCategory && selectedCategory !== 'All') {
      templates = templates.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    return templates;
  };

  const getDisplayWorkflows = () => {
    let items = workflows;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.description.toLowerCase().includes(query)
      );
    }

    return items;
  };

  if (view === 'builder' && selectedWorkflow) {
    return (
      <WorkflowBuilder
        workflow={selectedWorkflow}
        onSave={handleSaveWorkflow}
        onBack={() => {
          setSelectedWorkflow(null);
          setView('workflows');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🤖 WorkflowAI
              </h1>
              <p className="text-gray-600 mt-1">
                AI-Powered Workflow Automation Platform
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setView('templates')}
              className={`px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                view === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📋 Templates
            </button>
            <button
              onClick={() => setView('workflows')}
              className={`px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                view === 'workflows'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              ⚙️ My Workflows
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'templates' && (
          <div>
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDisplayTemplates().map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="text-4xl mb-3">{template.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {template.steps.length} steps
                      </span>
                      <button
                        onClick={() => handleCreateFromTemplate(template)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getDisplayTemplates().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No templates found matching your search.
                </p>
              </div>
            )}
          </div>
        )}

        {view === 'workflows' && (
          <div>
            {/* My Workflows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDisplayWorkflows().map((workflow) => (
                <div
                  key={workflow.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {workflow.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {workflow.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          workflow.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {workflow.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {workflow.steps.length} steps
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setView('builder');
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {workflows.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg mb-4">
                  No workflows created yet.
                </p>
                <button
                  onClick={() => setView('templates')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create from Template
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
