import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TreatmentService } from '../treatment.service';
import { Treatment, TreatmentFilterRequest } from '../treatments.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NewTreatmentComponent } from '../new-treatment/new-treatment.component';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/models/department.model';

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.scss']
})
export class TreatmentListComponent implements OnInit, AfterViewInit, OnDestroy {
  module: string;
  treatmentList: Treatment[];
  public selectedDepartment = 0;
  private ngUnSubscription = new Subject();

  departments: Department[];

  constructor(
    private treatmentService: TreatmentService,
    private departmentService: DepartmentService,
    private route: Router, private location: Location,
    public dialog: MatDialog,
    private data: DataService
  ) {
    this.routeReload();
  }

  ngAfterViewInit() {
    this.departmentService
      .getAllDepartments()
      .pipe(takeUntil(this.ngUnSubscription))
      .subscribe((departments: Department[]) => {
        this.departments = departments;
      })
  }

  ngOnInit() {
    this.loadTreatments();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Treatments");
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.loadTreatments();
        }
      })
  }

  onDepartmentChange(e: any) {
    this.selectedDepartment = e.target.value;
    this.loadTreatments();
  }

  loadTreatments() {
    this.treatmentService
      .getFilteredTreatmentList(this.generateTreatmentFilterRequest())
      .subscribe((treatments: Treatment[]) => {
        this.treatmentList = treatments;
      });
  }

  private generateTreatmentFilterRequest() {
    return <TreatmentFilterRequest>{
      departmentId: this.selectedDepartment
    }
  }

  addNewTreatment() {
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

  ngOnDestroy() {
    this.ngUnSubscription.next(true);
    this.ngUnSubscription.complete();
  }
  deleteTreatment(){
    this.treatmentService.deleteTreatment()
    .subscribe((treatment:Treatment)=>{
      console.log(treatment);
    })
  }

}
