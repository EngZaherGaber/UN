export interface Contract {
    id?: number;
    employeeId: number,
    clientId: number,
    teamId: number,
    cooId: number,
    cooNumber: string,
    contractSigned: boolean,
    contractStartDate: Date,
    contractEndDate: Date,
    cityId: number,
    tittle: string,
    salary: number,
    transportation: boolean,
    laptopTypeId: number,
    isMobile: boolean,
    typeOfContractId: number,
    insuranceLife: boolean,
    insuranceMedical: boolean,
    superVisor: string,
    areaManager: string,
    projectName: string,
    status: string
}
