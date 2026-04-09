import React from 'react';
import { Check } from 'lucide-react';
import { WizardConfig } from '../types';

interface Props {
  config: WizardConfig;
  updateConfig: (key: string, value: any) => void;
}

export function AccountingSystemStep({ config, updateConfig }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Accounting System</h2>
        <p className="text-gray-600">Choose your bookkeeping platform</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => updateConfig('accountingSystem', '24sevenoffice')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            config.accountingSystem === '24sevenoffice'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">24SevenOffice</h3>
              <p className="text-gray-600 mt-1">Cloud-based ERP system</p>
            </div>
            {config.accountingSystem === '24sevenoffice' && (
              <Check className="w-6 h-6 text-orange-500 flex-shrink-0" />
            )}
          </div>
        </button>

        <button
          onClick={() => updateConfig('accountingSystem', 'poweroffice')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            config.accountingSystem === 'poweroffice'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">PowerOffice Go</h3>
              <p className="text-gray-600 mt-1">API-first accounting software</p>
            </div>
            {config.accountingSystem === 'poweroffice' && (
              <Check className="w-6 h-6 text-orange-500 flex-shrink-0" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

