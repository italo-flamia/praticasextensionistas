CREATE TABLE participantes (
   id_participante SERIAL PRIMARY KEY,
   id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
   id_viagem INT NOT NULL REFERENCES viagens(id_viagem),
   funcao_participante VARCHAR(20) NOT NULL
 );
