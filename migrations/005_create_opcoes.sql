CREATE TABLE opcoes (
   id_opcao SERIAL PRIMARY KEY,
   id_votacao INT NOT NULL REFERENCES votacoes(id_votacao),
   descricao_opcao VARCHAR(60),
   opcao_vencedora BOOL DEFAULT False
);
