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
import { ClientService } from '../../../services/client.service';
import { TeamService } from '../../../services/team.service';
import { CooService } from '../../../services/coo.service';
import { CityService } from '../../../services/city.service';
import { TypeOfContractService } from '../../../services/type-of-contract.service';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { LaptopTypeService } from '../../../services/laptop-type.service';

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
      header: 'superVisor',
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
      field: 'laptop',
      header: 'Laptop Type',
      HeaderType: 'string',
    },
    {
      field: 'typeOfContractName',
      header: 'Type Of Contract Name',
      HeaderType: 'string',
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
  addDialog: boolean = false;
  displayDialog: boolean = false;
  editDialog: boolean = false;
  lists: {
    clients: { id: number, name: string }[],
    teams: { id: number, name: string }[],
    cities: { id: number, name: string }[],
    cooSrv: { id: number, name: string }[],
    typesOfContracts: { id: number, name: string }[],
    laptopTypes: { id: number, name: string }[],
  } = {
      clients: [],
      teams: [],
      cities: [],
      cooSrv: [],
      typesOfContracts: [],
      laptopTypes: [],
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
  cancelFunc: (rowData: Contract) => void = (rowData: Contract) => {
    this.confirm.deleteConfirm((obj) => {
      this.contractSrv.cancel(obj).subscribe(res => {
        this.msgSrv.showSuccess('Success!', 'Contract Canceled');
        this.info.getSub$.next({})
      });
    }, rowData.id, 'Are You Need to Cancel This Contract?')
  }

  constructor(
    tblSrv: DyTableService,
    private msgSrv: ToastService,
    private router: Router,
    private contractSrv: ContractService,
    private confirm: ConfirmService,
    private route: ActivatedRoute,
    clientSrv: ClientService,
    teamSrv: TeamService,
    cooSrv: CooService,
    citySrv: CityService,
    typeOfContractSrv: TypeOfContractService,
    laptopTypeSrv: LaptopTypeService
  ) {
    this.info = tblSrv.getStandardInfo(this.cancelFunc, this.editFunc, this.displayFunc, this.addFunc);
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
    this.info.Buttons[0].showCommand = (rowData) => {
      return new Date(rowData.contractEndDate) > new Date()
    };
    forkJoin({
      clients: clientSrv.getAll(),
      teams: teamSrv.getAll(),
      cities: citySrv.getAll(),
      cooSrv: cooSrv.getAll({}),
      typesOfContracts: typeOfContractSrv.getAll(),
      laptopTypeSrv: laptopTypeSrv.getAll(),
    }).subscribe(res => {
      this.lists = {
        clients: res.clients.data.map(x => {
          return {
            id: x.clientId,
            name: x.clientName
          }
        }),
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
        cooSrv: res.cooSrv.data.map(x => {
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

  add(event: any) {
    this.contractSrv.add(event).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }

    })
    this.addDialog = false;
    this.info.getSub$.next({});
  }
  edit(event: any) {
    this.contractSrv.edit(event, this.editContractId).subscribe(res => {
      if (res.success) {
        this.msgSrv.showSuccess('Success!', res.message);
      } else {
        this.msgSrv.showError('Error!', res.message);
      }
    })
    this.editDialog = false;
    this.info.getSub$.next({});
  }

  getGeneralObj(
    employeeId: number,
    contract?: Contract
  ) {
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
          label: 'Client',
          value: this.emp.id,
          dataType: 'list',
          required: true,
          visible: false,
          options: [],
        },
        {
          key: 'clientId',
          label: 'Client',
          value: contract?.clientId,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.lists.clients,
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
          dataType: 'list',
          required: true,
          visible: true,
          options: this.lists.cooSrv,
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
          key: 'laptop',
          label: 'Laptop Type',
          value: contract?.laptop,
          dataType: 'list',
          required: true,
          visible: true,
          options: this.lists.laptopTypes,
        },
        {
          key: 'contractStartDate',
          label: 'Contract Start Date',
          value: contract?.contractStartDate,
          dataType: 'DateTime',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'contractEndDate',
          label: 'Contract End Date',
          value: contract?.contractEndDate,
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
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'areaManager',
          label: 'Area Manager',
          value: contract?.areaManager,
          dataType: 'string',
          required: true,
          visible: true,
          options: [],
        },
        {
          key: 'projectName',
          label: 'Project Name',
          value: contract?.projectName,
          dataType: 'string',
          required: true,
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
