import { Component, Input } from '@angular/core';
import { ContractService } from '../../../services/contract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, catchError, forkJoin } from 'rxjs';
import { InfoTable } from '../../../../general/interfaces/info-table';
import { ConfirmService } from '../../../../general/services/confirm.service';
import { DyTableService } from '../../../../general/services/dy-table.service';
import { ToastService } from '../../../../general/services/toast.service';
import { DynamicTableComponent } from '../../../../general/components/dynamic-table/dynamic-table.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { Contract } from '../../../../general/interfaces/contract';
import { TeamService } from '../../../services/team.service';
import { CooService } from '../../../services/coo.service';
import { CityService } from '../../../services/city.service';
import { TypeOfContractService } from '../../../services/type-of-contract.service';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { LaptopTypeService } from '../../../services/laptop-type.service';
import { DynamicAttributeService } from '../../../../general/services/dynamic-attribute.service';

@Component({
  selector: 'app-em-contract',
  imports: [DynamicTableComponent, AdTemplateComponent, DialogModule, CommonModule, DynmaicFormComponent],
  templateUrl: './em-contract.component.html',
  styleUrl: './em-contract.component.scss'
})
export class EmContractComponent {
  info: InfoTable;
  columns = [

    {
      field: 'status',
      header: 'Status',
      HeaderType: 'tag',
    },
    {
      field: 'employeeName',
      header: 'English Name',
      HeaderType: 'string',
    },
    {
      field: 'arabicName',
      header: 'Arabic Name',
      HeaderType: 'string',
    },
    {
      field: 'cooNumber',
      header: 'COO Number',
      HeaderType: 'string',
    },
    {
      field: 'contractDuration',
      header: 'contractDuration',
      HeaderType: 'string',
    },
    {
      field: 'salary',
      header: 'salary',
      HeaderType: 'int',
    },
    {
      field: 'tittle',
      header: 'tittle',
      HeaderType: 'string',
    },
    {
      field: 'teamName',
      header: 'teamName',
      HeaderType: 'string',
    },
    {
      field: 'transportation',
      header: 'transportation',
      HeaderType: 'bool',
    },
    {
      field: 'contractStartDate',
      header: 'contractStartDate',
      HeaderType: 'DateTime',
    },
    {
      field: 'contractEndDate',
      header: 'contractEndDate',
      HeaderType: 'DateTime',
    },
    {
      field: 'cityName',
      header: 'cityName',
      HeaderType: 'string',
    },
    {
      field: 'typeOfContract',
      header: 'typeOfContract',
      HeaderType: 'string',
    },
    {
      field: 'superVisor',
      header: 'Supervisor',
      HeaderType: 'string',
    },
    {
      field: 'projectName',
      header: 'projectName',
      HeaderType: 'string',
    },
    {
      field: 'areaManager',
      header: 'areaManager',
      HeaderType: 'string',
    },
    {
      field: 'clientName',
      header: 'Client Name',
      HeaderType: 'string',
    },
    {
      field: 'cityName',
      header: 'City Name',
      HeaderType: 'string',
    },
    {
      field: 'laptopType',
      header: 'Laptop Type',
      HeaderType: 'string',
    },
    {
      field: 'isMobile',
      header: 'Have Mobile',
      HeaderType: 'bool',
    },
  ]
  @Input() emp: { id: number, name: string } = { id: 0, name: '' };
  resetObjs: { [key: string]: InputDynamic[] } = {};
  disableAtt: { [key: string]: string[] } = {
    general: ['cooId']
  };
  returnIfDisable: { [key: string]: string[] } = {
    general: ['cooId']
  };
  editContractId: number = 0;
  selectedRow: Contract | null = null;

  addDialog: boolean = false;
  displayDialog: boolean = false;
  editDialog: boolean = false;
  cancelDialog: boolean = false;
  lists: {
    teams: { id: number, name: string }[],
    cities: { id: number, name: string }[],
    coos: { id: number, name: string }[],
    typesOfContracts: { id: number, name: string }[],
    laptopTypes: { id: number, name: string }[],
  } = {
      teams: [],
      cities: [],
      coos: [],
      typesOfContracts: [],
      laptopTypes: [],
    };
  cancelObjs: { [key: string]: InputDynamic[] } = {
    general: [
      {
        key: 'contractEndDate',
        label: 'Contract End Date',
        value: null,
        startValidation: true,
        dataType: 'DateTime',
        required: true,
        visible: true,
        options: [],
      },
    ]
  };

