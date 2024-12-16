import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RootComponent } from 'src/app/containers/root/root/root.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('../../modules/main/main.module').then((m) => m.MainModule),
      },
      {
        path: 'applicants',
        loadChildren: () =>
          import('../../modules/applicants/applicants.module').then(
            (m) => m.ApplicantsModule
          ),
      },
      {
        path: 'export',
        loadChildren: () =>
          import('../../modules/export/export.module').then(
            (m) => m.ExportModule
          ),
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
      { path: '**', redirectTo: 'main' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule {}
