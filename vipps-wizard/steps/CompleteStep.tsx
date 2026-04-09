'use client';

import React from 'react';
import { Check, Download, ExternalLink } from 'lucide-react';
import { WizardConfig } from '../types';
import { useWizardBrand } from '../config';
import { TroubleshootingGuide } from '../guides';

interface Props {
  config: WizardConfig;
  configData: Record<string, unknown>;
  downloadConfig: () => void;
  openExampleJson: () => void;
  generateImplementationGuide: () => void;
  sendEmail: () => void;
}

export function CompleteStep({
  config,
  configData,
  downloadConfig,
  openExampleJson,
  generateImplementationGuide,
  sendEmail
}: Props) {
  const brand = useWizardBrand();
  const accent = brand.accentColor ?? '#E86C1F';
  const accentSecondary = brand.accentColorSecondary ?? accent;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="w-10 h-10 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Oppsett fullført!</h2>
        <p className="text-lg text-gray-600">Konfigurasjonen din er klar</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Oppsummering</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Organisasjon:</span>
            <span className="font-medium">{config.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Regnskapssystem:</span>
            <span className="font-medium capitalize">{config.accountingSystem}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Integrasjonspartner:</span>
            <span className="font-medium capitalize">{config.integrationPartner}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Primary: Download config */}
        <button
          onClick={downloadConfig}
          className="w-full text-white px-6 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(to right, ${accent}, ${accentSecondary})`,
          }}
        >
          <Download className="w-5 h-5" aria-hidden="true" />
          Last ned konfigurasjon (JSON)
        </button>

        {/* Secondary options */}
        <button
          onClick={openExampleJson}
          className="w-full bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-6 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-200"
        >
          <ExternalLink className="w-5 h-5" aria-hidden="true" />
          Se demo-konfigurasjon
        </button>

        <button
          onClick={generateImplementationGuide}
          className="w-full bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-6 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-200"
        >
          <Download className="w-5 h-5" aria-hidden="true" />
          Last ned implementeringsguide (TXT)
        </button>

        <button
          onClick={sendEmail}
          className="w-full bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-6 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-200"
        >
          <Check className="w-5 h-5" aria-hidden="true" />
          Send e-post til {brand.companyName}
        </button>
      </div>

      <TroubleshootingGuide />
    </div>
  );
}
