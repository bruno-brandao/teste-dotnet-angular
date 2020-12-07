# Teste

Este projeto foi criado para teste e consiste em uma pequena aplicação com cadastro de clientes com os seguintes requisitos:

Campos: Nome, Documento, Data de Nascimento, Telefone e Endereço. O endereço deverá conter o logradouro, número, complemento, bairro, cidade, estado, UF e CEP. 

O sistema utiliza o número do documento para não permitir incluir clientes duplicados.

DEMO: (https://teste-ba913.web.app/)

## Banco de dados

O SGBD utilizado foi o Microsoft SQL Server, e os scripts para criação do banco e das tabelas utilizadas estão na pasta "Scripts".

## API

O backend foi desenvolvido utilizando .NET CORE. Para acesso aos dados foi utilizado o Dapper. O projeto se encontra na pasta "api-dotnet-core".

## Front-end

O frontend foi desenvolvido utilizando o framework Angular. O frontend está desacoplado do backend e consume as funcionalidades via API. O projeto se encontra na pasta "angular-front".

Para cadastro do endereço foi utilizado a API ViaCep.
