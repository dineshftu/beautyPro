import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  modules = [
    "schedular", "appointments", "staff", "clients", "treatments", "products", "vouchers"
  ];
  constructor() { }

  ngOnInit() {
  }

}
