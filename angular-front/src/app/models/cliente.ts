import { Endereco } from './endereco';

export class Cliente {
  id: number;
  nome: string;
  documento: string;
  dataNascimento: string;
  telefone: string;
  endereco: Endereco;

  constructor(){
    this.endereco = new Endereco();
  }
}
