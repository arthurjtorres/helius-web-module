export interface EmployeeView {
  employeeId: string;
  registration: string;
  admissionDate?: string;
  fullName?: string;
  birthDate?: string;
  activated: boolean;
  company?: string;
  position?: string;
  // FKs para facilitar a edição
  fkPersonId: string; 
  fkCompanyId?: string;
  fkPositionId?: string;
  fkSectorId?: string;
  fkDepartmentId?: string;
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
  /** Da pessoa; só na edição (T27). */
  fullName?: string;
  birthDate?: string;
}

/** Funcionário como o `registry` devolve em `GET /employee` (associações incluídas). */
export interface EmployeeApi extends EmployeeDTO {
  employeeId: string;
  activated: boolean;
  Person?: { fullName: string; birthDate: string };
  Company?: { companyName: string };
  Position?: { positionName: string };
}
