import React from 'react';
import { Check, Info } from 'lucide-react';

export function WelcomeStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Check className="w-10 h-10 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Vipps MobilePay Integration Setup</h2>
        <p className="text-lg text-gray-600">Complete integration in 10 minutes</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" aria-hidden="true" />
          What you'll need:
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span><strong>Vipps Portal access</strong> with BankID</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span><strong>PowerOffice Go</strong> or 24SevenOffice API credentials</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span><strong>Signing authority</strong> for your organization</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

