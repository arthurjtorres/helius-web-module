export interface DocumentInterface {
  documentId?: string;
  documentType: string;
  documentNumber: string;
  documentPhoto?: Blob;
  orgEmitter?: string;
  uf?: string;
  issueDate?: Date;
  validationDate?: Date;
  motherName?: string;
  fatherName?: string;
  fkPersonId: string;

  
}

export enum DocumentTypeEnum {
  RG = "RG",
  CNH = "CNH",
  CPF = "CPF",
  CTPS = "CTPS",
  PASSAPORTE = "PASSAPORTE",
}