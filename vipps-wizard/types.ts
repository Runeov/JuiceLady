import { LucideIcon } from 'lucide-react';

export interface WizardConfig {
  accountingSystem: string;
  modules: string[];
  companyName: string;
  orgNumber: string;
  organizationType: string;
  vippsClientId: string;
  vippsClientSecret: string;
  vippsMerchantSerialNumber: string;
  vippsSubscriptionKey: string;
  accountingApiKey: string;
  accountingApiSecret: string;
  integrationPartner: string;
  accounts: {
    vippsInterim: string;
    bankAccount: string;
    salesIncome: string;
    salesIncomeMVA: string;
    fees: string;
    roundingDiff: string;
  };
  mvaSettings: {
    enabled: boolean;
    threshold: number;
    defaultCode: string;
  };
  features: {
    autoBooking: boolean;
    eFaktura: boolean;
    ocrEnabled: boolean;
    loginWithVipps: boolean;
  };
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  apis: string[];
  vippsProduct?: string;
  required?: boolean;
}

export interface IntegrationPartner {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricing: string;
  url: string;
  /** Contact email for secure config delivery */
  contactEmail?: string;
}

export interface StepProps {
  config: WizardConfig;
  updateConfig: (key: string, value: any) => void;
  updateNested: (parent: string, key: string, value: any) => void;
}

export interface ModulesStepProps extends StepProps {
  modules: Module[];
  toggleModule: (moduleId: string) => void;
}

export interface IntegrationPartnerStepProps extends StepProps {
  integrationPartners: IntegrationPartner[];
}
