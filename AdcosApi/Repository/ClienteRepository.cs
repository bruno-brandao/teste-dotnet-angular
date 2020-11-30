using AdcosApi.Models;
using Microsoft.Extensions.Configuration;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.SqlClient;

namespace AdcosApi.Repository
{
    public class ClienteRepository : IClienteRepository
    {
        IConfiguration _configuration;
        private readonly string _connectionString;

        public ClienteRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("Default");
        }

        public int Add(Cliente cliente)
        {
            int count = 0;
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();
                    var query = "INSERT INTO Produtos(Nome, Estoque, Preco) VALUES(@Nome, @Estoque, @Preco); SELECT CAST(SCOPE_IDENTITY() as INT); ";
                    count = con.Execute(query, cliente);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return count;
            }
        }
        public int Delete(int id)
        {
            var count = 0;
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();
                    var query = "DELETE FROM Produtos WHERE ProdutoId =" + id;
                    count = con.Execute(query);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return count;
            }
        }
        public int Update(Cliente cliente)
        {
            var count = 0;
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();
                    var query = "UPDATE Produtos SET Name = @Nome, Estoque = @Estoque, Preco = @Preco WHERE ProdutoId = " + cliente.Id;
                    count = con.Execute(query, cliente);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return count;
            }
        }
        public Cliente GetCliente(int id)
        {
            Cliente cliente = null;
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();
                    var query = "SELECT * FROM dbo.Clientes C" +
                                "INNER JOIN dbo.Enderecos E ON E.Id = C.EnderecoId WHERE C.Id =" + id;
                    cliente = con.Query<Cliente, Endereco, Cliente>(query,
                    map: (cliente, endereco) =>
                    {
                        cliente.Endereco = endereco;
                        return cliente;
                    },
                    splitOn: "Id,IdEndereco").FirstOrDefault();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return cliente;
            }
        }
        public List<Cliente> GetClientes()
        {
            List<Cliente> clientes = new List<Cliente>();
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();
                    var query = "SELECT * FROM Clientes";
                    clientes = con.Query<Cliente>(query).ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return clientes;
            }
        }

    }
}