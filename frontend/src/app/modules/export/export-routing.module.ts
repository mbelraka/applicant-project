import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExportComponent } from './components/export/export.component';

const routes: Routes = [
  {
    path: '',
    component: ExportComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportRoutingModule {}
