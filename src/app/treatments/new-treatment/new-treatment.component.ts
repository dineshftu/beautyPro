import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TreatmentService } from '../treatment.service';

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
    public dialog: MatDialog,
    public treatmentService: TreatmentService
  ) { }

  ngOnInit() {
  }

}
