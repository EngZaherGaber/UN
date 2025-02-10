import { Component } from '@angular/core';
import { AdTemplateComponent } from "../../ad-template/ad-template.component";
import { DynmaicFormComponent } from "../../../../general/components/dynmaic-form/dynmaic-form.component";
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';

@Component({
  selector: 'app-em-add',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './em-add.component.html',
  styleUrl: './em-add.component.scss'
})
export class EmAddComponent {
  objs: { [key: string]: InputDynamic[] } = {
    general: [
      {
        key: 'userName',
        label: 'Username',
        value: null,
        dataType: 'string',
        options: [],
        visible: true,
        command: (value, element, form) => { },
        required: true,
      },
      {
        key: 'password',
        label: 'Password',
        value: 'null',
        dataType: 'string',
        options: [],
        visible: true,
        command: (value, element, form) => { },
        required: true,
      },
    ],
  };
}
