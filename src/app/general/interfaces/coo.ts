export interface COO {
    cooId: number,
    cooNumber: string,
    cooDate: Date,
    totalValue: number,
    clientId: number,
    currencyTypeId: number,
    employeeCoos: { employeeName: string, arabicName: string }[],
    lifeInsurances: { startDate: string, endDate: string }[],
    poNumber: string,
    unEmps: { empName: string }[]
}
