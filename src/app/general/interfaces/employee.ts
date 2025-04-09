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
        gender: 0
    },
    bankInfo: {
        bankId: number,
        typeOfAcc: string,
        accountNumber: string
    },
}
