// Mock data used to seed localStorage on first run.
// Field names mirror the future PostgreSQL schema.

export const seedUsers = [
  {
    id_usuario: "u1",
    nome_usuario: "Ana Souza",
    email_usuario: "ana@collab.travel",
    senha_usuario: "123456",
    data_criacao_usuario: "2025-01-10T10:00:00Z",
  },
  {
    id_usuario: "u2",
    nome_usuario: "Bruno Lima",
    email_usuario: "bruno@collab.travel",
    senha_usuario: "123456",
    data_criacao_usuario: "2025-02-01T10:00:00Z",
  },
  {
    id_usuario: "u3",
    nome_usuario: "Carla Dias",
    email_usuario: "carla@collab.travel",
    senha_usuario: "123456",
    data_criacao_usuario: "2025-02-14T10:00:00Z",
  },
];

export const seedTrips = [
  { id_viagem: "v1", titulo_viagem: "Fim de ano em Floripa", status: "Planejamento" },
  { id_viagem: "v2", titulo_viagem: "Trilha na Chapada", status: "Em votação" },
];

export const seedParticipants = [
  { id_participante: "p1", id_usuario: "u1", id_viagem: "v1", funcao_participante: "organizador" },
  { id_participante: "p2", id_usuario: "u2", id_viagem: "v1", funcao_participante: "viajante" },
  { id_participante: "p3", id_usuario: "u3", id_viagem: "v1", funcao_participante: "viajante" },
  { id_participante: "p4", id_usuario: "u1", id_viagem: "v2", funcao_participante: "organizador" },
  { id_participante: "p5", id_usuario: "u2", id_viagem: "v2", funcao_participante: "viajante" },
];

export const seedPolls = [
  {
    id_votacao: "vt1",
    id_viagem: "v1",
    tipo_votacao: "destino",
    permite_multipla: false,
    prazo_votacao: "2025-12-01T23:59:00Z",
    votacao_encerrada_em: null,
  },
  {
    id_votacao: "vt2",
    id_viagem: "v1",
    tipo_votacao: "atividade",
    permite_multipla: true,
    prazo_votacao: "2025-12-05T23:59:00Z",
    votacao_encerrada_em: null,
  },
];

export const seedOptions = [
  { id_opcao: "o1", id_votacao: "vt1", descricao_opcao: "Praia dos Ingleses", opcao_vencedora: false },
  { id_opcao: "o2", id_votacao: "vt1", descricao_opcao: "Lagoa da Conceição", opcao_vencedora: false },
  { id_opcao: "o3", id_votacao: "vt2", descricao_opcao: "Trilha", opcao_vencedora: false },
  { id_opcao: "o4", id_votacao: "vt2", descricao_opcao: "Passeio de barco", opcao_vencedora: false },
  { id_opcao: "o5", id_votacao: "vt2", descricao_opcao: "Sandboard", opcao_vencedora: false },
];

export const seedVotes = [
  { id_voto: "vo1", id_opcao: "o1", id_participante: "p2" },
];

export const seedExpenses = [
  {
    id_despesa: "d1",
    id_viagem: "v1",
    descricao_despesa: "Reserva do Airbnb",
    categoria_despesa: "Hospedagem",
    valor_despesa: 1800,
    data_despesa: "2025-11-15",
    id_registrado_por: "p1",
    id_pagador: "p1",
  },
  {
    id_despesa: "d2",
    id_viagem: "v1",
    descricao_despesa: "Aluguel de carro",
    categoria_despesa: "Transporte",
    valor_despesa: 640,
    data_despesa: "2025-11-16",
    id_registrado_por: "p1",
    id_pagador: "p2",
  },
];
