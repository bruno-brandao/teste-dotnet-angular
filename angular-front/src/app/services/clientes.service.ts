import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  getDialogData(): any {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllClientes(): void {
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
  addItem(cliente: Cliente): Observable<any> {
    const cl = { ...cliente, documento: cliente.documento.replace(/[^0-9]/g, '') };
    return this.httpClient.post(this.API_URL, cl);
  }
  // UPDATE, PUT METHOD
  updateItem(cliente: Cliente): Observable<any> {
    const cl = { ...cliente, documento: cliente.documento.replace(/[^0-9]/g, '') };
    return this.httpClient.put(this.API_URL + cliente.id, cl);
  }
  // DELETE METHOD
  deleteItem(id: number): Observable<any> {
    return this.httpClient.delete(this.API_URL + id);
  }

  // existe(doc): Observable<any> {
  //   return this.http.get(`${this.API_URL}/existe/${doc}`);
  // }
}
