import React from 'react';
import { Check } from 'lucide-react';
import { WizardConfig, IntegrationPartner } from '../types';

interface Props {
  config: WizardConfig;
  updateConfig: (key: string, value: any) => void;
  integrationPartners: IntegrationPartner[];
}

export function IntegrationPartnerStep({ config, updateConfig, integrationPartners }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Integration Partner</h2>
        <p className="text-gray-600">Select middleware for settlement reconciliation</p>
      </div>

      <div className="grid gap-4">
        {integrationPartners.map((partner) => (
          <button
            key={partner.id}
            onClick={() => updateConfig('integrationPartner', partner.id)}
            className={`p-5 rounded-lg border-2 transition-all text-left ${
              config.integrationPartner === partner.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{partner.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{partner.description}</p>
              </div>
              {config.integrationPartner === partner.id && (
                <Check className="w-6 h-6 text-orange-500 flex-shrink-0" aria-hidden="true" />
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Pricing: {partner.pricing}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

