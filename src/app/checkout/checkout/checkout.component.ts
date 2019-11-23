import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  module: string;

  constructor(
    private data: DataService
  ) { }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Checkout");
  }

}
