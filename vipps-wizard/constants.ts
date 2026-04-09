import { ShoppingCart, CreditCard, Users, Gift, BarChart3 } from 'lucide-react';
import { Module, IntegrationPartner, WizardConfig } from './types';

export const modules: Module[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Checkout',
    description: 'Integrate with WooCommerce, Shopify for online sales',
    icon: ShoppingCart,
    apis: ['Checkout API', 'ePayment API'],
    vippsProduct: 'Vipps på Nett'
  },
  {
    id: 'recurring',
    name: 'Recurring Payments',
    description: 'Memberships, subscriptions, and recurring donations',
    icon: CreditCard,
    apis: ['Recurring API'],
    vippsProduct: 'Vipps Faste Betalinger'
  },
  {
    id: 'donations',
    name: 'Donations & Events',
    description: 'QR codes and payment links for fundraising',
    icon: Gift,
    apis: ['Donations API', 'ePayment API'],
    vippsProduct: 'Vipps Nummer'
  },
  {
    id: 'pos',
    name: 'POS/Kiosk Payments',
    description: 'In-person sales with Vipps Number or QR codes',
    icon: Users,
    apis: ['ePayment API'],
    vippsProduct: 'Vipps Nummer'
  },
  {
    id: 'reconciliation',
    name: 'Settlement Reconciliation',
    description: 'Daily automatic sync of transactions and settlements',
    icon: BarChart3,
    apis: ['Report API', 'Management API'],
    required: true
  }
];

export const integrationPartners: IntegrationPartner[] = [
  {
    id: 'iizy',
    name: 'iizy',
    description: 'Bank-independent middleware solution',
    features: ['Daily settlement import', 'Fee calculation', 'MVA handling', 'Multi-entity support'],
    pricing: '150-500 kr/month',
    url: 'https://iizy.no',
    contactEmail: 'support@iizy.no',
  },
  {
    id: 'srh',
    name: 'SRH Oppgjør (SpareBank 1)',
    description: 'Integrated solution for SpareBank 1 customers',
    features: ['Bank integration', 'Automated posting', 'Settlement reports'],
    pricing: 'Contact bank',
    url: 'https://smnregnskap.no',
    contactEmail: 'support@smnregnskap.no',
  },
  {
    id: 'emonkey',
    name: 'Emonkey',
    description: 'Middleware / integration partner for Vipps settlement import',
    features: ['Daily settlement import', 'Automated posting', 'Reconciliation support'],
    pricing: 'Contact Emonkey',
    url: 'https://emonkey.no',
    contactEmail: 'support@emonkey.no',
  },
  {
    id: 'direct',
    name: 'Direct Integration',
    description: 'Build your own integration using APIs',
    features: ['Full control', 'Custom workflows', 'Requires development'],
    pricing: 'Developer time',
    url: '',
  }
];

export const initialConfig: WizardConfig = {
  accountingSystem: '',
  modules: [],
  companyName: '',
  orgNumber: '',
  organizationType: '',
  vippsClientId: '',
  vippsClientSecret: '',
  vippsMerchantSerialNumber: '',
  vippsSubscriptionKey: '',
  accountingApiKey: '',
  accountingApiSecret: '',
  integrationPartner: '',
  accounts: {
    vippsInterim: '1580',
    bankAccount: '1920',
    salesIncome: '3100',
    salesIncomeMVA: '3000',
    fees: '7770',
    roundingDiff: '7778'
  },
  mvaSettings: {
    enabled: false,
    threshold: 50000,
    defaultCode: '0'
  },
  features: {
    autoBooking: true,
    eFaktura: false,
    ocrEnabled: false,
    loginWithVipps: false
  }
};
