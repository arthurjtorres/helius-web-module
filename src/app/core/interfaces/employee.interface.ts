export interface EmployeeView {
  employeeId: string;
  registration: string;
  admissionDate: string;
  fullName: string;
  birthDate: string;
  activated: boolean;
  companyName: string;
  positionName: string;
  // FKs para facilitar a edição
  fkPersonId: string; 
  fkCompanyId: string;
  fkPositionId: string;
  fkSectorId: string;
  fkDepartmentId: string;
}

export interface EmployeeDTO {
  employeeId?: string;
  registration: string;
  admissionDate?: string;
  fkPersonId: string;
  fkCompanyId?: string;
  fkPositionId?: string;
  fkSectorId?: string;
  fkDepartmentId?: string;
}

export interface ImportEmployee {
  registration: string;
  fullName: string;
  admissionDate: string;
  position: string;
  birthDate: string;
}