import { Component, OnInit } from '@angular/core';
import { TreatmentService } from '../treatment.service';
import { Treatments } from '../treatments.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NewTreatmentComponent } from '../new-treatment/new-treatment.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.scss']
})
export class TreatmentListComponent implements OnInit {
  treatmentList: Treatments[];
  departmentList = [
    "Spa Care", "Salon Care", "Skin Care"
  ];
  constructor(
    private treatmentService: TreatmentService,
    public dialog: MatDialog,
    public route: Router
  ) {
  }

  ngOnInit() {
    this.loadTreatments();
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
    // dialogConfig.width = "600px";
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
