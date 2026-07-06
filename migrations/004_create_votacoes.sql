CREATE TABLE votacoes (
   id_votacao SERIAL PRIMARY KEY,
   id_viagem INT NOT NULL REFERENCES viagens(id_viagem),
   tipo_votacao VARCHAR(10) NOT NULL,
   permite_multipla BOOL DEFAULT False,
   prazo_votacao TIMESTAMP NOT NULL,
   votacao_encerrada_em TIMESTAMP 
);