  addFunc: () => void = () => {
    this.resetObjs = this.getGeneralObj(this.emp.id, undefined)
    this.addDialog = true;
  }
  editFunc: (rowData: Contract) => void = (rowData: Contract) => {
    this.editContractId = rowData.id ?? 0;
    this.contractSrv.getById(this.editContractId).subscribe(res => {
      this.resetObjs = this.getGeneralObj(this.emp.id, res.data)
      this.editDialog = true;
    })
  }
  displayFunc: (rowData: Contract) => void = (rowData: Contract) => {
    this.editContractId = rowData.id ?? 0;
    this.contractSrv.getById(this.editContractId).subscribe(res => {
      this.resetObjs = this.getGeneralObj(this.emp.id, res.data)
      this.displayDialog = true;
    })
  }
  getSeverity(rowData: any) {
    switch (rowData.status) {
      case 'Cancelled':
        return 'danger';
      case 'Expired':
        return 'info';
      case 'Active':
        return 'success';
      default:
        return 'secondary'
    }
  }
  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private router: Router,
    private contractSrv: ContractService,
    private confirm: ConfirmService,
    private route: ActivatedRoute,
    private attSrv: DynamicAttributeService,
    teamSrv: TeamService,
    cooSrv: CooService,
    citySrv: CityService,
    typeOfContractSrv: TypeOfContractService,
    laptopTypeSrv: LaptopTypeService
  ) {
    this.info = tblSrv.getStandardInfo((rowData: Contract) => { this.cancelDialog = true; this.selectedRow = rowData }, this.editFunc, this.displayFunc, this.addFunc);
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
    this.info.Buttons[0].icon = 'pi pi-times';
    this.info.Buttons[0].tooltip = 'Cancel Contract';
    this.info.Buttons[0].isShow = false;
    this.info.Buttons[0].showCommand = (rowData: Contract) => {
      return rowData.status.toLowerCase().includes('active')
    };

    forkJoin({
      teams: teamSrv.getAll(),
      cities: citySrv.getAll(),
      coos: cooSrv.getAllWithoutPagination(),
      typesOfContracts: typeOfContractSrv.getAll(),
      laptopTypeSrv: laptopTypeSrv.getAll(),
    }).subscribe(res => {
      this.lists = {
        teams: res.teams.data.map(x => {
          return {
            id: x.teamId ?? 0,
            name: x.teamName
          }
        }),
        cities: res.cities.data.map(x => {
          return {
            id: x.cityId,
            name: x.nameEn
          }
        }),
        coos: res.coos.data.map(x => {
          return {
            id: x.cooId,
            name: x.cooNumber
          }
        }),
        typesOfContracts: res.typesOfContracts.data.map(x => {
          return {
            id: x.typeOfContractId,
            name: x.nmaeEn
          }
        }),
        laptopTypes: res.laptopTypeSrv.data,
      }
    })
  }
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      if (this.emp.id === 0) {
        this.emp.id = +param['id']
        this.emp.name = param['name']
      }
      this.info.get$ =
        this.info.getSub$.pipe(
          switchMap((body: any) => {
            if (body) {
              return this.contractSrv.getAll(body, this.emp.id).pipe(
                switchMap(res => {
                  return of({
                    data: res.data,
                    columns: this.columns,
                    loading: false,
                    count: res.count
                  })
                }),
                catchError(err => {
                  return of({
                    loading: false,
                    data: [],
                    columns: this.columns,
                  });
                }),

              )
            } else {
              return of({
                loading: false,
                data: [],
                columns: this.columns,
              });
            }
          })
        );
    })
  }

  cancel(event: any) {
    event.contractEndDate = this.attSrv.getStringDate(event.contractEndDate)
    this.contractSrv.cancel(event, this.selectedRow && this.selectedRow.id ? this.selectedRow.id : 0).subscribe(res => {
      this.cancelDialog = false;
      this.msgSrv.showSuccess('Success!', 'Contract Canceled');
      this.info.getSub$.next({})
    });
  }
  add(event: any) {
    this.contractSrv.add(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.addDialog = false;
        this.info.getSub$.next({});
      } else {
        this.msgSrv.showError('Error!', res.message);
      }

    })
  }
  edit(event: any) {
    this.contractSrv.edit(event, this.editContractId).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
        this.editDialog = false;
        this.info.getSub$.next({});
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
  }

  getGeneralObj(
    employeeId: number,
    contract?: Contract,
  ): { [key: string]: InputDynamic[] } {
    return {
      general: [
        {
          key: 'tittle',
          label: 'Title',
          value: contract?.tittle,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'employeeId',
          label: 'employee',
          value: this.emp.id,
          dataType: 'list',
          required: true,
          visible: false,
          options: [],
        },
        {
          key: 'teamId',
          label: 'Team',
          value: contract?.teamId,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.lists.teams,
        },
        {
          key: 'cooId',
          label: 'COO',
          value: contract?.cooId,
          dataType: 'autoComplete',
          required: true,
          visible: true,
          options: contract ? [{ id: contract?.cooId, name: contract?.cooNumber }] : this.lists.coos,
        },
        {
          key: 'typeOfContractId',
          label: 'Type Of Contract',
          value: contract?.typeOfContractId,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.lists.typesOfContracts,
        },
        {
          key: 'cityId',
          label: 'City',
          value: contract?.cityId,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.lists.cities,
        },
        {
          key: 'laptopTypeId',
          label: 'Laptop Type',
          value: contract?.laptopTypeId,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.lists.laptopTypes,
        },
        {
          key: 'contractStartDate',
          label: 'Contract Start Date',
          value: contract?.contractStartDate,
          startValidation: true,
          dataType: 'DateTime',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'contractEndDate',
          label: 'Contract End Date',
          value: contract?.contractEndDate,
          startValidation: true,
          dataType: 'DateTime',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'transportation',
          label: 'Transportation',
          value: contract ? contract.transportation : null,
          dataType: 'bool',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'isMobile',
          label: 'Have Mobile',
          value: contract ? contract.isMobile : null,
          dataType: 'bool',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'insuranceLife',
          label: 'Insurance Life',
          value: contract ? contract.insuranceLife : null,
          dataType: 'bool',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'insuranceMedical',
          label: 'Insurance Medical',
          value: contract ? contract.insuranceMedical : null,
          dataType: 'bool',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'superVisor',
          label: 'Supervisor',
          value: contract?.superVisor,
          dataType: 'string',
          required: false,
          visible: true,
          options: [],
        },
        {
          key: 'areaManager',
          label: 'Area Manager',
          value: contract?.areaManager,
          dataType: 'string',
          required: false,
          visible: true,
          options: [],
        },
        {
          key: 'projectName',
          label: 'Project Name',
          value: contract?.projectName,
          dataType: 'string',
          required: false,
          visible: true,
          options: [],
        },
        {
          key: 'salary',
          label: 'Salary',
          value: contract?.salary,
          dataType: 'int',
          required: true,
          visible: true,
          options: [],
        },
      ],
    };
  }
}
