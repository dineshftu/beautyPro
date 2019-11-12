import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { ClientsService } from '../clients.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ClientRegistrationComponent } from '../client-registration/client-registration.component';
import { CustomerSearchRequest, Customer } from '../clients.model';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', null) searchInput: ElementRef;
  private ngUnSubscription = new Subject();

  public customers: Customer[];
  public searchText: string;

  module: string;
  clientList: any[];
  departmentList = [
    "Spa Care", "Salon Care", "Skin Care"
  ];

  constructor(
    private route: Router,
    private clientsService: ClientsService,
    public dialog: MatDialog,
    private data: DataService
  ) {
    this.routeReload();
  }

  ngOnInit() {
    this.loadCustomers();
    this.searchCustomers();
    this.data.currentModule.subscribe(module => this.module = module);
    this.data.changeModule("Clients");
  }

  private routeReload() {
    this.route
      .events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.loadCustomers();
        }
      })
  }

  searchCustomers() {

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() => {
        this.loadCustomers();
      });
  }

  loadCustomers() {
    this.clientsService
      .getCustomerList(this.createCustomerRequest(this.searchInput.nativeElement.value))
      .subscribe((customers: Customer[]) => {
        this.customers = customers
      });
  }

  createCustomerRequest(searchText: string) {
    return <CustomerSearchRequest>{
      searchText: searchText
    };
  }

  addNewClient() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = '';
    this.dialog.open(ClientRegistrationComponent, dialogConfig).afterClosed().subscribe(
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
}
