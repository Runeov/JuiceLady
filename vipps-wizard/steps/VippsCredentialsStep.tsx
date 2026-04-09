import React from 'react';
import { WizardConfig } from '../types';
import { VippsCredentialsGuide } from '../guides';
import { integrationPartners } from '../constants';

interface Props {
  config: WizardConfig;
  updateConfig: (key: string, value: any) => void;
}

export function VippsCredentialsStep({ config, updateConfig }: Props) {
  const isEmonkey = config.integrationPartner === 'emonkey';
  const integrationPartnerName =
    integrationPartners.find((p) => p.id === config.integrationPartner)?.name || config.integrationPartner;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vipps MobilePay API Credentials</h2>
        <p className="text-gray-600">
          {isEmonkey
            ? 'For eMonkey trenger du MSN (Merchant Serial Number) og å bekrefte valgt regnskapspartner. Client ID/Secret håndteres av integrasjonspartner.'
            : 'Enter credentials from Vipps Developer Portal'}
        </p>
      </div>

      {/* How-to Guide - Expandable */}
      <VippsCredentialsGuide integrationPartner={config.integrationPartner} />

      <div className="space-y-4">
        {!isEmonkey && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID *
              </label>
              <input
                type="text"
                value={config.vippsClientId}
                onChange={(e) => updateConfig('vippsClientId', e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret * 🔒
              </label>
              <input
                type="password"
                value={config.vippsClientSecret}
                onChange={(e) => updateConfig('vippsClientSecret', e.target.value)}
                placeholder="Enter your Client Secret"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant Serial Number (MSN) *
          </label>
          <input
            type="text"
            value={config.vippsMerchantSerialNumber}
            onChange={(e) => updateConfig('vippsMerchantSerialNumber', e.target.value)}
            placeholder="123456"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {isEmonkey ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bekreft regnskapspartner *
            </label>
            <input
              type="text"
              value={config.vippsSubscriptionKey}
              onChange={(e) => updateConfig('vippsSubscriptionKey', e.target.value)}
              placeholder={integrationPartnerName}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Skriv inn navnet på integrasjonspartneren du valgte (f.eks. <strong>EMONKEY</strong> eller{' '}
              <strong>eMonkey AS</strong>).
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Key (Optional)
            </label>
            <input
              type="password"
              value={config.vippsSubscriptionKey}
              onChange={(e) => updateConfig('vippsSubscriptionKey', e.target.value)}
              placeholder="For Report API access"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}

