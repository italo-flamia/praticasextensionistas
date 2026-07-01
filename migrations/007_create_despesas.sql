CREATE TABLE despesas (
   id_despesa SERIAL PRIMARY KEY,
   id_viagem INT NOT NULL REFERENCES viagens(id_viagem),
   descricao_despesa VARCHAR(120) NOT NULL,
   categoria_despesa VARCHAR(120) NOT NULL,
   valor_despesa NUMERIC(10,2) DEFAULT '0.00',
   data_despesa TIMESTAMP DEFAULT NOW(),
   id_registrado_por INT NOT NULL REFERENCES participantes(id_participante),
   id_pagador INT NOT NULL REFERENCES participantes(id_participante)
);
