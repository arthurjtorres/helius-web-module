// Interface para Códigos de Multa
export interface FineCodeInterface {
  fineCodeId?: string;
  fineDescription?: string;
  fineKm?: string;
  fineAlias?: string;
  fineOrder?: string;
}

// Interface para Motivos
export interface MotiveInterface {
  motivoId: number;
  motivoDescription: string;
  motivoCode: string;
  motivoActive: boolean;
}

// Interface para Empresas
export interface CompanyInterface {
  empresaId: number;
  empresaName: string;
  empresaCnpj: string;
  empresaCity: string;
  empresaState: string;
  empresaActive: boolean;
}

// Dados mockados - Códigos de Multa
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
    fineDescription: 'ART. 18 - INC. I - DECRETO 2751 - Transportar passageiros em pé',
    fineKm: '50',
    fineAlias: 'PASSAGEIROS EM PÉ',
    fineOrder: '1'
  },
  {
    fineCodeId: '5',
    fineDescription: 'ART. 22 - DECRETO 2751 - Não portar documentação obrigatória',
    fineKm: '30',
    fineAlias: 'SEM DOCUMENTAÇÃO',
    fineOrder: '2'
  },
  {
    fineCodeId: '6',
    fineDescription: 'ART. 25 - DECRETO 2751 - Veículo em condições inadequadas de segurança',
    fineKm: '40',
    fineAlias: 'SEGURANÇA INADEQUADA',
    fineOrder: '3'
  },
  {
    fineCodeId: '7',
    fineDescription: 'ART. 31 - DECRETO 2751 - Não utilizar cinto de segurança',
    fineKm: '25',
    fineAlias: 'SEM CINTO',
    fineOrder: '4'
  },
  {
    fineCodeId: '8',
    fineDescription: 'ART. 40 - DECRETO 2751 - Excesso de velocidade',
    fineKm: '60',
    fineAlias: 'EXCESSO VELOCIDADE',
    fineOrder: '5'
  }
];

// Dados mockados - Motivos
export const MOTIVO_DATA: MotiveInterface[] = [
  {
    motivoId: 1,
    motivoDescription: 'Atraso na saída do terminal',
    motivoCode: 'ATR-001',
    motivoActive: true
  },
  {
    motivoId: 2,
    motivoDescription: 'Problemas mecânicos no veículo',
    motivoCode: 'MEC-002',
    motivoActive: true
  },
  {
    motivoId: 3,
    motivoDescription: 'Condições climáticas adversas',
    motivoCode: 'CLI-003',
    motivoActive: true
  },
  {
    motivoId: 4,
    motivoDescription: 'Acidente de trânsito',
    motivoCode: 'ACI-004',
    motivoActive: true
  },
  {
    motivoId: 5,
    motivoDescription: 'Manifestação ou bloqueio de via',
    motivoCode: 'MAN-005',
    motivoActive: false
  },
  {
    motivoId: 6,
    motivoDescription: 'Falta de motorista',
    motivoCode: 'MOT-006',
    motivoActive: true
  },
  {
    motivoId: 7,
    motivoDescription: 'Manutenção preventiva',
    motivoCode: 'MNT-007',
    motivoActive: true
  },
  {
    motivoId: 8,
    motivoDescription: 'Vistoria técnica',
    motivoCode: 'VIS-008',
    motivoActive: false
  },
  {
    motivoId: 9,
    motivoDescription: 'Troca de veículo',
    motivoCode: 'TRV-009',
    motivoActive: true
  },
  {
    motivoId: 10,
    motivoDescription: 'Outros',
    motivoCode: 'OUT-010',
    motivoActive: true
  }
];

