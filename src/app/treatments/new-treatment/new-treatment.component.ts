import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TreatmentService } from '../treatment.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Department, NewTreatmentRequest } from '../treatments.model';

@Component({
  selector: 'app-new-treatment',
  templateUrl: './new-treatment.component.html',
  styleUrls: ['./new-treatment.component.scss']
})
export class NewTreatmentComponent implements OnInit {

  private ngUnSubscription = new Subject();
  public departments: Department[];
  public newTreatmentRequest = new NewTreatmentRequest();

  constructor(
    private treatmentService: TreatmentService,
    public dialogRef: MatDialogRef<NewTreatmentComponent>,
    private route: Router
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.treatmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      });

    console.log("ngAfterViewInit");
  }

  onDepartmentChange(e: any) {
    this.newTreatmentRequest.departmentId = e.target.value;
    console.log(this.newTreatmentRequest.departmentId);
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.treatmentService
      .addNewTreatment(this.newTreatmentRequest)
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((result: any) => {
        console.log(result);
        //this.route.navigate(['home/treatments']);
      }, (error: any) => {

      }, () => {

        // this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.route.navigate(['home/treatments']);
        this.dialogRef.close();
      })


  }

}
