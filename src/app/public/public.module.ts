import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TextInputComponent } from '../shared/components/text-input/text-input.component';



@NgModule({
  declarations: [
    AboutUsComponent,
    DashboardComponent,
    ProductsComponent,
    ContactUsComponent,
    TextInputComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PublicModule { }
