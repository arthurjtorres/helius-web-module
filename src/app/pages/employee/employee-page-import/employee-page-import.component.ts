import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { EmployeeService } from '../../../core/services/employee.service';
import { ImportEmployee } from '../../../core/interfaces/employee.interface';
import { CompanyService } from '../../../core/services/company.service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee-page-import',
  standalone: false,
  templateUrl: './employee-page-import.component.html',
  styleUrl: './employee-page-import.component.scss'
})
export class EmployeePageImportComponent implements OnInit {

  companyId: string = '';
  companyAcronym: string = '';
  companies: any[] = []; // Carregar do seu service de empresas
  parsedData: ImportEmployee[] = [];
  displayedColumns: string[] = ['registration', 'fullName', 'admissionDate', 'position', 'birthDate'];

  isLoading = false;
  progress: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<EmployeePageImportComponent>
  ) { }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources() {
    forkJoin({
      companies: this.companyService.getAll(),
    }).subscribe({
      next: (response: any) => {
        this.companies = response.companies.data;
      }
    });
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file || !this.companyAcronym) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.txt')) {
      this.parseTxt(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      this.parseExcel(file);
    }
  }

  async parseTxt(file: File) {
    const text = await file.text();
    const lines = text.split("\n");

    // 1. Encontrar a linha do cabeçalho e a linha tracejada
    const separatorIndex = lines.findIndex(l => l.includes('-----'));
    if (separatorIndex === -1) {
      alert("Formato de arquivo inválido: linha separadora não encontrada.");
      return;
    }

    const header = lines[separatorIndex - 1]; // A linha logo acima dos traços
    const dataLines = lines.slice(separatorIndex + 1); // Tudo abaixo dos traços

    // 2. Mapear as posições iniciais de cada coluna
    // Usamos o nome exato que aparece no seu cabeçalho
    const pos = {
      chapa: header.indexOf('CHAPAFUNC'),
      nome: header.indexOf('NOMECOMPLETOFUNC'),
      adm: header.indexOf('DTADMFUNC'),
      funcao: header.indexOf('DESCFUNCAO'),
      nasc: header.indexOf('DTNASCTOFUNC'),
      cpf: header.indexOf('CPF') // Tentará buscar se existir
    };

    // 3. Processar as linhas
    this.parsedData = dataLines
      .filter(linha => linha.trim().length > 10) // Ignora linhas vazias ou rodapés
      .map(linha => {
        return {
          // O substring vai da posição atual até a posição da próxima coluna conhecida
          registration: `${this.companyAcronym}-${linha.substring(pos.chapa, pos.nome).trim()}`,
          fullName: linha.substring(pos.nome, pos.adm).trim(),

          // Se o CPF existir no cabeçalho, lemos entre ele e a admissão
          cpf: pos.cpf !== -1 ? linha.substring(pos.cpf, pos.adm).trim() : null,

          admissionDate: linha.substring(pos.adm, pos.funcao).trim(),
          position: linha.substring(pos.funcao, pos.nasc).trim(),
          birthDate: linha.substring(pos.nasc).trim()
        };
      });
  }


  parseExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Converte para JSON (assume que a primeira linha são os nomes das colunas)
      const data = XLSX.utils.sheet_to_json(ws);

      this.parsedData = data.map((row: any) => ({
        registration: `${this.companyAcronym}-${row.MATRICULA}`,
        fullName: row.NOMECOMPLETO,
        admissionDate: row.DATAADMISSÃO,
        position: row.FUNCAO,
        birthDate: row.DATANASCIMENTO
      }));
    };
    reader.readAsBinaryString(file);
  }

  async enviarParaAPI() {
  if (!this.parsedData.length || !this.companyId) return;

  this.isLoading = true;
  const loteSize = 50;
  const lotes = this.chunkArray(this.parsedData, loteSize);
  let lotesEnviados = 0;
  
  try {
    for (const lote of lotes) {
      const payload = {
        companyId: this.companyId,
        employees: lote
      };

      await firstValueFrom(this.employeeService.bulkInsert(payload));
      
      lotesEnviados++;
      this.progress = Math.round((lotesEnviados / lotes.length) * 100);
      console.log(`Lote ${lotesEnviados} de ${lotes.length} enviado.`);
    }

    alert("Todos os funcionários foram importados com sucesso!");
    this.dialogRef.close(true);

  } catch (err: any) {
    console.error("Erro durante a importação em lotes:", err);
    alert(`Erro ao importar o lote ${lotesEnviados + 1}. O processo foi interrompido.`);
  } finally {
    this.isLoading = false;
  }
}

  onCompanyChange(selectedId: string) {
    const selectedCompany = this.companies.find(c => c.companyId === selectedId);
    if (selectedCompany) {
      this.companyAcronym = selectedCompany.companyAcronym;
    }
  }

  private chunkArray(array: any[], size: number) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
