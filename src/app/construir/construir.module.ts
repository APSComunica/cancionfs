import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConstruirPageRoutingModule } from './construir-routing.module';

import { ConstruirPage } from './construir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConstruirPageRoutingModule
  ],
  declarations: [ConstruirPage]
})
export class ConstruirPageModule {}