// Dados mockados - Empresas
export const EMPRESA_DATA: CompanyInterface[] = [
  {
    empresaId: 1,
    empresaName: 'Viação Cidade Ltda',
    empresaCnpj: '12.345.678/0001-90',
    empresaCity: 'São Paulo',
    empresaState: 'SP',
    empresaActive: true
  },
  {
    empresaId: 2,
    empresaName: 'Transportes Rápido Expresso',
    empresaCnpj: '23.456.789/0001-01',
    empresaCity: 'Rio de Janeiro',
    empresaState: 'RJ',
    empresaActive: true
  },
  {
    empresaId: 3,
    empresaName: 'Auto Viação Sul',
    empresaCnpj: '34.567.890/0001-12',
    empresaCity: 'Porto Alegre',
    empresaState: 'RS',
    empresaActive: true
  },
  {
    empresaId: 4,
    empresaName: 'Expresso Nacional',
    empresaCnpj: '45.678.901/0001-23',
    empresaCity: 'Belo Horizonte',
    empresaState: 'MG',
    empresaActive: false
  },
  {
    empresaId: 5,
    empresaName: 'Viação Nordeste',
    empresaCnpj: '56.789.012/0001-34',
    empresaCity: 'Recife',
    empresaState: 'PE',
    empresaActive: true
  },
  {
    empresaId: 6,
    empresaName: 'Transportadora Central',
    empresaCnpj: '67.890.123/0001-45',
    empresaCity: 'Brasília',
    empresaState: 'DF',
    empresaActive: true
  },
  {
    empresaId: 7,
    empresaName: 'Empresa de Ônibus Metropolitano',
    empresaCnpj: '78.901.234/0001-56',
    empresaCity: 'Curitiba',
    empresaState: 'PR',
    empresaActive: false
  }
];



