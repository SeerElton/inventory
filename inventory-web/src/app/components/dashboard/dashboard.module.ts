import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReportComponent } from './report/report.component';
import { StockLiComponent } from './directives/stock-li/stock-li.component';
import { HomeComponent } from './home/home.component';
import { StockService } from '../../../swagger-client';



@NgModule({
  declarations: [
    NotFoundComponent,
    ReportComponent,
    StockLiComponent,
    HomeComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [StockService]
})
export class DashboardModule { }
