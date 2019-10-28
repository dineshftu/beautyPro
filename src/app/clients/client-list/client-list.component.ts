import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  module: string;
  clientList: any[];
  departmentList = [
    "Spa Care", "Salon Care", "Skin Care"
  ];

  constructor(
    // private route: Router, private location: Location,
    // private treatmentService: TreatmentService,
    // public dialog: MatDialog,
    private data: DataService
  ) {
  }

  ngOnInit() {
    // this.loadTreatments();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Clients");
  }


}