/* HTML
<div class="apendix-container">
  <mat-tab-group animationDuration="300ms" class="tab-group">
    
    <!-- Aba 1: Códigos de Multa -->
    <mat-tab label="Códigos de Multa">
      <div class="tab-content">
        
        <!-- Search Bar e Botão Add -->
        <div class="search-container">
          <mat-form-field class="search-field" appearance="outline">
            <mat-label>Pesquisar</mat-label>
            <input matInput (keyup)="applyFineCodeFilter($event)" placeholder="Digite para buscar...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <button mat-fab color="primary" class="add-button" (click)="openFineCodeDialog()" 
                  aria-label="Adicionar novo código de multa">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <!-- Tabela -->
        <div class="table-container">
          <table mat-table [dataSource]="fineCodeSource" matSort #fineCodeSort="matSort" class="custom-table">
            
            <!-- Código Column -->
            <ng-container matColumnDef="fineCodeId">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="fineCodeId">Código</th>
              <td mat-cell *matCellDef="let element" class="fineCodeId">{{element.fineCodeId}}</td>
            </ng-container>

            <!-- Descrição Column -->
            <ng-container matColumnDef="fineDescription">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="fineDescription">Descrição</th>
              <td mat-cell *matCellDef="let element" class="fineDescription">{{element.fineDescription}}</td>
            </ng-container>

            <!-- KM Column -->
            <ng-container matColumnDef="fineKm">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="fineKm">KM</th>
              <td mat-cell *matCellDef="let element" class="fineKm">{{element.fineKm}}</td>
            </ng-container>

            <!-- Alias Column -->
            <ng-container matColumnDef="fineAlias">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="fineAlias">Alias</th>
              <td mat-cell *matCellDef="let element" class="fineAlias">{{element.fineAlias}}</td>
            </ng-container>

            <!-- Ordem Column -->
            <ng-container matColumnDef="fineOrder">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="fineOrder">Ordem</th>
              <td mat-cell *matCellDef="let element" class="fineOrder">{{element.fineOrder}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="fineCodeColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: fineCodeColumns;"></tr>
          </table>
        </div>

        <!-- Paginator -->
        <mat-paginator #fineCodePaginator 
                       [pageSizeOptions]="[5, 10, 25, 50]" 
                       [pageSize]="10"
                       showFirstLastButtons
                       class="custom-paginator">
        </mat-paginator>
      </div>
    </mat-tab>

    <!-- Aba 2: Motivos -->
    <mat-tab label="Motivos">
      <div class="tab-content">
        
        <!-- Search Bar e Botão Add -->
        <div class="search-container">
          <mat-form-field class="search-field" appearance="outline">
            <mat-label>Pesquisar</mat-label>
            <input matInput (keyup)="applyMotivoFilter($event)" placeholder="Digite para buscar...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <button mat-fab color="primary" class="add-button" (click)="openMotivoDialog()" 
                  aria-label="Adicionar novo motivo">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <!-- Tabela -->
        <div class="table-container">
          <table mat-table [dataSource]="motivoSource" matSort #motivoSort="matSort" class="custom-table">
            
            <!-- ID Column -->
            <ng-container matColumnDef="motivoId">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="motivoId">ID</th>
              <td mat-cell *matCellDef="let element" class="motivoId">{{element.motivoId}}</td>
            </ng-container>

            <!-- Descrição Column -->
            <ng-container matColumnDef="motivoDescription">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="motivoDescription">Descrição</th>
              <td mat-cell *matCellDef="let element" class="motivoDescription">{{element.motivoDescription}}</td>
            </ng-container>

            <!-- Código Column -->
            <ng-container matColumnDef="motivoCode">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="motivoCode">Código</th>
              <td mat-cell *matCellDef="let element" class="motivoCode">{{element.motivoCode}}</td>
            </ng-container>

            <!-- Ativo Column -->
            <ng-container matColumnDef="motivoActive">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="motivoActive">Ativo</th>
              <td mat-cell *matCellDef="let element" class="motivoActive">
                <mat-icon [class.active-icon]="element.motivoActive" [class.inactive-icon]="!element.motivoActive">
                  {{element.motivoActive ? 'check_circle' : 'cancel'}}
                </mat-icon>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="motivoColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: motivoColumns;"></tr>
          </table>
        </div>

        <!-- Paginator -->
        <mat-paginator #motivoPaginator 
                       [pageSizeOptions]="[5, 10, 25, 50]" 
                       [pageSize]="10"
                       showFirstLastButtons
                       class="custom-paginator">
        </mat-paginator>
      </div>
    </mat-tab>

    <!-- Aba 3: Empresas -->
    <mat-tab label="Empresas">
      <div class="tab-content">
        
        <!-- Search Bar e Botão Add -->
        <div class="search-container">
          <mat-form-field class="search-field" appearance="outline">
            <mat-label>Pesquisar</mat-label>
            <input matInput (keyup)="applyEmpresaFilter($event)" placeholder="Digite para buscar...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <button mat-fab color="primary" class="add-button" (click)="openEmpresaDialog()" 
                  aria-label="Adicionar nova empresa">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <!-- Tabela -->
        <div class="table-container">
          <table mat-table [dataSource]="empresaSource" matSort #empresaSort="matSort" class="custom-table">
            
            <!-- ID Column -->
            <ng-container matColumnDef="empresaId">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="empresaId">ID</th>
              <td mat-cell *matCellDef="let element" class="empresaId">{{element.empresaId}}</td>
            </ng-container>

            <!-- Nome Column -->
            <ng-container matColumnDef="empresaName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="empresaName">Nome</th>
              <td mat-cell *matCellDef="let element" class="empresaName">{{element.empresaName}}</td>
            </ng-container>

            <!-- CNPJ Column -->
            <ng-container matColumnDef="empresaCnpj">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="empresaCnpj">CNPJ</th>
              <td mat-cell *matCellDef="let element" class="empresaCnpj">{{element.empresaCnpj}}</td>
            </ng-container>

            <!-- Cidade Column -->
            <ng-container matColumnDef="empresaCity">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="empresaCity">Cidade</th>
              <td mat-cell *matCellDef="let element" class="empresaCity">{{element.empresaCity}}</td>
            </ng-container>

            <!-- Estado Column -->
            <ng-container matColumnDef="empresaState">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="empresaState">Estado</th>
              <td mat-cell *matCellDef="let element" class="empresaState">{{element.empresaState}}</td>
            </ng-container>

            <!-- Ativo Column -->
            <ng-container matColumnDef="empresaActive">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="empresaActive">Ativo</th>
              <td mat-cell *matCellDef="let element" class="empresaActive">
                <mat-icon [class.active-icon]="element.empresaActive" [class.inactive-icon]="!element.empresaActive">
                  {{element.empresaActive ? 'check_circle' : 'cancel'}}
                </mat-icon>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="empresaColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: empresaColumns;"></tr>
          </table>
        </div>

        <!-- Paginator -->
        <mat-paginator #empresaPaginator 
                       [pageSizeOptions]="[5, 10, 25, 50]" 
                       [pageSize]="10"
                       showFirstLastButtons
                       class="custom-paginator">
        </mat-paginator>
      </div>
    </mat-tab>

  </mat-tab-group>
</div>

*/

