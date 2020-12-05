import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string) {

    console.log(cep);

    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    // Verifica se campo cep possui valor informado.
    if (cep !== '') {
      // Expressão regular para validar o CEP.
      const validacep = /^[0-9]{8}$/;

      // Valida o formato do CEP.
      if (validacep.test(cep)) {
        return this.http.get(`//viacep.com.br/ws/${cep}/json`);
      }
    }

    return of({});
  }

  getStateName(uf: string): string {
    let stateName = '';
    switch (uf) {
      case 'AC':
        stateName = 'Acre';
        break;
      case 'AL':
        stateName = 'Alagoas';
        break;
      case 'AM':
        stateName = 'Amazonas';
        break;
      case 'BA':
        stateName = 'Bahia';
        break;
      case 'CE':
        stateName = 'Ceará';
        break;
      case 'DF':
        stateName = 'Distrito Federal';
        break;
      case 'ES':
        stateName = 'Espírito Santo';
        break;
      case 'GO':
        stateName = 'Goiás';
        break;
      case 'MA':
        stateName = 'Maranhão';
        break;
      case 'MT':
        stateName = 'Mato Grosso';
        break;
      case 'MS':
        stateName = 'Mato Grosso do Sul';
        break;
      case 'MG':
        stateName = 'Minas Gerais';
        break;
      case 'PA':
        stateName = 'Pará';
        break;
      case 'PB':
        stateName = 'Paraíba';
        break;
      case 'PR':
        stateName = 'Paraná';
        break;
      case 'PE':
        stateName = 'Pernambuco';
        break;
      case 'PI':
        stateName = 'Piauí';
        break;
      case 'RJ':
        stateName = 'Rio de Janeiro';
        break;
      case 'RN':
        stateName = 'Rio Grande do Norte';
        break;
      case 'RS':
        stateName = 'Rio Grande do Sul';
        break;
      case 'RO':
        stateName = 'Rondônia';
        break;
      case 'RR':
        stateName = 'Roraima';
        break;
      case 'SC':
        stateName = 'Santa Catarina';
        break;
      case 'SP':
        stateName = 'São Paulo';
        break;
      case 'SE':
        stateName = 'Sergipe';
        break;
      case 'TO':
        stateName = 'Tocantins';
        break;

      default:
        break;
    }
    return stateName;
  }
}