using System.Collections.Generic;
using AdcosApi.Models;

namespace AdcosApi.Repository
{
    public interface IClienteRepository
    {
        bool Add(Cliente cliente);
        List<Cliente> GetClientes();
        Cliente GetCliente(int id);
        bool Update(Cliente cliente);
        bool Delete(int id);
    }
}