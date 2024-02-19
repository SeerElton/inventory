import { Component, OnInit } from '@angular/core';
import { StockResponse, StockService } from '../../../../swagger-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  stock: StockResponse[] = [];
  constructor(private stockService: StockService) {

  }

  ngOnInit(): void {
    this.stockService.stockControllerGetStock().subscribe(results => this.stock = results)
  }
}


