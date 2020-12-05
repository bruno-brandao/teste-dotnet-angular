import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Cliente } from './../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly API_URL =
    'http://localhost:5000/clientes/';
  dataChange: BehaviorSubject<Cliente[]> = new BehaviorSubject<Cliente[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private httpClient: HttpClient) { }

  get data(): Cliente[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllClientes(): void {
    console.log("getAllClientes")
    this.httpClient.get<Cliente[]>(this.API_URL).subscribe(
      (data) => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  // ADD, POST METHOD
  addItem(cliente: Cliente) {
    const cl = { ...cliente, documento: cliente.documento.replace(/[^0-9]/g, '') };
    return this.httpClient.post(this.API_URL, cl);
  }
  // UPDATE, PUT METHOD
  updateItem(cliente: Cliente): void {
    this.httpClient.put(this.API_URL + cliente.id, cliente).subscribe(
      (data) => {
        this.dialogData = cliente;
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  // DELETE METHOD
  deleteItem(id: number) {
    return this.httpClient.delete(this.API_URL + id);
  }

  // existe(doc): Observable<any> {
  //   return this.http.get(`${this.API_URL}/existe/${doc}`);
  // }
}
