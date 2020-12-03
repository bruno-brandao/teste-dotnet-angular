import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddClienteComponent } from './components/add-cliente/add-cliente.component';
import { ClienteDetailsComponent } from './components/cliente-details/cliente-details.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AddClienteComponent,
    ClienteDetailsComponent,
    ClienteListComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
