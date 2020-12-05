import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cliente } from './models/cliente';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientesService } from './services/clientes.service';
import { AddClienteComponent } from './components/add-cliente/add-cliente.component';
import { EditClienteComponent } from './components/edit-cliente/edit-cliente.component';
import { DeleteClienteComponent } from './components/delete-cliente/delete-cliente.component';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  displayedColumns = [
    'nome',
    'documento',
    'telefone',
    'dataNascimento',
    'cidade',
    'estado',
    'actions',
  ];
  clienteDatabase: ClientesService | null;
  dataSource: ClienteDataSource | null;
  index: number;
  id: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: ClientesService
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void {
    this.loadData();
  }

  refresh(): void {
    this.loadData();
  }

  addNew(): void {
    const dialogRef = this.dialog.open(AddClienteComponent, {
      data: { cliente: Cliente },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.loadData();
      }
    });
  }

  startEdit(cliente: any): void {
    const data = { ...cliente };
    const dialogRef = this.dialog.open(AddClienteComponent, {
      data
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.loadData();
      }
    });
  }

  deleteItem(
    i: number,
    id: number,
    nome: string,
    documento: string,
    telefone: string
  ): void {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteClienteComponent, {
      data: { id, nome, documento, telefone },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.clienteDatabase.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        this.clienteDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable(): void {
    // Refreshing table using paginator
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /*   // If you don't need a filter or a pagination this can be simplified, you just use code from else block
    // OLD METHOD:
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }*/

  public loadData(): void {
    this.clienteDatabase = new ClientesService(this.httpClient);
    this.dataSource = new ClienteDataSource(
      this.clienteDatabase,
      this.paginator,
      this.sort
    );
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  public formatDate(date: any): string {
    return moment(date).format('DD/MM/YYYY');
  }
}

export class ClienteDataSource extends DataSource<Cliente> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Cliente[] = [];
  renderedData: Cliente[] = [];

  constructor(
    public _clienteDatabase: ClientesService,
    public _paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Cliente[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._clienteDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    this._clienteDatabase.getAllClientes();

    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this._clienteDatabase.data
          .slice()
          .filter((cliente: Cliente) => {
            const searchStr = (
              cliente.id +
              cliente.nome +
              cliente.documento +
              cliente.telefone +
              cliente.endereco.cidade +
              cliente.endereco.estado
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this._paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }

  disconnect(): void { }

  /** Returns a sorted copy of the database data. */
  sortData(data: Cliente[]): Cliente[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'nome':
          [propertyA, propertyB] = [a.nome, b.nome];
          break;
        case 'documento':
          [propertyA, propertyB] = [a.documento, b.documento];
          break;
        case 'telefone':
          [propertyA, propertyB] = [a.telefone, b.telefone];
          break;
        case 'dataNascimento':
          [propertyA, propertyB] = [a.dataNascimento, b.dataNascimento];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
