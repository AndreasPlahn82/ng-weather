import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  @Input() tabs: TemplateRef<any>[] = [];
  @Output() tabClosed = new EventEmitter<number>();

  selectedIndex = 0;

  afterViewInit() {
    debugger;
    this.selectTab(0);
  }

  selectTab(index: number) {
    this.selectedIndex = index;
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1);
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    this.tabClosed.emit(index);
  }
}
