import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { fromEvent, switchMap, takeUntil } from 'rxjs';
import { DynamicAttributeService } from '../../services/dynamic-attribute.service';
import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { CommonModule } from '@angular/common';
import { InputDynamic } from '../../interfaces/input-dynamic';

@Component({
  selector: 'dynmaic-form',
  imports: [
    DynamicInputComponent,
    ScrollPanelModule,
    CardModule,
    StepsModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './dynmaic-form.component.html',
  styleUrl: './dynmaic-form.component.scss',
})
export class DynmaicFormComponent {
  @Input() taskId: number | null = null;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() preRoute: string = '';
  @Input() scrollHeight: string = '';
  @Input() direction: string = 'column';
  @Input() display: string = 'grid';
  @Input() submitLabel: string = '';
  @Input() isShow: boolean = false;
  @Input() withBackBtn: boolean = true;
  @Input() objs: { [key: string]: InputDynamic[] } = {};
  @Input() withIdSteps: string[] = [];
  @Input() recursionSteps: string[] = [];
  @Input() disableAtt: { [key: string]: string[] } = {};
  @Input() disableSteps: string[] = [];
  @Input() unVisibleAtt: { [key: string]: string[] } = {};
  @Input() returnIfDisable: { [key: string]: string[] } = {};
  @Input() disableSaveButton: boolean = false;
  @Input() justOneStep: boolean = false;
  @Input() showSteps: boolean = false;
  @Input() triggers: {
    [key: string]: {
      key: string;
      command: (event?: any) => void;
    }[];
  } = {};
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onActiveIndexChange: EventEmitter<any> = new EventEmitter<any>();
  public form: FormGroup = new FormGroup({});
  stepsList: MenuItem[] = [];
  keys: string[] = [];
  activeIndex: number = 0;
  constructor(
    private route: Router,
    private DySrv: DynamicAttributeService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.reLoad()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.reLoad();
  }
  reLoad() {
    if (this.objs) {
      this.stepsList = this.DySrv.createStepsFromObjs(this.objs);
      this.keys = Object.keys(this.objs);
      this.keys.forEach((key) => {
        (this.objs as any)[key] = this.DySrv.addCommand(
          this.triggers,
          (this.objs as any)[key],
          key
        );
      });
      this.createForm();
      this.isShow ? this.form.disable() : '';
    }

  }
  listenAgain() {
    this.keys.forEach((key) => {
      if (
        !this.withIdSteps.includes(key) &&
        !this.disableSteps.includes(key) &&
        !this.recursionSteps.includes(key)
      ) {
        (this.objs as any)[key].forEach((element: InputDynamic) => {
          if (element.value !== null) {
            this.DySrv.firstTime = true;
            if (element.dataType.toLowerCase() === 'list') {
              (this.form.controls[key] as FormGroup).controls[
                element.key
              ].setValue(
                element.value.id || element.value.id === 0
                  ? element.value.id
                  : element.value
              );
            } else {
              (this.form.controls[key] as FormGroup).controls[
                element.key
              ].setValue(element.value);
            }
          }
        });
      }
    });
  }
  listenToChange() {
    this.keys.forEach((key) => {
      if (
        !this.withIdSteps.includes(key) &&
        !this.disableSteps.includes(key) &&
        !this.recursionSteps.includes(key)
      ) {
        (this.objs as any)[key].forEach((element: InputDynamic) => {
          const control = (this.form.controls[key] as FormGroup).controls[
            element.key
          ];
          control.valueChanges.subscribe((x) => {
            element.value = x;
            if (element.command) {
              element.command(x, element, this.form, this.objs, this.DySrv);
            }
          });
        });
      }
    });
  }
  resetForm() {

    this.form = new FormGroup({});
  }
  createForm() {
    this.keys.forEach((key) => {
      if (this.recursionSteps.includes(key)) {
        const con = this.DySrv.createFormFromAttForAddForArrays((this.objs as any)[key]);
        this.form.addControl(key, con);
        this.DySrv.disableInputRecursion(
          this.disableAtt,
          key,
          this.form,
          false
        );
      } else if (this.withIdSteps.includes(key)) {
        const dynmaic = new FormArray<any>([]);
        (this.objs as any)[key].forEach((obj: InputDynamic[]) => {
          const group = this.DySrv.createFormFromAttForAddForDynamic(obj);
          if (group) {
            dynmaic.push(group);
          }
        });
        this.form.addControl(key, dynmaic);
        this.DySrv.disableInput(this.disableAtt, key, this.form);
      } else {
        this.form.addControl(
          key,
          this.DySrv.createFormFromAttForAdd((this.objs as any)[key])
        );
        this.DySrv.disableInput(this.disableAtt, key, this.form);
      }
      this.disableSteps.includes(key) || this.isShow
        ? this.form.controls[key].disable()
        : '';
    });
    this.listenToChange();
  }

  isWithIdKey(key: string) {
    const value = this.withIdSteps.includes(key);
    return value;
  }

  isRecurionKey(key: string) {
    return this.recursionSteps.includes(key);
  }

  back() {
    if (this.activeIndex === 0) {
      this.route.navigate([this.preRoute]);
    } else {
      this.activeIndex--;
    }
  }
  handleEnterKey() {
    if (this.activeIndex < this.stepsList.length - 1 || (this.activeIndex === 0 && this.stepsList.length > 1)) {
      // If Next button is available and not disabled, trigger it
      if (!this.form.controls[this.keys[this.activeIndex]].invalid) {
        this.activeIndex = this.activeIndex + 1;
        this.onActiveIndexChange.emit(this.activeIndex);
      }
    }
    else if (this.activeIndex === this.stepsList.length - 1 && this.isShow) {
      this.exit();
    }
    else {
      // If Save button is available and not disabled, trigger it
      if (!this.form.controls[this.keys[this.activeIndex]].invalid && !this.disableSaveButton) {
        this.submitFunc();
      }
    }
  }
  submitFunc() {
    this.DySrv.returnIfDisable(
      this.returnIfDisable,
      this.form,
      this.recursionSteps,
      this.withIdSteps
    );
    let body = this.DySrv.valueForAllDateTime(
      this.form.value,
      this.objs,
      this.recursionSteps,
      this.withIdSteps
    );
    this.form;
    this.submit.emit(this.justOneStep ? body.general : body);

    this.keys.forEach((key) => {
      if (this.disableSteps.includes(key)) {
        this.form.controls[key].disable();
      }
      if (
        !this.withIdSteps.includes(key) &&
        this.recursionSteps.includes(key)
      ) {
        if (this.recursionSteps.includes(key)) {
          const con = this.DySrv.createFormFromAttForAddForArrays(
            (this.objs as any)[key]
          );
          this.form.addControl(key, con);
          this.DySrv.disableInputRecursion(
            this.disableAtt,
            key,
            this.form,
            false
          );
        }
      } else if (
        !this.withIdSteps.includes(key) &&
        !this.recursionSteps.includes(key)
      ) {
        this.DySrv.disableInput(this.disableAtt, key, this.form);
      }
    });
    this.form;
    // this.createForm();
  }
  isFormGroup(control?: AbstractControl): FormControl {
    return control ? (control as FormControl) : new FormControl('');
  }
  exit() {
    if (!this.withBackBtn) {
      this.submit.emit(true);
    } else {
      this.route.navigate([this.preRoute]);
    }
  }
}