import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from './core/core.module';
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service';
// import { MaterialModule } from './material.module';
// import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      newestOnTop: true
    }
    ),
    AppRoutingModule,
    HttpClientModule,
    // MaterialModule,
    CoreModule,
    BrowserAnimationsModule
  ],
  providers: [
    // { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
