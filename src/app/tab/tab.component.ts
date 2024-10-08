import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent {
  @Input()
  tabTitle: string;
  @Input()
  active = false;
  @Output()
  onCloseTab = new EventEmitter();
}
