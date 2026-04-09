import React from 'react';
import { WizardConfig } from '../types';

interface Props {
  config: WizardConfig;
  updateConfig: (key: string, value: any) => void;
}

export function OrganizationInfoStep({ config, updateConfig }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Information</h2>
        <p className="text-gray-600">Enter your company details</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            value={config.companyName}
            onChange={(e) => updateConfig('companyName', e.target.value)}
            placeholder="e.g., Restaurant Matglede AS"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Number *
          </label>
          <input
            type="text"
            value={config.orgNumber}
            onChange={(e) => updateConfig('orgNumber', e.target.value)}
            placeholder="e.g., 123456789"
            maxLength={9}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Type *
          </label>
          <select
            value={config.organizationType}
            onChange={(e) => updateConfig('organizationType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select type...</option>
            <option value="as">AS (Aksjeselskap)</option>
            <option value="idrettslag">Idrettslag (Sports Club)</option>
            <option value="forening">Forening (Association)</option>
            <option value="nonprofit">Non-profit Organization</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
