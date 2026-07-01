CREATE TABLE viagens (
   id_viagem SERIAL PRIMARY KEY, 
   titulo_viagem VARCHAR(60) NOT NULL, 
   status VARCHAR(60) DEFAULT 'Planejamento' NOT NULL
);
