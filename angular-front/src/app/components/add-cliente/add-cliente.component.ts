import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { Endereco } from 'src/app/models/endereco';
import { ConsultaCepService } from 'src/app/services/consulta-cep.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css']
})
export class AddClienteComponent implements OnInit {

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  constructor(
    public dialogRef: MatDialogRef<AddClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private cepService: ConsultaCepService,
    public dataService: ClientesService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.data.endereco = new Endereco();
  }

  getErrorMessage(): any {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit(): any {
    this.dataService.addItem(this.data).subscribe(
      (data) => {
        this.dataService.dialogData = data;
        this.toastr.success('Cliente criado com sucesso!');
        this.dialogRef.close(1);
      },
      (error) => {
        this.toastr.error(error?.error?.mensagem || error.message);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addItem(this.data);
  }

  getAddress(): void {
    this.cepService.consultaCEP(this.data.endereco.cep).subscribe((data: any) => {
      this.data.endereco.logradouro = data.logradouro;
      this.data.endereco.complemento = data.complemento;
      this.data.endereco.bairro = data.bairro;
      this.data.endereco.cidade = data.localidade;
      this.data.endereco.estado = this.cepService.getStateName(data.uf);
      this.data.endereco.uf = data.uf;
    });
  }


}
