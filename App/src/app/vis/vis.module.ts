import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VisPage } from './vis.page';
import { VisControlComponent } from './vis-control/vis-control.component';
import { VisMainComponent } from './vis-main/vis-main.component';
import { VisStatsComponent } from './vis-stats/vis-stats.component';

const routes: Routes = [
  {
    path: '',
    component: VisPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VisPage, VisControlComponent, VisMainComponent, VisStatsComponent]
})
export class VisPageModule {}
