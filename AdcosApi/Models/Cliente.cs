using System;
using System.ComponentModel.DataAnnotations;

namespace AdcosApi.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(150, ErrorMessage="O nome deve ter entre 1 e 150 caracteres")]
        public string Nome { get; set; }
        [StringLength(20, ErrorMessage="O documento deve ter entre 1 e 20 caracteres")]
        public string Documento { get; set; }
        public DateTime DataNascimento { get; set; }
        public string Telefone { get; set; }
        public int EnderecoId { get; set; }
        public Endereco Endereco { get; set; }
    }
}