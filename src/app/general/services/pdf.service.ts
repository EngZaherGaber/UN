import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';



@Injectable({
  providedIn: 'root'
})

export class PdfService {
  units = ['', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع'];
  teens = ['عشرة', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'];
  tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  hundreds = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];
  scales = ['', 'ألف', 'مليون', 'مليار', 'تريليون'];
  templatePath = 'templates/'; // Path in public folder
  formData = {
    name: '',
    date: new Date().toISOString().split('T')[0],
    address: '',
    // Add other fields as needed
  };
  isLoading = false;

  constructor(private http: HttpClient) { }

  

  convertToSyrianPounds(amount: number): string {
    if (amount === 0) return 'صفر ليرة سورية';
    return `${this.convertNumber(amount)} ليرة سورية فقط لا غير.`;
  }

  convertNumber(num: number): string {
    if (num === 1) return 'ليرة واحدة';
    if (num === 2) return 'ليرتان';
    if (num >= 3 && num <= 10) return `${this.toWords(num)} ليرات`;

    let result = this.toWords(num);
    return result + ' ';
  }

  toWords(num: number): string {
    if (num === 0) return '';
    if (num < 10) return this.units[num];
    if (num < 20) return this.teens[num - 10];
    if (num < 100) {
      const unit = num % 10;
      const ten = Math.floor(num / 10);
      return unit === 0 ? this.tens[ten] : `${this.units[unit]} و${this.tens[ten]}`;
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return `${this.hundreds[hundred]}${remainder ? ' و' + this.toWords(remainder) : ''}`;
    }

    for (let i = 1; i < this.scales.length; i++) {
      const scaleValue = Math.pow(1000, i);
      if (num < scaleValue * 1000) {
        const scaleAmount = Math.floor(num / scaleValue);
        const remainder = num % scaleValue;
        const scaleWord = this.getScaleWord(scaleAmount, i);
        return `${this.toWords(scaleAmount)} ${scaleWord}${remainder ? ' و' + this.toWords(remainder) : ''}`;
      }
    }
    return '';
  }

  getScaleWord(amount: number, scaleIndex: number): string {
    if (amount === 1) return this.scales[scaleIndex];
    if (amount === 2) return this.scales[scaleIndex] + 'ان';
    if (amount >= 3 && amount <= 10) return this.scales[scaleIndex];
    return this.scales[scaleIndex];
  }

}
