using System;
using System.Collections.Generic;
using AdcosApi.Domain;
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
        public ActionResult<IEnumerable<Cliente>> Get()
        {
            return Ok(_clienteRepository.GetClientes());
        }

        [HttpGet("{id}")]
        public ActionResult<Cliente> Get(int id)
        {
            Cliente cliente = _clienteRepository.GetCliente(id);

            if (cliente == null)
                return NotFound(
                    new
                    {
                        Mensagem = "Cliente não encontrado"
                    });

            return Ok(cliente);
        }

        [HttpGet("existe/{doc}")]
        public ActionResult<bool> Get(string doc)
        {
            bool existe = _clienteRepository.ClienteExiste(doc);

            return Ok(existe);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateCliente(int id, Cliente cliente)
        {
            try
            {
                if (id != cliente.Id)
                    return BadRequest();

                if (!_clienteRepository.ClienteExiste(cliente.Id))
                    return NotFound();

                if (!_clienteRepository.Update(cliente))
                    throw new Exception("Ocorreu um erro ao atualizar o cliente");

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        Mensagem = ex.Message
                    });
            }
        }

        [HttpPost]
        public ActionResult<Cliente> Create(Cliente cliente)
        {
            try
            {
                if (_clienteRepository.ClienteExiste(cliente.Documento))
                    throw new Exception("Cliente já cadastrado na base de dados");

                if (!_clienteRepository.Add(cliente))
                    throw new Exception("Ocorreu um erro ao criar o cliente");

                return CreatedAtAction(
                    nameof(Get),
                    new { id = cliente.Id },
                    cliente);
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        Mensagem = ex.Message
                    });
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try
            {
                var cliente = _clienteRepository.GetCliente(id);

                if (cliente == null)
                {
                    return NotFound();
                }

                _clienteRepository.Delete(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        Mensagem = ex.Message
                    });
            }
        }
    }
}