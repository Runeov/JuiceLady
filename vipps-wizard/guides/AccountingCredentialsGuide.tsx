'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronUp, ChevronDown, Info, ExternalLink, Key, CheckCircle2 } from 'lucide-react';
import { useWizardBrand } from '../config';

interface Props {
  system: string;
  integrationPartner: string;
}

export function AccountingCredentialsGuide({ system, integrationPartner }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const brand = useWizardBrand();
  const isPowerOffice = system === 'poweroffice';

  const getPartnerConfig = () => {
    switch(integrationPartner) {
      case 'iizy':
        return {
          name: 'iizy',
          extensionName: 'iizy fakturaintegrasjon',
          url: 'https://www.poweroffice.no/utvidelser/vipps_iizy',
          description: 'Integrasjon levert av iizy for Vipps-oppgjør'
        };
      case 'emonkey':
        return {
          name: 'eMonkey',
          extensionName: 'Vipps - Levert av eMonkey',
          url: 'https://www.emonkey.no/integrasjoner/vipps',
          description: 'Integrasjon levert av eMonkey for Vipps-oppgjør'
        };
      case 'srh':
        return {
          name: 'SNN RH',
          extensionName: 'SNN RH - Vipps',
          url: 'https://www.poweroffice.no/utvidelser/vipps-snnrh',
          description: 'SpareBank 1 regnskapshuset sin Vipps-integrasjon'
        };
      default:
        return {
          name: 'Din integrasjonspartner',
          extensionName: 'Din integrasjon',
          url: '',
          description: 'Kontakt din integrasjonspartner for tilgang'
        };
    }
  };

  const partnerConfig = getPartnerConfig();

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-purple-600" aria-hidden="true" />
          <span className="font-semibold text-purple-900">
            Hvordan få API-tilgang i {isPowerOffice ? 'PowerOffice Go' : '24SevenOffice'}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-purple-600" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-purple-600" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="px-6 py-6 bg-white border-t border-purple-200 space-y-6">
          {isPowerOffice ? (
            /* PowerOffice Go Guide */
            <>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" aria-hidden="true" />
                  Om PowerOffice Go OAuth 2.0
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  PowerOffice Go bruker OAuth 2.0. Du trenger to nøkler:
                </p>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1 ml-2">
                  <li><strong>Application Key</strong> - Fra {partnerConfig.name}</li>
                  <li><strong>Client Key</strong> - Genereres automatisk når du godkjenner</li>
                </ul>
              </div>

              <div className="space-y-4">
                {/* Step 1: Login */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Logg inn på PowerOffice Go</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                      <a href="https://go.poweroffice.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        go.poweroffice.net
                        <span className="sr-only"> (åpnes i ny fane)</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                      <p className="text-xs text-gray-600 mt-1">Krever administrator-rettigheter</p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Navigate to Extensions */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Gå til Extensions</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                      <div className="bg-white border-2 border-purple-300 p-3 rounded font-mono text-xs space-y-1">
                        <div>Menu</div>
                        <div className="pl-4">→ Settings (Innstillinger)</div>
                        <div className="pl-8">→ Extensions (Utvidelser)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Find and Authorize */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Legg til og godkjenn «{partnerConfig.extensionName}»</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4">
                      <p className="text-gray-700">{partnerConfig.description}</p>

                      <div className="bg-white border-2 border-green-300 p-4 rounded-lg">
                        <p className="text-gray-900 font-semibold mb-3">Godkjenn integrasjonen:</p>
                        <ol className="space-y-3">
                          <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                            <div>
                              <p className="text-gray-800">I Extensions-listen, finn <strong className="text-purple-700">«{partnerConfig.extensionName}»</strong></p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                            <div>
                              <p className="text-gray-800">Klikk <strong className="text-green-700">«Authorize»</strong></p>
                            </div>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <div>
                            <p className="text-green-900 font-semibold text-sm">Client Key genereres automatisk!</p>
                            <p className="text-green-700 text-xs mt-1">
                              Når du godkjenner, genereres Client Key automatisk og sendes til {partnerConfig.name}.
                              Du vil ikke se den i PowerOffice av sikkerhetshensyn.
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-green-800 text-xs font-semibold mb-1">Slik vet du at det fungerte:</p>
                          <ul className="text-green-700 text-xs space-y-1 ml-4 list-disc">
                            <li>Status endres til <strong>«Active»</strong> eller <strong>«Connected»</strong></li>
                            <li>Integrasjonen vises under "Mine utvidelser"</li>
                          </ul>
                        </div>
                      </div>

                      {partnerConfig.url && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                          <p className="text-yellow-800 text-xs font-semibold mb-1">Finner du ikke «{partnerConfig.extensionName}»?</p>
                          <p className="text-yellow-700 text-xs mb-2">
                            Integrasjonen må kanskje bestilles/aktiveres først:
                          </p>
                          <a
                           href={partnerConfig.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                         >
                           Gå til {partnerConfig.name}
                           <span className="sr-only"> (åpnes i ny fane)</span>
                           <ExternalLink className="w-3 h-3" aria-hidden="true" />
                         </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4: Get Client Key from partner */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Hent Client Key fra {partnerConfig.name}</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-3">
                      <p className="text-gray-700">
                        Client Key vises ikke i PowerOffice. Hent den fra {partnerConfig.name}:
                      </p>

                      {integrationPartner === 'iizy' && (
                        <div className="bg-white border p-3 rounded">
                          <ol className="list-decimal list-inside text-xs text-gray-700 space-y-1 ml-2">
                            <li>Logg inn på <strong>iizy.no</strong></li>
                            <li>Gå til "Mine Integrasjoner" → "PowerOffice"</li>
                            <li>Client Key vises under "API Nøkler"</li>
                            <li>Klikk "Vis" eller "Copy" for å kopiere</li>
                          </ol>
                        </div>
                      )}

                      {integrationPartner === 'emonkey' && (
                        <div className="bg-white border p-3 rounded">
                          <ol className="list-decimal list-inside text-xs text-gray-700 space-y-1 ml-2">
                            <li>Logg inn på <strong>eMonkey kundeportal</strong></li>
                            <li>Gå til "PowerOffice Integrasjoner"</li>
                            <li>Client Key finnes under "API Tilgang"</li>
                            <li>Eller kontakt eMonkey support direkte</li>
                          </ol>
                        </div>
                      )}

                      {integrationPartner === 'srh' && (
                        <div className="bg-white border p-3 rounded">
                          <ol className="list-decimal list-inside text-xs text-gray-700 space-y-1 ml-2">
                            <li>Kontakt din <strong>bankrådgiver i SpareBank 1</strong></li>
                            <li>Be om Client Key for PowerOffice-integrasjonen</li>
                            <li>Banken henter nøkkelen fra SNN RH</li>
                          </ol>
                        </div>
                      )}

                      {integrationPartner === 'direct' && (
                        <div className="bg-white border p-3 rounded">
                          <p className="text-xs text-gray-700">
                            For direkte integrasjon genererer du selv nøklene via PowerOffice Developer Portal.
                          </p>
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                        <p className="text-blue-800 text-xs">
                          <strong>Tips:</strong> Kontakt {brand.companyName} etter at du har godkjent integrasjonen for hjelp med Client Key.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <Key className="w-5 h-5" aria-hidden="true" />
                  Sjekk at alt er korrekt
                </h4>
                <div className="space-y-2 text-sm text-green-800">
                  <p className="font-semibold">I PowerOffice Go → Settings → Extensions:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                    <li>«{partnerConfig.extensionName}» skal vise status <strong className="text-green-900">«Active»</strong></li>
                    <li>Hvis status er "Needs Authorization" → Gå tilbake til steg 3</li>
                    <li>Hvis integrasjonen ikke vises → Kontakt {partnerConfig.name}</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            /* 24SevenOffice Guide */
            <>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Om 24SevenOffice API</h4>
                <p className="text-sm text-blue-800">
                  24SevenOffice bruker API Keys (brukernavn og passord) som du genererer selv i systemet.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Logg inn på 24SevenOffice</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                      <a href="https://24sevenoffice.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        24sevenoffice.com
                        <span className="sr-only"> (åpnes i ny fane)</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                      <p className="text-xs text-gray-600 mt-1">Krever administrator-rettigheter</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Gå til API-integrasjoner</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                      <div className="bg-white border-2 border-purple-300 p-3 rounded font-mono text-xs space-y-1">
                        <div>Innstillinger (Settings/Verktøy)</div>
                        <div className="pl-4">→ Integrasjoner eller API</div>
                        <div className="pl-8">→ API-tilgang</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Generer API-nøkler</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                      <p className="text-gray-700">Klikk "Generer ny nøkkel" eller "Create API Key"</p>
                      <div className="bg-red-50 border-l-4 border-red-500 p-3">
                        <p className="text-red-900 font-semibold text-xs mb-1">Viktig!</p>
                        <p className="text-red-800 text-xs">
                          <strong>API Secret vises kun en gang!</strong> Kopier og lagre den umiddelbart.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Kopier nøklene</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-3">
                      <div>
                        <p className="text-gray-600 text-xs mb-1 font-semibold">API Key:</p>
                        <div className="bg-white border p-2 rounded font-mono text-xs text-gray-600">
                          a1b2c3d4-e5f6-7890-abcd-ef1234567890
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs mb-1 font-semibold">API Secret:</p>
                        <div className="bg-white border p-2 rounded font-mono text-xs text-gray-600">
                          X7mK9pL2nQ4rT8vB6cW1sD5eF3gH0jN...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Help Section */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-bold text-green-900 mb-3">Trenger du hjelp?</h4>
            <div className="grid gap-2 text-sm">
              <a
                href={isPowerOffice ? 'https://developer.poweroffice.net' : 'https://24sevenoffice.com/support'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                {isPowerOffice ? 'PowerOffice API dokumentasjon' : '24SevenOffice support'}
                <span className="sr-only"> (åpnes i ny fane)</span>
              </a>
              <a
                href={`mailto:${brand.supportEmail}`}
                className="text-green-700 hover:underline flex items-center gap-2"
              >
                <Key className="w-4 h-4" aria-hidden="true" />
                {brand.companyName} support: {brand.supportEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
