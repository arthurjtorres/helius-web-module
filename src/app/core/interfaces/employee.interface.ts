export interface EmployeeInterface {
  employeeId: string;
  registration: string;
  admissionDate: string;
  fullName: string;
  birthDate: string;
  activated: boolean;
  // Campos de exibição (Strings)
  companyName: string;
  positionName: string;
  // Campos de ID (para o formulário/selects)
  fkEmployeeCompanyId?: string;
  fkEmployeePositionId?: string;
  fkSectorId?: string;
  fkDepartmentId?: string;
  
}
