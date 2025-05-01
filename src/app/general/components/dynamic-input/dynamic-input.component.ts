import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { InputDynamic } from '../../interfaces/input-dynamic';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'dynamic-input',
  imports: [
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    AutoCompleteModule,
    CalendarModule,
    MultiSelectModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    DatePickerModule
  ],
  templateUrl: './dynamic-input.component.html',
  styleUrl: './dynamic-input.component.scss',
})
export class DynamicInputComponent {
  @Input() object: InputDynamic = {
    key: '',
    value: null,
    label: '',
    dataType: '',
    required: false,
    visible: false,
    options: [],
  };
  @Input() FEcontrol: FormControl = new FormControl('');
  @ViewChild('drop') drop: Dropdown | null = null;
  items: any[] | undefined = [];
  autoCompleteValue: any;
  now: Date = new Date();
  constructor() { }
  ngOnInit(): void {
    if (this.FEcontrol.value === null && this.FEcontrol.value !== 0) {
      if (this.object.dataType.toLowerCase() === 'autocomplete') {
        this.items;
        const value = this.object.options?.find(
          (x) => x.id === this.FEcontrol.value
        );
        value ? (this.autoCompleteValue = value) : '';
      } else if (
        this.object.dataType.toLowerCase() === 'float' ||
        this.object.dataType.toLowerCase() === 'double' ||
        this.object.dataType.toLowerCase() === 'int'
      ) {
        this.FEcontrol.setValue(0);
      } else if (this.object.dataType.toLowerCase() === 'bool') {
        this.FEcontrol.setValue(false);
      } else if (this.object.dataType.toLowerCase() === 'datetime') {
        this.FEcontrol.setValue(new Date());
      } else if (this.object.dataType.toLowerCase() === 'year' || this.object.dataType.toLowerCase() === 'month') {
        if (this.object.dataType.toLowerCase() === 'year') {
          this.autoCompleteValue = (new Date());
          // this.FEcontrol.setValue(this.autoCompleteValue);
        } else {
          // this.FEcontrol.setValue(this.autoCompleteValue);
          this.autoCompleteValue = (new Date());
        }
      }
    } else {
      if (this.object.dataType.toLowerCase() === 'list') {
        if (this.FEcontrol.value && this.FEcontrol.value.id === 0) {
          this.FEcontrol.setValue(this.FEcontrol.value.id);
        }
      } else if (this.object.dataType.toLowerCase() === 'autocomplete') {
        this.items;
        this.autoCompleteValue = this.object.options?.find(
          (x) => x.id === this.FEcontrol.value
        );
      } else if (this.object.dataType.toLowerCase() === 'datetime') {
        const va = new Date(this.FEcontrol.value);
        this.FEcontrol.setValue(va);
      } else if (this.object.dataType.toLowerCase() === 'year' || this.object.dataType.toLowerCase() === 'month') {
        const type = this.object.dataType.toLowerCase() === 'year' ? 'yy' : 'mm';
        if (this.object.dataType.toLowerCase() === 'year') {
          this.autoCompleteValue = (new Date());
        } else {
          this.autoCompleteValue = (new Date());
        }
        const yy = this.autoCompleteValue.getFullYear();
        const mm = this.autoCompleteValue.getMonth() + 1;
        this.FEcontrol.setValue(type === 'mm' ? mm : yy);
      }
    }
    this.object = this.repeairLabel(this.object);
  }
  repeairLabel(obj: InputDynamic): InputDynamic {
    obj.label = obj.label.replace(/([a-z])([A-Z])/g, '$1 $2');
    if (obj.label.toLowerCase().endsWith(' id')) {
      obj.label = obj.label.slice(0, -3);
    }
    obj.label = obj.label.replace('_', ' ');
    obj.label = obj.label.charAt(0).toUpperCase() + obj.label.slice(1);
    return obj;
  }
  getSuggestions(event: any) {
    this.items = this.object.options?.filter((x) =>
      (x.name as string).toLowerCase().includes(event.query.toLowerCase())
    ).sort((a, b) => (a.name as string).localeCompare((b.name as string)));
  }
  selectValue(event: any) {
    this.autoCompleteValue = event;
    this.FEcontrol.setValue(event.id);
  }
  selectDate(event: any) {
    this.FEcontrol.setValue(new Date(new Date(event).setHours(3)));
  }
  selectYM(event: Date, type: 'mm' | 'yy') {
    const date = new Date(event);
    const yy = date.getFullYear();
    const mm = date.getMonth() + 1;
    this.FEcontrol.setValue(type === 'mm' ? mm : yy)
  }
  disableAutoComplete() {
    return this.FEcontrol.disabled;
  }
  filterList(event: any) {
    const searchValue = (event.filter as string)
      ? (event.filter as string).toLowerCase().replace(/\s+/g, '')
      : null;
    if (this.drop) {
      if (searchValue) {
        this.drop.options = this.object.options?.filter((x) =>
          (x.name as string)
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(searchValue)
        );
      } else {
        this.drop.options = this.drop.options;
      }
    }
  }
  preventSpace(event: KeyboardEvent, controlValue: number | null) {
    if (event.code === 'Space' && controlValue === 0) {
      event.preventDefault();
    }
  }
}
