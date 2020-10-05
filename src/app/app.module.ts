import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MultipleDatePickerModule } from 'multiple-date-picker-angular';
import { DurationPickerModule } from 'ngx-duration-picker';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeStepsComponent } from './home-page/home-steps/home-steps.component';
import { ContactComponent } from './contact/contact.component';
import { TrajetCommandeComponent } from './trajet-commande/trajet-commande.component';
import { CommandeComponent } from './trajet-commande/commande/commande.component';
import { BasicAuthHtppInterceptorService } from './service/basic-auth-htpp-interceptor.service';
import { MessagesComponent } from './messages/messages.component';
import { MesCommandesComponent } from './trajet-commande/mes-commandes/mes-commandes.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { AdminComponent } from './admin/admin.component';
import { AdminTrajetComponent } from './admin/admin-trajet/admin-trajet.component';
import { AddTrajetComponent } from './admin/add-trajet/add-trajet.component';
import { AuthGuardService } from './service/auth-guard.service';
import { DatePipe } from '@angular/common';
import { TypeFilterPipe } from './type-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HomeStepsComponent,
    HomePageComponent,
    ContactComponent,
    TrajetCommandeComponent,
    CommandeComponent,
    MessagesComponent,
    MesCommandesComponent,
    ConnexionComponent,
    AdminComponent,
    AdminTrajetComponent,
    AddTrajetComponent,
    TypeFilterPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AutocompleteLibModule,
    MultipleDatePickerModule,
    DurationPickerModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: BasicAuthHtppInterceptorService, multi: true
    },
    AuthGuardService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
