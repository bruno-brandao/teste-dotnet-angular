import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-delete-cliente',
  templateUrl: './delete-cliente.component.html',
  styleUrls: ['./delete-cliente.component.css']
})
export class DeleteClienteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: ClientesService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteItem(this.data.id).subscribe(
      (data) => {
        this.dataService.dialogData = data;
        this.toastr.success('Cliente apagado com sucesso!');
        this.dialogRef.close(1);
      },
      (error) => {
        this.toastr.error(error?.error?.mensagem || error.message);
      }
    );
  }

}
