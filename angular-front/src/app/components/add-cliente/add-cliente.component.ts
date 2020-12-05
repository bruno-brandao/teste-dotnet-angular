import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { Endereco } from 'src/app/models/endereco';
import { ConsultaCepService } from 'src/app/services/consulta-cep.service';
import { ToastrService } from 'ngx-toastr';
import { BrMaskDirective, BrMaskModel } from 'br-mask';
import * as moment from 'moment';

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
    private toastr: ToastrService,
    public brMask: BrMaskDirective) {
    if (this.data.id) {
      const config: BrMaskModel = new BrMaskModel();
      config.person = true;
      this.data.documento = this.brMask.writeCreateValue(this.data.documento, config);
      this.data.dataNascimento = moment(this.data.dataNascimento).format('YYYY-MM-DD');
    }
  }

  ngOnInit(): void {
    if (!this.data.id) {
      this.data.endereco = new Endereco();
    }
  }

  getErrorMessage(): any {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit(): any {
    if (this.data.id) {
      this.dataService.updateItem(this.data).subscribe(
        (data) => {
          this.dataService.dialogData = data;
          this.toastr.success('Cliente alterado com sucesso!');
          this.dialogRef.close(1);
        },
        (error) => {
          this.toastr.error(error?.error?.mensagem || error.message);
        }
      );
    } else {
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addItem(this.data);
  }

  getAddress(): void {
    this.cepService.consultaCEP(this.data.endereco.cep).subscribe(
      (data: any) => {
        if (!data.erro) {
          this.data.endereco.logradouro = data.logradouro;
          this.data.endereco.complemento = data.complemento;
          this.data.endereco.bairro = data.bairro;
          this.data.endereco.cidade = data.localidade;
          this.data.endereco.estado = this.cepService.getStateName(data.uf);
          this.data.endereco.uf = data.uf;
        } else {
          this.toastr.error('Cep não encontrado');
        }
      },
      (error) => {
        this.toastr.error('Cep não encontrado');
      }
    );
  }


}
