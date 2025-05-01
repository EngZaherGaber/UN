export interface Invoice {
  coos: [
    {
      cooNumber: string,
      cooDate: Date,
      employess: [
        {
          empName: string,
          arabicName: string,
          salaryUsd: number,
          payableSalaryUsd: number,
          payableSalarySYP: number,
          transportion: number,
          mobile: number,
          laptop: number
        }
      ]
    }
  ]
}