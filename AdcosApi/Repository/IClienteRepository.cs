using System.Collections.Generic;
using AdcosApi.Models;

namespace AdcosApi.Repository
{
    public interface IClienteRepository
    {
        int Add(Cliente cliente);
        List<Cliente> GetClientes();
        Cliente GetCliente(int id);
        int Update(Cliente cliente);
        int Delete(int id);
    }
}