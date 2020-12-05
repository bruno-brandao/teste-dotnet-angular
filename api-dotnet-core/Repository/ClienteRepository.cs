using AdcosApi.Domain;
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

        public bool Add(Cliente cliente)
        {
            int count = 0;
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();

                    using (var transaction = con.BeginTransaction())
                    {
                        try
                        {
                            var queryEndereco = $@"INSERT INTO Enderecos(Logradouro, Numero, Complemento, Bairro, Cidade, Estado, UF, CEP) 
                                                OUTPUT INSERTED.Id
                                                VALUES(@Logradouro, @Numero, @Complemento, @Bairro, @Cidade, @Estado, @UF, @CEP);";

                            SqlCommand cmd = new SqlCommand(queryEndereco, con, transaction);
                            cmd.Parameters.AddWithValue("@Logradouro", cliente.Endereco.Logradouro);
                            cmd.Parameters.AddWithValue("@Numero", cliente.Endereco.Numero);
                            cmd.Parameters.AddWithValue("@Complemento", cliente.Endereco.Complemento);
                            cmd.Parameters.AddWithValue("@Bairro", cliente.Endereco.Bairro);
                            cmd.Parameters.AddWithValue("@Cidade", cliente.Endereco.Cidade);
                            cmd.Parameters.AddWithValue("@Estado", cliente.Endereco.Estado);
                            cmd.Parameters.AddWithValue("@UF", cliente.Endereco.UF);
                            cmd.Parameters.AddWithValue("@CEP", cliente.Endereco.CEP);

                            var idEndereco = cmd.ExecuteScalar();

                            cliente.EnderecoId = int.Parse(idEndereco.ToString());

                            var queryCliente = $@"INSERT INTO Clientes(Nome, Documento, DataNascimento, Telefone, EnderecoId) 
                                            VALUES(@Nome, @Documento, @DataNascimento, @Telefone, @EnderecoId);";

                            cmd = new SqlCommand(queryCliente, con, transaction);
                            cmd.Parameters.AddWithValue("@Nome", cliente.Nome);
                            cmd.Parameters.AddWithValue("@Documento", cliente.Documento);
                            cmd.Parameters.AddWithValue("@DataNascimento", cliente.DataNascimento.ToString("yyyy-MM-dd"));
                            cmd.Parameters.AddWithValue("@Telefone", cliente.Telefone);
                            cmd.Parameters.AddWithValue("@EnderecoId", cliente.EnderecoId);
                            count = cmd.ExecuteNonQuery();
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw ex;
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return count > 0;
            }
        }
        public bool Delete(int id)
        {
            var count = 0;
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();
                    var query = $"DELETE FROM Produtos WHERE ProdutoId = {id}";
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
                return count > 0;
            }
        }
        public bool Update(Cliente cliente)
        {
            var count = 0;
            using (var con = new SqlConnection(_connectionString))
            {
                try
                {
                    con.Open();

                    using (var transaction = con.BeginTransaction())
                    {
                        try
                        {
                            var queryEndereco = $@"UPDATE Enderecos 
                                                    SET Logradouro = @Logradouro, 
                                                        Numero = @Numero, 
                                                        Complemento = @Complemento, 
                                                        Bairro = @Bairro, 
                                                        Cidade = @Cidade, 
                                                        Estado = @Estado, 
                                                        UF = @UF, 
                                                        CEP = @CEP 
                                                    WHERE Id = {cliente.EnderecoId}";

                            SqlCommand cmd = new SqlCommand(queryEndereco, con, transaction);
                            cmd.Parameters.AddWithValue("@Logradouro", cliente.Endereco.Logradouro);
                            cmd.Parameters.AddWithValue("@Numero", cliente.Endereco.Numero);
                            cmd.Parameters.AddWithValue("@Complemento", cliente.Endereco.Complemento);
                            cmd.Parameters.AddWithValue("@Bairro", cliente.Endereco.Bairro);
                            cmd.Parameters.AddWithValue("@Cidade", cliente.Endereco.Cidade);
                            cmd.Parameters.AddWithValue("@Estado", cliente.Endereco.Estado);
                            cmd.Parameters.AddWithValue("@UF", cliente.Endereco.UF);
                            cmd.Parameters.AddWithValue("@CEP", cliente.Endereco.CEP);

                            var idEndereco = cmd.ExecuteScalar();

                            cliente.EnderecoId = int.Parse(idEndereco.ToString());

                            var queryCliente = $@"UPDATE Clientes 
                                                    SET Nome = @Nome, 
                                                        DataNascimento = @DataNascimento, 
                                                        Telefone = @Telefone 
                                                    WHERE Id = {cliente.Id}";

                            cmd = new SqlCommand(queryCliente, con, transaction);
                            cmd.Parameters.AddWithValue("@Nome", cliente.Nome);
                            cmd.Parameters.AddWithValue("@DataNascimento", cliente.DataNascimento.ToString("yyyy-MM-dd HH:mm:ss"));
                            cmd.Parameters.AddWithValue("@Telefone", cliente.Telefone);
                            count = cmd.ExecuteNonQuery();
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw ex;
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return count > 0;
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
                    var query = $"SELECT * FROM dbo.Clientes C LEFT JOIN dbo.Enderecos E ON E.Id = C.EnderecoId WHERE C.Id = {id}";
                    cliente = con.Query<Cliente, Endereco, Cliente>(query,
                    map: (cliente, endereco) =>
                    {
                        cliente.Endereco = endereco;
                        return cliente;
                    }).FirstOrDefault();
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
        public bool ClienteExiste(string documento)
        {
            using (var con = new SqlConnection(_connectionString))
            {
                bool existe = false;
                try
                {
                    con.Open();
                    var query = $"SELECT 1 FROM dbo.Clientes WHERE Documento = {documento}";
                    existe = con.ExecuteScalar<bool>(query);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return existe;
            }
        }
        public bool ClienteExiste(int id)
        {
            using (var con = new SqlConnection(_connectionString))
            {
                bool existe = false;
                try
                {
                    con.Open();
                    var query = $"SELECT 1 FROM dbo.Clientes WHERE Id = {id}";
                    existe = con.ExecuteScalar<bool>(query);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
                return existe;
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
                    var query = "SELECT * FROM dbo.Clientes C LEFT JOIN dbo.Enderecos E ON E.Id = C.EnderecoId";
                    clientes = con.Query<Cliente, Endereco, Cliente>(query,
                    map: (cliente, endereco) =>
                    {
                        cliente.Endereco = endereco;
                        return cliente;
                    }).ToList();
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