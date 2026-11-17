export interface VehicleInterface {
  vehicleId?: string;
  vehicleNumber: string;
  brand?: string;
  licensePlate?: string;
  chassisNumber?: string;
  fabricationYear?: string;
  modelYear?: string;
  renavan?: string;
  capacity?: number;
  model?: string;
  hasWifi?: boolean;
  cameraType?: string;

  fkVehicleCompanyId?: string;
  /** Empresa anexada pelo `operations` a partir do `registry`; nula ou ausente se o `registry` falhar. */
  company?: { companyName: string } | null;

  fkTypeVehicleId?: string;
  /** Tipo do veículo (alias `VehicleType` da API). */
  VehicleType?: VehicleTypeInterface | null;

  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}

  export enum CameraTypeEnum {
    TACOM = 'TACOM',
    ENGIS = 'ENGIS',
  };

  export interface VehicleTypeInterface {
  typeVehicleId?: string;
  typeVehicleName: string;
  airConditioner: boolean;

  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}


