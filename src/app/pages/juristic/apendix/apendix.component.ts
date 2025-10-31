import { Component } from '@angular/core';
import { FineCodeInterface } from './reference.interface';

const FINECODE_DATA: FineCodeInterface[] = [
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
]

@Component({
  selector: 'app-apendix',
  standalone: false,
  templateUrl: './apendix.component.html',
  styleUrl: './apendix.component.scss'
})
export class ApendixComponent {
  
  fineCodeHeader: string[] = [
    'fineCodeId',
    'fineDescription',
    'fineKm',
    'fineAlias',
    'fineOrder'
  ];
  fineCodeSource = FINECODE_DATA;
}
