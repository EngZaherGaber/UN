import { Component, Input } from '@angular/core';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { Router, ActivatedRoute } from '@angular/router';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { PdfService } from '../../../../general/services/pdf.service';
import { ToastService } from '../../../../general/services/toast.service';
import { CompanyAccountService } from '../../../services/company-account.service';
import { SalaryService } from '../../../services/salary.service';
import { switchMap, of, catchError } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { FileUploadModule } from 'primeng/fileupload';
import { CooService } from '../../../services/coo.service';

@Component({
  selector: 'app-coo-files',
  imports: [
    AdTemplateComponent,
    DynamicTableComponent,
    DynmaicFormComponent,
    CommonModule,
    DialogModule,
    FileUploadModule,
  ],
  templateUrl: './coo-files.component.html',
  styleUrl: './coo-files.component.scss'
})
export class CooFilesComponent {
  @Input() cooId: number = 0;
  info: InfoTable;
  resetObjs: { [key: string]: InputDynamic[] } = {};
  attachDialog: boolean = false;
  file: File | null = null;
  addFunc: () => void = () => {
    this.resetObjs = {
      general: [

      ]
    }
    this.attachDialog = true;
  }
  deleteAllFunc: () => void = () => {
    this.cooSrv.deleteAllFiles(this.cooId).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.info.getSub$.next(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
  deleteFunc: (rowData: any) => void = (rowData) => {
    this.cooSrv.deleteFile(this.cooId, rowData.fileName).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.info.getSub$.next(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
  downloadFunc: (rowData: any) => void = (rowData) => {
    this.cooSrv.downloadFiles(this.cooId, rowData.fileName).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = rowData.fileName; // Use the filename from the API or a default
      link.click();
      window.URL.revokeObjectURL(link.href); // Clean up
      this.msgSrv.showSuccess('Success!', '');
    })
  }

  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private router: Router,
    private salarySrv: SalaryService,
    private route: ActivatedRoute,
    private pdfSrv: PdfService,
    private companyAccountSrv: CompanyAccountService,
    private cooSrv: CooService
  ) {
    this.info = tblSrv.getStandardInfo(this.deleteFunc, this.downloadFunc, undefined, this.addFunc);
    this.info.captionButton.unshift({
      isShow: true,
      tooltip: 'Back',
      icon: 'pi pi-arrow-left',
      key: 'Back',
      severity: 'info',
      command: (rowData) => {
        router.navigate(['/admin/employee'])
      }
    })
    this.info.Buttons[1].icon = 'pi pi-download';
    this.info.Buttons[1].tooltip = 'download';

  }
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.cooId = +param['id'];
      this.info.get$ =
        this.info.getSub$.pipe(
          switchMap((body: any) => {
            if (body) {
              return this.cooSrv.getFiles(this.cooId).pipe(
                switchMap(res => {
                  return of({
                    data: res.data,
                    columns: [
                      {
                        field: 'fileName',
                        header: 'fileName',
                        HeaderType: 'string',
                      },
                    ],
                    loading: false,
                    count: res.count
                  })
                }),
                catchError(err => {
                  return of({
                    loading: false,
                    data: [],
                    columns: [
                      {
                        field: 'fileName',
                        header: 'fileName',
                        HeaderType: 'string',
                      },
                    ],
                  });
                }),

              )
            } else {
              return of({
                loading: false,
                data: [],
                columns: [
                  {
                    field: 'fileName',
                    header: 'fileName',
                    HeaderType: 'string',
                  },
                ],
              });
            }
          })
        );
      this.info.getSub$.next(true)
    })
  }
  onBasicUploadAuto(event: any) {
    console.log(event);
    this.file = event.files[0];
  }
  attach(event: any) {
    this.cooSrv.upload(this.cooId, this.file).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.attachDialog = false;
        this.file = null;
        this.info.getSub$.next(true)
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }
}
