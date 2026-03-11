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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">🤖</div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    WorkflowAI
                  </h1>
                  <p className="text-gray-300 mt-1 text-sm">
                    AI-Powered Workflow Automation Platform
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  {workflows.length}
                </div>
                <p className="text-gray-400 text-sm">
                  Workflow{workflows.length !== 1 ? 's' : ''} Created
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setView('templates')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 backdrop-blur-md border ${
                view === 'templates'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              📋 Templates
            </button>
            <button
              onClick={() => setView('workflows')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 backdrop-blur-md border ${
                view === 'workflows'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              ⚙️ My Workflows
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Content */}
          {view === 'templates' && (
            <div>
              {/* Category Filter */}
              <div className="mb-8 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-md border ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/20 scale-105'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
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
                    onMouseEnter={() => setHoveredCard(template.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group cursor-pointer backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-105 transform"
                  >
                    <div className="p-8 h-full flex flex-col">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {template.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:text-transparent group-hover:bg-clip-text transition-all">
                        {template.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {template.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-3 py-1 text-xs bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-200 rounded-full border border-purple-500/30 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-sm text-gray-400 font-semibold">
                          ⚙️ {template.steps.length} Steps
                        </span>
                        <button
                          onClick={() => handleCreateFromTemplate(template)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1"
                        >
                          Use Template →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getDisplayTemplates().length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-xl">
                    ❌ No templates found matching your search.
                  </p>
                </div>
              )}
            </div>
          )}

          {view === 'workflows' && (
            <div>
              {workflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-7xl mb-6">📋</div>
                  <p className="text-gray-400 text-xl mb-8">
                    No workflows created yet. Let's get started!
                  </p>
                  <button
                    onClick={() => setView('templates')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 text-lg"
                  >
                    ✨ Create from Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getDisplayWorkflows().map((workflow) => (
                    <div
                      key={workflow.id}
                      onMouseEnter={() => setHoveredCard(workflow.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-105 transform p-8 flex flex-col"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:text-transparent group-hover:bg-clip-text transition-all">
                        {workflow.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                        {workflow.description}
                      </p>
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-block px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm border ${
                              workflow.status === 'draft'
                                ? 'bg-yellow-600/30 text-yellow-200 border-yellow-500/30'
                                : 'bg-green-600/30 text-green-200 border-green-500/30'
                            }`}
                          >
                            {workflow.status === 'draft' ? '📝' : '✓'} {workflow.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-semibold">
                          {workflow.steps.length} Steps
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            setView('builder');
                          }}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="px-4 py-3 border-2 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all duration-300 hover:border-red-500/50"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
