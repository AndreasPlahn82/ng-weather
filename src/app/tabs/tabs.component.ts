import {Component, ContentChildren, QueryList} from '@angular/core';
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
export class TabsComponent {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

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

}
