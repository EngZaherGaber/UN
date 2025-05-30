import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
interface TransferData {
  branch: string;
  amount: number;
  accountFrom: string;
  accountTo: string;
  recipientName: string;
  serviceType: string;
  date: string;
}

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
  months = [
    'كانون الثاني',
    'شباط',
    'اذار',
    'نيسان',
    'ايار',
    'حزيران',
    'تموز',
    'اب',
    'ايلول',
    'تشرين الاول',
    'تشرين الثاني',
    'كانون الاول',
  ]
  englishMonths = [
    'January',    // كانون الثاني
    'February',   // شباط
    'March',      // اذار
    'April',      // نيسان
    'May',        // ايار
    'June',       // حزيران
    'July',       // تموز
    'August',     // اب
    'September',  // ايلول
    'October',    // تشرين الاول
    'November',   // تشرين الثاني
    'December'    // كانون الاول
  ]
  isLoading = false;

  constructor() {


  }

  downloadAsPDF() {
    const element = document.getElementById('a4-document') as HTMLElement;
    console.log(element)
    html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('document.pdf');
    });
  }
  convertToSyrianPounds(amount: number): string {
    if (amount === 0) return 'صفر ليرة سورية';
    return `${this.convertNumber(amount)} ليرة سورية `;
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
  convertToPounds(amount: number): string {
    if (amount === 0) return 'zero SYP';
    return `${this.convertNumberEng(amount)} SYP`;
  }

  convertNumberEng(num: number): string {
    if (num === 1) return 'one';
    return this.toWordsEng(num);
  }

  toWordsEng(num: number): string {
    if (num === 0) return 'zero';

    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

    let result = '';

    // Process scales in reverse order (billions, millions, thousands, etc.)
    for (let i = scales.length - 1; i >= 0; i--) {
      const scaleValue = Math.pow(1000, i);
      if (num >= scaleValue) {
        const scaleAmount = Math.floor(num / scaleValue);
        num %= scaleValue;
        if (scaleAmount > 0) {
          result += this.convertLessThanThousandEng(scaleAmount, units, tens, teens) + ' ' + scales[i] + ' ';
        }
      }
    }

    // Convert remaining amount (less than 1000)
    if (num > 0) {
      result += this.convertLessThanThousandEng(num, units, tens, teens);
    }

    return result.trim().replace(/\s+/g, ' ');
  }

  private convertLessThanThousandEng(num: number, units: string[], tens: string[], teens: string[]): string {
    let result = '';

    // Hundreds
    if (num >= 100) {
      result += units[Math.floor(num / 100)] + ' hundred ';
      num %= 100;
    }

    // Tens and units
    if (num >= 20) {
      result += tens[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) {
        result += '-' + units[num];
      }
    } else if (num >= 10) {
      result += teens[num - 10];
    } else if (num > 0) {
      result += units[num];
    }

    return result.trim();
  }
}
