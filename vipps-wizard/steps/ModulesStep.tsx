import React from 'react';
import { Check } from 'lucide-react';
import { WizardConfig, Module } from '../types';

interface Props {
  config: WizardConfig;
  modules: Module[];
  toggleModule: (moduleId: string) => void;
}

export function ModulesStep({ config, modules, toggleModule }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Integration Modules</h2>
        <p className="text-gray-600">Select the Vipps features you need</p>
      </div>

      <div className="grid gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          const isSelected = config.modules.includes(module.id) || module.required;

          return (
            <button
              key={module.id}
              onClick={() => !module.required && toggleModule(module.id)}
              disabled={module.required}
              className={`p-5 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-orange-600' : 'text-gray-600'}`} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{module.name}</h3>
                    {module.required && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                </div>
                {isSelected && (
                  <Check className="w-6 h-6 text-orange-500 flex-shrink-0" aria-hidden="true" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

