'use client';

import React, { useState } from 'react';
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useWizardBrand } from '../config';

export function TroubleshootingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const brand = useWizardBrand();

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600" aria-hidden="true" />
          <h3 className="font-semibold text-gray-900">Troubleshooting Guide</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="p-6">
          <p className="text-sm text-gray-600">
            For full troubleshooting guide, contact <a href={`mailto:${brand.supportEmail}`} className="text-blue-600 hover:underline">{brand.supportEmail}</a>
          </p>
        </div>
      )}
    </div>
  );
}
