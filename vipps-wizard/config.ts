'use client';

import React, { createContext, useContext } from 'react';

export interface WizardBrandConfig {
  /** Company name shown in UI (e.g., "Restaurant Matglede") */
  companyName: string;
  /** Support email shown in help sections and mailto links */
  supportEmail: string;
  /** Greeting name for email body (defaults to companyName) */
  emailTeamName?: string;
  /** Accent color hex for primary buttons (defaults to '#E86C1F') */
  accentColor?: string;
  /** Secondary accent color for gradients (defaults to accentColor) */
  accentColorSecondary?: string;
  /** Pre-select specific module IDs (e.g., ['pos', 'reconciliation'] for restaurants) */
  defaultModules?: string[];
}

export const DEFAULT_BRAND_CONFIG: WizardBrandConfig = {
  companyName: 'Your Company',
  supportEmail: 'support@example.com',
  accentColor: '#E86C1F',
  accentColorSecondary: '#F4B223',
};

const WizardBrandContext = createContext<WizardBrandConfig>(DEFAULT_BRAND_CONFIG);

export function WizardBrandProvider({
  config,
  children,
}: {
  config: WizardBrandConfig;
  children: React.ReactNode;
}) {
  const merged: WizardBrandConfig = {
    ...DEFAULT_BRAND_CONFIG,
    ...config,
    accentColor: config.accentColor || DEFAULT_BRAND_CONFIG.accentColor,
    accentColorSecondary:
      config.accentColorSecondary || config.accentColor || DEFAULT_BRAND_CONFIG.accentColorSecondary,
  };

  return React.createElement(WizardBrandContext.Provider, { value: merged }, children);
}

export function useWizardBrand(): WizardBrandConfig {
  return useContext(WizardBrandContext);
}
