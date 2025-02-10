import { Component } from '@angular/core';
import { InputDynamic } from '../../../../general/interfaces/input-dynamic';
import { DynmaicFormComponent } from '../../../../general/components/dynmaic-form/dynmaic-form.component';
import { AdTemplateComponent } from '../../ad-template/ad-template.component';

@Component({
  selector: 'app-user-add',
  imports: [AdTemplateComponent, DynmaicFormComponent],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss'
})
export class UserAddComponent {
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
