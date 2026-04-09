import React from 'react';
import { WizardConfig } from '../types';
import { AccountingCredentialsGuide, PowerOfficeClientKeyGuide } from '../guides';

interface Props {
  config: WizardConfig;
  updateConfig: (key: string, value: any) => void;
}

export function AccountingApiStep({ config, updateConfig }: Props) {
  const isPowerOffice = config.accountingSystem === 'poweroffice';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isPowerOffice ? 'PowerOffice Go' : '24SevenOffice'} API Access
        </h2>
        <p className="text-gray-600">Configure API authentication</p>
      </div>

      {/* How-to Guide - Show appropriate guide based on accounting system */}
      {isPowerOffice ? (
        <PowerOfficeClientKeyGuide integrationPartner={config.integrationPartner} />
      ) : (
        <AccountingCredentialsGuide 
          system={config.accountingSystem} 
          integrationPartner={config.integrationPartner} 
        />
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isPowerOffice ? 'Client Key' : 'API Secret'} * 🔒
          </label>
          <input
            type="password"
            value={config.accountingApiSecret}
            onChange={(e) => updateConfig('accountingApiSecret', e.target.value)}
            placeholder={isPowerOffice ? 'Lim inn klientnøkkel fra PowerOffice Go' : 'Your API Secret'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}