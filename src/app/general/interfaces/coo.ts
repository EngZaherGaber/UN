export interface COO {
    cooId:number,
    cooNumber: string,
    cooDate: Date,
    totalValue: number,
    clientId: number,
    currencyId: number,
    employeeCoos: { employeeName: string }[],
    lifeInsurances: { startDate: string, endDate: string }[],
    purchaseOrders: { orderNumber: string }[],
    unEmps: { empName: string }[]
}
