import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DyButton } from '../../interfaces/dy-button';
import { UnSpinnerComponent } from '../un-spinner/un-spinner.component';
import { MultiSelectModule } from 'primeng/multiselect';
import * as XLSX from 'xlsx';

@Component({
  selector: 'dynamic-table',
  imports: [
    TableModule,
    ToggleSwitchModule,
    TooltipModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    UnSpinnerComponent,
    ToolbarModule,
    TagModule,
    MultiSelectModule
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent {
  @ViewChild('dt') table: Table | undefined;
  @ContentChild('rowExpansionContent', { static: true })
  rowExpansionContent: TemplateRef<any> | null = null;
  @Input() load: Observable<any> = new Observable();
  @Input() buttons: DyButton[] = [];
  @Input() historyPermission: string = '';
  @Input() title: string = '';
  @Input() sortColumn: string = '';
  @Input() tableName: string = '';
  @Input() uniqueState: string = '';
  @Input() dataKey: string = 'id';
  @Input() scrollHeight: string = '40vh';
  @Input() expandedTable: boolean = false;
  @Input() changeColor: (rowData: any) => any = () => { };
  @Input() getSeverity: (rowData: any) => "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined = () => { return 'secondary' };
  @Output() hitAction: EventEmitter<{ key: string; rowDataId: number }> =
    new EventEmitter<{ key: string; rowDataId: number }>();
  @Input() captionButton: DyButton[] = [];
  @Input() columnsEvent: {
    field: string;
    command?: (event: any, field: string, rowData: any) => void;
    permission?: string;
    visible?: (rowData: any) => boolean;
    disable?: (field: string, rowData: any) => boolean;
  }[] = [];
  @Input() lazyLoading: boolean = false;
  @Output() RowExpand: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLazy: EventEmitter<any> = new EventEmitter<any>();
  filterdMode: boolean = false;
  tb: Table | undefined;
  body: {
    loading: boolean;
    data: any[];
    columns: any[];
  } = {
      loading: true,
      data: [],
      columns: [],
    };
  first: number = 0;
  rows: number = 5;
  totalRecords: number = 0;
  screenWidth = window.innerWidth;
  carsoulPage: number = 1;
  columns: string[] = [];
  selectedColumns: string[] = [];
  constructor() { }

  ngOnInit(): void { }
  ngAfterContentInit(): void {
    this.load.subscribe((body) => {
      if (this.columnsEvent && this.columnsEvent.length > 0) {
        this.columnsEvent.forEach((col) => {
          if (!col.visible) {
            col.visible = (rowData) => true;
          }
          if (!col.disable) {
            col.disable = (rowData) => false;
          }
        });
      }
      this.repeairHeader(body.columns);
      body.data =
        body.data.length > 0
          ? (body.data as any[]).map((row) => {
            row.buttons = this.buttons.map((button) => ({ ...button }));
            (body.columns as any[])
              .filter(
                (col) =>
                  col.HeaderType.toLowerCase() === 'datetime' ||
                  col.HeaderType.toLowerCase() === 'datetimeo'
              )
              .forEach((col) => {
                if (row[col.field]) {
                  const date = new Date(row[col.field]);
                  row[col.field] = date;
                } else {
                  row[col.field] = null;
                }
              });
            return row;
          })
          : body.data;
      if (this.sortColumn) {
        body.data = body.data.sort((a: any, b: any) =>
          a[this.sortColumn]?.localeCompare(b[this.sortColumn])
        );
      }
      (body.columns as any[])
        .filter((x) => x.HeaderType === 'json')
        .forEach((x) => {
          body.data = (body.data as any[]).map((z) => {
            z[x.field] = z[x.field] ? JSON.parse(z[x.field]) : {};
            return z;
          });
        });
      this.columns = (body.columns as any[]).map(x => x.header);
      this.selectedColumns = this.columns;
      this.totalRecords = this.lazyLoading ? body.count : body.data.length;
      this.body = body;
    });
  }
  ngAfterViewInit() {
    if (this.table && this.table.expandedRowKeys) {
      this.table.expandedRowKeys = {};
      let infoTable;
      if (infoTable && infoTable['expandedRowKeys']) {
        infoTable['expandedRowKeys'] ? delete infoTable['expandedRowKeys'] : '';
      }
    } else {
      this.onLazy.emit(event);
    }
  }
  getFullDate(date: string) {
    const originalDate: Date = new Date(date);
    const day = String(originalDate.getDate()).padStart(2, '0');
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const year = originalDate.getFullYear();
    const hours = String(originalDate.getHours()).padStart(2, '0');
    const minutes = String(originalDate.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
  isSelect(header: string): boolean {
    return this.selectedColumns.includes(header);
  }
  loadCarsLazy(event: any) {
    this.onLazy.emit(event);
  }
  clearFilter() {
    this.table?.reset();
  }
  repeairHeader(
    columns: { field: string; header: string; HeaderType: string }[]
  ) {
    columns.map((col) => {
      col.header = col.header.replace(/([a-z])([A-Z])/g, '$1 $2');
      if (col.header.toLowerCase().endsWith(' id')) {
        col.header = col.header.slice(0, -3);
      }
      col.header = col.header.replace('_', ' ');
      col.header = col.header.charAt(0).toUpperCase() + col.header.slice(1);
    });
  }
  exportExcel() {
    let arr = this.table?.filteredValue ?? this.table?.value;
    if (arr && arr.length > 0) {
      arr = arr.map((x) => {
        let z: any= {};
        this.body.columns.forEach((col: any) => {
          if (this.selectedColumns.includes(col.header))
            z[col.header] = x[col.field];
        });
        return z;
      });
      const filterData = arr.map(({ buttons, ...rest }) => {
        const seenKeys = new Set<string>();
        return Object.keys(rest).reduce((acc, key) => {
          const lowerCaseKey = key.toLowerCase();
          if (!seenKeys.has(lowerCaseKey)) {
            seenKeys.add(lowerCaseKey);
            acc[key] = rest[key];
          }
          return acc;
        }, {} as { [key: string]: any });
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filterData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${this.tableName}.xlsx`);
    }
  }
  resetPaginator() {
    if (this.table) {
      this.table.first = 0;
    }
  }
  resetFilter() {
    if (this.table) {
      this.table.clear();
      this.filterdMode = false;
    }
  }

  handleChange(e: any, field: string, rowData: any) {
    const actionEl = this.columnsEvent.find(
      (x) => x.field.toLowerCase() === field.toLowerCase()
    );
    if (actionEl && actionEl.command) {
      actionEl.command(e, field, rowData);
    }
  }
  getTogglePermission(field: string) {
    return this.columnsEvent.find(
      (x) => x.field.toLowerCase() === field.toLowerCase()
    )?.permission;
  }

  hasToggleShow(field: string, rowData: any) {
    const column = this.columnsEvent.find(
      (x) => x.field.toLowerCase() === field.toLowerCase()
    );
    if (column && typeof column.visible === 'function') {
      return column.visible(rowData);
    }
    return null;
  }
  hasToggledisable(field: string, rowData: any) {
    const column = this.columnsEvent.find(
      (x) => x.field.toLowerCase() === field.toLowerCase()
    );
    if (column && typeof column.disable === 'function') {
      return column.disable(field, rowData);
    }
    return null;
  }
  getCarosulPage() {
    return this.body.data[this.carsoulPage]
      ? [this.body.data[this.carsoulPage]]
      : [];
  }
  newPage(operation: number) {
    switch (operation) {
      case 1:
        if (this.carsoulPage + 1 >= this.body.data.length - 1) {
          this.carsoulPage = 1;
        } else {
          this.carsoulPage = this.carsoulPage + 1;
        }
        break;

      default:
        if (this.carsoulPage - 1 === 0) {
          this.carsoulPage = this.body.data.length - 1;
        } else {
          this.carsoulPage = this.carsoulPage - 1;
        }
        break;
    }
  }
  downloadJSON(jsonData: string) {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  getCorrectDate(date: Date) {
    return date;
  }

}
