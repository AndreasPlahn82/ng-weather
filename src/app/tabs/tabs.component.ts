import {AfterContentInit, ChangeDetectorRef, Component, ContentChildren, QueryList} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabComponent} from '../tab/tab.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  
  constructor() {
  }
  
  ngAfterContentInit(): void {
    
    // set first tab active on init
    if (this.tabs.length > 0) {
      this.selectTab(this.tabs.first);
    }
  }
  
  selectTab(tab: TabComponent) {
    // set all tabs as inactive
    this.tabs.toArray().forEach(tab => tab.active = false);
    // activate the selected tab
    tab.active = true;
  }
  
  removeTab(tab: TabComponent) {
    tab.onCloseTab.emit();
    this.tabs.reset( this.tabs.filter(t => t !== tab));
  }
}
