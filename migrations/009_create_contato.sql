CREATE TABLE contato (
    id_contato SERIAL PRIMARY KEY,
    nome_contato VARCHAR(120) NOT NULL,
    email_contato VARCHAR(60) NOT NULL,
    mensagem_contato VARCHAR(500) NOT NULL,
    data_criacao_contato TIMESTAMP DEFAULT NOW()
);
