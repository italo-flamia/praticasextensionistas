CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nome_usuario VARCHAR(60) NOT NULL,
  email_usuario VARCHAR(60) UNIQUE NOT NULL,
  senha_usuario VARCHAR(255) NOT NULL,
  data_criacao_usuario TIMESTAMP DEFAULT NOW()
);
