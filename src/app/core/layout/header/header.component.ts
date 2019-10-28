import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  companyName = "BeautyPro";
  module: string;

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (this.location.path() != '') {
        this.module = this.location.path().split('/')[1];
      }
    });
  }

}
