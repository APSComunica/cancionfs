import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConstruirPage } from './construir.page';

const routes: Routes = [
  {
    path: '',
    component: ConstruirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConstruirPageRoutingModule {}
