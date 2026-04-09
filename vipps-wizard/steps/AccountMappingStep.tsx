import React from 'react';
import { WizardConfig } from '../types';

interface Props {
  config: WizardConfig;
  updateNested: (parent: string, key: string, value: any) => void;
}

export function AccountMappingStep({ config, updateNested }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Chart of Accounts</h2>
        <p className="text-gray-600">Map transactions to accounting accounts (NS 4102)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vipps Interim Account
          </label>
          <input
            type="text"
            value={config.accounts.vippsInterim}
            onChange={(e) => updateNested('accounts', 'vippsInterim', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Default: 1580</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Account
          </label>
          <input
            type="text"
            value={config.accounts.bankAccount}
            onChange={(e) => updateNested('accounts', 'bankAccount', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Default: 1920</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sales Income (VAT Free)
          </label>
          <input
            type="text"
            value={config.accounts.salesIncome}
            onChange={(e) => updateNested('accounts', 'salesIncome', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Fees
          </label>
          <input
            type="text"
            value={config.accounts.fees}
            onChange={(e) => updateNested('accounts', 'fees', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

