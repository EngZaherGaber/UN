import { Component, Input } from '@angular/core';

@Component({
  selector: 'ad-template',
  imports: [],
  templateUrl: './ad-template.component.html',
  styleUrl: './ad-template.component.scss',
})
export class AdTemplateComponent {
  @Input({ required: true }) title: string = '';
  @Input({ required: true }) subTitle: string = '';
}
