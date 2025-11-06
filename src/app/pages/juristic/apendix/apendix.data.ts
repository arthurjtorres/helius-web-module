export interface FineCodeInterface {
  fineCodeId?: string;
  fineDescription?: string;
  fineKm?: string;
  fineAlias?: string;
  fineOrder?: string;
}

export interface MotiveInterface {
  motiveName?: string;
  motiveCode?: string;
}

export interface CompanyInterface {
  companyName?: string;
  companyCode?: string;
  corporation?: string;
}


export const FINECODE_DATA: FineCodeInterface[] = [
  {
    fineCodeId: '1',
    fineDescription: 'ART. 15 - INC. VII - DECRETO 2751 - N/89 - Operar veículo com catraca em mau estado de conservação',
    fineKm: '50',
    fineAlias: '',
    fineOrder: '99999'
  },
  {
    fineCodeId: '2',
    fineDescription: 'ART. 15 - INC. VII - DECRETO 2751 - N/89  - Operar veículo com lacre violado.',
    fineKm: '50',
    fineAlias: '',
    fineOrder: '99999'
  },
  {
    fineCodeId: '3',
    fineDescription: 'ART. 30  - DECRETO 2751 - N/89  -  Manter no veículo extintor de incendio com controle de revisão vencido  ou sem o mesmo.',
    fineKm: '30',
    fineAlias: '',
    fineOrder: '99999'
  },

  {
    fineCodeId: '4',
    fineDescription: 'ART. 30  - DECRETO 2751 - N/89  -   Manter no veículo extintor de incendio com defeito (manômetro emperrado)',
    fineKm: '30',
    fineAlias: '',
    fineOrder: '99999'
  },
  {
    fineCodeId: '5',
    fineDescription: 'ART. 30 - DECRETO  2751 - N/89  -  Manter no veículo extintor de incêndio sem trava de segurança.',
    fineKm: '30',
    fineAlias: '',
    fineOrder: '99999'
  },
  {
    fineCodeId: '6',
    fineDescription: 'ART. 30 - DECRETO  2751 - N/89  -   Manter no veículo extintor de incêndio descarregado.',
    fineKm: '30',
    fineAlias: '',
    fineOrder: '99999'
  },
  {
    fineCodeId: '7',
    fineDescription: 'ART. 15 INC.  V - ART. 37 - DECRETO 2751 - N/89 - Utilizar pneus em condições inadequadas.',
    fineKm: '50',
    fineAlias: 'Pneu Ruim',
    fineOrder: '99999'
  },
  {
    fineCodeId: '8',
    fineDescription: 'ART. 16 - § 2  -  DECRETO  2751 - N/89 - Operar veículo sem o quadro de identificação da tripulação e tarifa.',
    fineKm: '10',
    fineAlias: '',
    fineOrder: '99999'
  }
];

export const MOTIVE_DATA: MotiveInterface[] = [
  {
    motiveName: 'ACIDENTE',
    motiveCode: '1',
    
  },
  {
    motiveName: 'ANÁLISE',
    motiveCode: '2',
    
  },
  {
    motiveName: 'CONDUTA DO COBRADOR',
    motiveCode: '3',
    
  },
  {
    motiveName: 'CONDUTA DO MOTORISTA',
    motiveCode: '4',
    
  },
  {
    motiveName: 'FALHA DE GARAGEM',
    motiveCode: '5',
    
  },
  {
    motiveName: 'FALHA FISCALIZAÇÃO',
    motiveCode: '6',
    
  },
  {
    motiveName: 'FALHA MECÂNICA',
    motiveCode: '7',
    
  },
  {
    motiveName: 'NOTIFICAÇÃO ERRADA',
    motiveCode: '8',
    
  },
  
];

export const COMPANY_DATA: CompanyInterface[] = [
  {
    companyCode: 'AS01',
    companyName: 'ATLÂNTICO SUL',
    corporation: 'AS'
  },
  {
    companyCode: 'AS11',
    companyName: 'METROPOLITANA',
    corporation: 'AS'
  },
  {
    companyCode: 'AS12',
    companyName: 'PRAIA SOL',
    corporation: 'AS'
  },
  {
    companyCode: 'AS13',
    companyName: 'VEREDA',
    corporation: 'AS'
  },
  {
    companyCode: 'AS14',
    companyName: 'SERRAMAR',
    corporation: 'AS'
  },
  {
    companyCode: 'AS15',
    companyName: 'METROPOLITANA',
    corporation: 'AS'
  },
  {
    companyCode: 'AS16',
    companyName: 'METROPOLITANA',
    corporation: 'AS'
  },
  {
    companyCode: 'SW02',
    companyName: 'SUDOESTE',
    corporation: 'SW',
  },
  {
    companyCode: 'SW21',
    companyName: 'SANTA ZITA',
    corporation: 'SW',
  },
  {
    companyCode: 'SW22',
    companyName: 'NOVA TRANSPORTE',
    corporation: 'SW',
  },
]