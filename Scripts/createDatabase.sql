CREATE DATABASE Teste
GO 

USE Teste
GO 

CREATE TABLE dbo.Enderecos(
        Id [int] IDENTITY(1, 1) NOT NULL,
        Logradouro VARCHAR(150) NOT NULL,
        Numero VARCHAR(10) NULL,
        Complemento VARCHAR(50) NULL,
        Bairro VARCHAR(80) NOT NULL,
        Cidade VARCHAR(30) NOT NULL,
        Estado VARCHAR(30) NOT NULL,
        UF VARCHAR(2) NOT NULL,
        CEP VARCHAR(10) NOT NULL,
        CONSTRAINT [PK_Endereco] PRIMARY KEY CLUSTERED (Id ASC) WITH (
            PAD_INDEX = OFF,
            STATISTICS_NORECOMPUTE = OFF,
            IGNORE_DUP_KEY = OFF,
            ALLOW_ROW_LOCKS = ON,
            ALLOW_PAGE_LOCKS = ON
        ) ON [PRIMARY]
    )
GO 

CREATE TABLE dbo.Clientes(
        Id int IDENTITY(1, 1) NOT NULL,
        Nome VARCHAR(150) NOT NULL,
        Documento VARCHAR(20) NULL,
        CONSTRAINT AK_Documento UNIQUE(Documento),
        DataNascimento DATETIME2(7) NOT NULL,
        Telefone VARCHAR (20) NOT NULL,
        EnderecoId int NULL,
        CONSTRAINT PK_Clientes PRIMARY KEY CLUSTERED (Id ASC) WITH (
            PAD_INDEX = OFF,
            STATISTICS_NORECOMPUTE = OFF,
            IGNORE_DUP_KEY = OFF,
            ALLOW_ROW_LOCKS = ON,
            ALLOW_PAGE_LOCKS = ON
        ) ON [PRIMARY]
    )
GO

ALTER TABLE dbo.Clientes WITH CHECK
ADD CONSTRAINT FK_Clientes_Endereco_EnderecoId FOREIGN KEY([EnderecoId]) REFERENCES dbo.Enderecos ([Id]) ON DELETE CASCADE
GO

ALTER TABLE dbo.Clientes CHECK CONSTRAINT FK_Clientes_Endereco_EnderecoId
GO