CREATE TABLE votos (
   id_voto SERIAL PRIMARY KEY,
   id_opcao INT NOT NULL REFERENCES opcoes(id_opcao),
   id_participante INT NOT NULL REFERENCES participantes(id_participante)
);
