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
    backgroundcheck: {
        medicalCheck: boolean,
        oldEmployment: boolean,
        securityCheck: boolean
    },
    bankInfo: {
        bankId: number,
        typeOfAcc: string,
        accountNumber: string
    },
    contractInfo: {
        clientId: number,
        teamId: number,
        cooId: number,
        cooPoId: string,
        contractSigned: boolean,
        contractStartDate: Date,
        contractEndDate: Date,
        cityId: number,
        tittle: string,
        salary: 2147483647,
        transportation: boolean,
        laptop: number,
        isMobile: boolean,
        typeOfContractId: number,
        insuranceLife: boolean,
        startLifeDate: Date,
        endLifeDate: Date,
        insuranceMedical: boolean,
        superVisor: string,
        areaManager: string,
        projectName: string,
        active: boolean
    }
}
