import { Component, OnInit } from '@angular/core';
import { TreatmentService } from '../treatment.service';
import { Treatments } from '../treatments.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NewTreatmentComponent } from '../new-treatment/new-treatment.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.scss']
})
export class TreatmentListComponent implements OnInit {
  module: string;
  treatmentList: Treatments[];
  departmentList = [
    "Spa Care", "Salon Care", "Skin Care"
  ];

  constructor(
    private route: Router, private location: Location,
    private treatmentService: TreatmentService,
    public dialog: MatDialog,
    private data: DataService
  ) {
  }

  ngOnInit() {
    this.loadTreatments();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Treatments");
  }

  loadTreatments() {
    this.treatmentService.getTreatmentList().subscribe((treatments: Treatments[]) => {
      this.treatmentList = treatments;
    });
  }

  addNewTreatment() {
    console.log("addNewTreatment")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = '';
    this.dialog.open(NewTreatmentComponent, dialogConfig).afterClosed().subscribe(
      (response) => {
        //console.log(response);
        if (!!response) {
          if (response.message == 'success') {
            this.route.navigate(['']);
          }
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

}
