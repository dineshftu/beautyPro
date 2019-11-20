import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TreatmentService } from '../treatment.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NewTreatmentRequest } from '../treatments.model';
import { Department } from 'src/app/shared/models/department.model';
import { DepartmentService } from 'src/app/shared/services/department.service';

@Component({
  selector: 'app-new-treatment',
  templateUrl: './new-treatment.component.html',
  styleUrls: ['./new-treatment.component.scss']
})
export class NewTreatmentComponent implements OnInit {

  private ngUnSubscription = new Subject();
  public departments: Department[];
  public newTreatmentRequest = new NewTreatmentRequest();
  public isDepartmentNotSelected: boolean = false;

  constructor(
    private treatmentService: TreatmentService,
    private departmentService: DepartmentService,
    public dialogRef: MatDialogRef<NewTreatmentComponent>,
    private route: Router
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      });
  }

  onDepartmentChange(e: any) {
    this.isDepartmentNotSelected = false;
    this.newTreatmentRequest.departmentId = e.target.value;
    console.log(this.newTreatmentRequest.departmentId);
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {

    if (!this.newTreatmentRequest.departmentId) {
      this.isDepartmentNotSelected = true;
      return;
    }

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
