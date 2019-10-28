import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  companyName = "BeautyPro";
  module: string;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);

    // this.router.events.subscribe((val) => {
    //   if (this.location.path() != '') {
    //     this.module = this.location.path().split('/')[1];
    //   }
    // });
  }

}
