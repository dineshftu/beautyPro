import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TreatmentService } from '../treatment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-treatment',
  templateUrl: './new-treatment.component.html',
  styleUrls: ['./new-treatment.component.scss']
})
export class NewTreatmentComponent implements OnInit {
  departmentList = [
    "Spa Care", "Salon Care", "Foot Care"
  ];

  constructor(
    public dialogRef: MatDialogRef<NewTreatmentComponent>,
    private route: Router
    // public treatmentService: TreatmentService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
    // this.route.navigate(['home/treatments']);

  }

  save() {
    this.dialogRef.close();

  }

}
