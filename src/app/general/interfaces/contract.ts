export interface Contract {
    id?: number;
    employeeId: number,
    clientId: number,
    teamId: number,
    cooId: number,
    contractSigned: boolean,
    contractStartDate: Date,
    contractEndDate: Date,
    cityId: number,
    tittle: string,
    salary: number,
    transportation: boolean,
    laptop: number,
    isMobile: boolean,
    typeOfContractId: number,
    insuranceLife: boolean,
    insuranceMedical: boolean,
    superVisor: string,
    areaManager: string,
    projectName: string
}
