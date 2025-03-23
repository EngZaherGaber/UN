import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { InputDynamic } from '../interfaces/input-dynamic';

@Injectable({
  providedIn: 'root',
})
export class DynamicAttributeService {
  firstTime: boolean = true;
  body: any;
  constructor(
  ) {}
  createFormFromAttForAdd(objs: InputDynamic[]): FormGroup {
    let group = new FormGroup({});
    objs.forEach((obj) => {
      let value = obj.value;
      if (!value) {
        switch (obj.dataType.toLowerCase()) {
          case 'double':
            value = 0;
            break;
          case 'int':
            value = 0;
            break;
          case 'float':
            value = 0;
            break;
          case 'bool':
            value = false;
            break;
          case 'datetime':
            value = new Date();
            break;
        }
      } else {
        if (obj.dataType.toLowerCase() === 'list') {
          value = obj.value.id || obj.value.id === 0 ? obj.value.id : obj.value;
        } else if (obj.dataType.toLowerCase() === 'bool') {
          value = obj.value === true;
        }
      }
      let control = new FormControl(value);
      obj.required ? control.addValidators(Validators.required) : '';
      group.addControl(obj.key, control);
    });
    return group;
  }
  createFormFromAttForAddForDynamic(obj: any): FormGroup {
    let group = new FormGroup({});
    let dyValue = obj.value;
    if (!dyValue) {
      switch (obj.dataType.toLowerCase()) {
        case 'double':
          dyValue = 0;
          break;
        case 'int':
          dyValue = 0;
          break;
        case 'float':
          dyValue = 0;
          break;
        case 'bool':
          dyValue = false;
          break;
        case 'datetime':
          dyValue = new Date();
          break;
      }
    }
    let value = new FormControl(dyValue);
    let id = new FormControl(obj.id);
    obj.visible = true;
    obj.required ? value.addValidators(Validators.required) : '';
    id.addValidators(Validators.required);
    group.addControl('value', value);

    // gggg
    group.addControl('id', id);
    return group;
  }
  createFormFromAttForAddForArrays(objs: any[]): FormArray | [] {
    const array = new FormArray<FormGroup>([]);
    objs.forEach((obj) => {
      let group = new FormGroup<{ [key: string]: FormControl }>({});
      obj.forEach((internalObj: InputDynamic) => {
        let value = internalObj.value;
        if (!value) {
          switch (internalObj.dataType.toLowerCase()) {
            case 'double':
              value = 0;
              break;
            case 'int':
              value = 0;
              break;
            case 'float':
              value = 0;
              break;
            case 'bool':
              value = false;
              break;
            case 'datetime':
              value = new Date();
              break;
          }
        } else {
          if (internalObj.dataType.toLowerCase() === 'list') {
            value = obj.value.id ? obj.value.id : obj.value;
          }
        }
        let control = new FormControl(value);
        internalObj.required ? control.addValidators(Validators.required) : '';
        group.addControl(internalObj.key, control);
      });
      if (group) {
        array.push(group);
      }
    });
    return array;
  }
  createStepsFromObjs(objs: any) {
    const steps: MenuItem[] = [];
    Object.keys(objs).forEach((obj) => {
      steps.push({
        label: obj,
      });
    });
    return steps;
  }
  makeAllNotVisible(objs: InputDynamic[]): InputDynamic[] {
    return objs.map((element: InputDynamic) => {
      element.visible = false;
      return element;
    });
  }
  makeAllVisible(objs: InputDynamic[]): InputDynamic[] {
    return objs.map((element: InputDynamic) => {
      element.visible = true;
      return element;
    });
  }
  makeAllVisibleWithout(
    objs: InputDynamic[],
    key: string,
    unVisibleAtt: { [key: string]: string[] }
  ): InputDynamic[] {
    return objs.map((element: InputDynamic) => {
      if (
        unVisibleAtt[key] &&
        unVisibleAtt[key].find(
          (x) => x.toLowerCase() === element.key.toLowerCase()
        )
      ) {
        element.visible && element.visible === true
          ? (element.visible = false)
          : '';
      } else {
        element.visible === undefined
          ? (element.visible = true)
          : (element.visible = element.visible);
      }
      return element;
    });
  }
  disableInput(
    disableSteps: { [key: string]: string[] },
    key: string,
    form: FormGroup
  ) {
    disableSteps[key]
      ? disableSteps[key].forEach((att) => {
          (form.controls[key] as FormGroup) &&
          (form.controls[key] as FormGroup).controls[att]
            ? (form.controls[key] as FormGroup).controls[att].disable()
            : '';
        })
      : '';
  }
  disableInputRecursion(
    disableSteps: { [key: string]: any[] },
    key: string,
    form: any,
    enable: boolean
  ) {
    if (disableSteps[key]) {
      for (let index = 0; index < disableSteps[key].length; index++) {
        const element = disableSteps[key][index];
        (element as string[]).forEach((att) => {
          const control = form.controls[key].controls[index]?.controls[
            att
          ] as FormControl;
          if (control) {
            enable ? control.enable() : control.disable();
          }
        });
      }
    }
  }
  returnIfDisable(
    returnIfDisable: { [key: string]: string[] },
    form: any,
    recursionSteps: string[],
    withIdSteps: string[]
  ) {
    if (returnIfDisable) {
      Object.keys(returnIfDisable).forEach((key) => {
        if (recursionSteps.includes(key)) {
          this.disableInputRecursion(returnIfDisable, key, form, true);
        } else if (!withIdSteps.includes(key)) {
          returnIfDisable[key].forEach((att) => {
            const control = form.controls[key].controls[att] as FormControl;
            if (control && control.disabled) {
              control.enable();
            }
          });
        }
      });
    }
  }
  addCommand(
    triggers: {
      [key: string]: { key: string; command: (event?: any) => void }[];
    },
    objs: InputDynamic[],
    key: string
  ): InputDynamic[] {
    triggers[key]
      ? triggers[key].forEach((trigger) => {
          const dynmaicInpt = objs.find((x) => x.key == trigger.key);
          dynmaicInpt ? (dynmaicInpt.command = trigger.command) : '';
        })
      : '';
    return objs;
  }
  valueForAllDateTime(
    form: any,
    objs: any,
    recursionSteps: string[],
    withIdSteps: string[]
  ) {
    const body = form;
    Object.keys(objs).forEach((key) => {
      let index = 0;
      if (recursionSteps.includes(key)) {
        const length = objs[key].length;
        for (index; index < length; index++) {
          objs[key][index].forEach((att: any) => {
            try {
              if (att.dataType.toLowerCase() === 'datetime') {
              }
            } catch (error) {
              objs[key][index];
            }
          });
        }
      } else if (withIdSteps.includes(key)) {
        const length = objs[key].length;
        for (let index = 0; index < length; index++) {
          if (objs[key][index].dataType.toLowerCase() === 'datetime') {
          }
        }
      } else {
        Object.keys(objs[key]).forEach((att) => {
          if (objs[key][att] === 'datetime') {
          }
        });
      }
    });
    return body;
  }
  clearMap(step: string, roadMap: string[], objs: any, form: FormGroup) {
    (objs[step] as InputDynamic[]).forEach((obj) => {
      if (!roadMap.includes(obj.key)) {
        this.changeVisibleStatus(
          'installationConfig',
          obj.key,
          form,
          objs,
          null,
          false
        );
        obj.value = null;
      }
    });
  }
  getInputDynamic(parent: string, child: string, objs: any): any {
    return (objs[parent] as InputDynamic[]).find(
      (x) => x.key.toLowerCase() === child.toLowerCase()
    );
  }
  getFormControl(
    parent: string,
    child: string,
    form: FormGroup
  ): FormControl | null {
    const realKey = Object.keys(
      (form.controls[parent] as FormGroup).controls
    ).find((key) => key.toLowerCase() === child.toLowerCase());
    if (realKey) {
      return (form.controls[parent] as FormGroup).controls[
        realKey
      ] as FormControl;
    }
    return null;
  }
  getNameFromList(element: InputDynamic, id: string) {
    return element.options?.find((x) => x.id === id)?.name;
  }
  changeVisibleStatus(
    parent: string,
    child: string,
    form: FormGroup,
    objs: any,
    value: any,
    isVisible: boolean
  ) {
    const control = this.getFormControl(parent, child, form);
    const inpt = this.getInputDynamic(parent, child, objs);
    if (control && inpt) {
      if (isVisible) {
        if (inpt.dataType.toLowerCase() === 'int') {
          control.addValidators(Validators.min(1));
        } else if (
          inpt.dataType.toLowerCase() === 'float' ||
          inpt.dataType.toLowerCase() === 'double'
        ) {
          control.addValidators(Validators.min(0.01));
        }
        control.addValidators(Validators.required);

        control.setValue(value);
        inpt.visible = true;
        inpt.required = true;
      } else {
        control.clearValidators();
        control.setValue(
          inpt.dataType.toLowerCase() === 'int' ||
            inpt.dataType.toLowerCase() === 'float' ||
            inpt.dataType.toLowerCase() === 'double'
            ? 0
            : value
        );
        inpt.visible = false;
        inpt.required = false;
      }
    }
  }
  mergeObjs(
    orginObjs: any,
    newObjs: any,
    unVisibleAtt: { [key: string]: string[] }
  ) {
    let keys = Object.keys(newObjs);
    keys.forEach((key) => {
      newObjs[key] = this.makeAllVisibleWithout(
        newObjs[key],
        key,
        unVisibleAtt
      );
    });
    return { ...orginObjs, ...newObjs };
  }
}
