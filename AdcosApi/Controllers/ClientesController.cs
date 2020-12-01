using System.Collections.Generic;
using AdcosApi.Models;
using AdcosApi.Repository;
using Microsoft.AspNetCore.Mvc;

namespace AdcosApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteRepository _clienteRepository;

        public ClientesController(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        [HttpGet]
        public IEnumerable<Cliente> Get()
        {
            return _clienteRepository.GetClientes();
        }

        [HttpGet("{id}")]
        public Cliente Get(int id)
        {
            return _clienteRepository.GetCliente(id);
        }
        
    }
}