ALTER TABLE participantes DROP CONSTRAINT participantes_id_viagem_fkey;
ALTER TABLE participantes ADD CONSTRAINT participantes_id_viagem_fkey FOREIGN KEY (id_viagem) REFERENCES viagens(id_viagem) ON DELETE CASCADE;
