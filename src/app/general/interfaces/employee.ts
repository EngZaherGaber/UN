export interface Employee {
    personal: {
        refNo: number,
        empName: string,
        arabicName: string,
        motherNameArabic: string,
        fatherNameArabic: string,
        idNo: string,
        emailAddress: string,
        mobileNo: number,
        gender: 0,
        securityCheck: boolean,
        oldEmployment: boolean,
    },
    bankInfo: {
        bankId: number,
        typeOfAcc: string,
        accountNumber: string,
        isDelegated:boolean
    },
}
