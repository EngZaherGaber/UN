export interface Insurance {
    employeeId: number,
    empName: string,
    arabicName: string,
    insuranceLife: boolean,
    insuranceMedical: boolean,
    insuranceCardDelivered: boolean,
    insuranceCardDeliveredDate: Date,
    startLifeDate: Date,
    endLifeDate: Date,
    startMedicalDate: Date,
    endMedicalDate: Date,
    sendInsuranceDate: Date,
    stauts: string,
    daysRemainingLife: number,
    daysRemainingMedical: number
}
