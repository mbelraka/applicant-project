import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'root',
    loadChildren: () =>
      import('./containers/root/root.module').then((m) => m.RootModule),
  },
  { path: '', redirectTo: 'root', pathMatch: 'full' },
  { path: '**', redirectTo: 'root' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
