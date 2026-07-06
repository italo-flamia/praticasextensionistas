# 📋 Contrato de API — CollabTravel

> Documento de referência compartilhado entre o **backend** e o **frontend**.
> Este arquivo descreve o comportamento do que está **implementado hoje** no projeto.

---

## Índice

1. [Autenticação JWT](#autenticação-jwt)
2. [Autenticação](#1-autenticação)
3. [Viagens](#2-viagens-)
4. [Participantes](#3-participantes-)
5. [Votações](#4-votações-)
6. [Despesas](#5-despesas-)
7. [Contato](#6-contato)
8. [Códigos HTTP](#7-códigos-http)

---

## Autenticação JWT

Após o login, o backend devolve um token JWT. Esse token deve ser enviado no cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

Os endpoints marcados com 🔒 exigem autenticação.

---

## 1. Autenticação

### `POST /api/auth/registro`

Cria uma conta.

**Body**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta `201`**

```json
{
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "João Silva",
    "email_usuario": "joao@email.com"
  }
}
```

**Erros**

- `400` com `{ "mensagem": "Email já cadastrado" }`

---

### `POST /api/auth/login`

Faz login.

**Body**

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta `200`**

```json
{
  "token": "jwt_aqui"
}
```

**Erros**

- `400` com `{ "mensagem": "Email não cadastrado" }`
- `400` com `{ "mensagem": "Senha incorreta" }`

---

## 2. Viagens 🔒

### `POST /api/viagens`

Cria uma viagem e adiciona automaticamente o usuário logado como `Organizador`.

**Body**

```json
{
  "titulo_viagem": "Porto Alegre"
}
```

**Resposta `201`**

```json
{
  "viagem": {
    "id_viagem": 1,
    "titulo_viagem": "Porto Alegre",
    "status": "Planejamento"
  }
}
```

---

### `GET /api/viagens`

Lista as viagens do usuário autenticado.

**Resposta `200`**

```json
{
  "viagens": [
    {
      "id_viagem": 1,
      "titulo_viagem": "Porto Alegre",
      "status": "Planejamento",
      "id_participante": 3,
      "funcao_participante": "Organizador",
      "id_usuario": 1
    }
  ]
}
```

---

### `PUT /api/viagens/:id_viagem`

Edita título e/ou status da viagem.

**Body**

```json
{
  "titulo_viagem": "Porto Alegre 2026",
  "status": "Em andamento"
}
```

**Resposta `200`**

```json
{
  "viagem": {
    "id_viagem": 1,
    "titulo_viagem": "Porto Alegre 2026",
    "status": "Em andamento"
  }
}
```

**Erros**

- `403` com `{ "mensagem": "Você não participa dessa viagem" }`
- `403` com `{ "mensagem": "Só o organizador pode editar a viagem" }`

---

### `DELETE /api/viagens/:id_viagem`

Exclui a viagem e seus dados relacionados.

**Resposta `200`**

```json
{
  "viagem": {
    "id_viagem": 1,
    "titulo_viagem": "Porto Alegre 2026",
    "status": "Em andamento"
  }
}
```

**Erros**

- `403` com `{ "mensagem": "Você não participa dessa viagem" }`
- `403` com `{ "mensagem": "Só o organizador pode deletar a viagem" }`

---

## 3. Participantes 🔒

### `GET /api/viagens/:id_viagem/participantes`

Lista os participantes da viagem.

**Resposta `200`**

```json
[
  {
    "id_participante": 3,
    "id_usuario": 1,
    "id_viagem": 1,
    "funcao_participante": "Organizador",
    "nome_usuario": "João Silva",
    "email_usuario": "joao@email.com"
  }
]
```

---

### `POST /api/viagens/:id_viagem/participantes`

Adiciona um participante pelo e-mail de um usuário já cadastrado.

**Body**

```json
{
  "email_usuario": "ana@email.com",
  "funcao_participante": "Participante"
}
```

**Resposta `201`**

```json
{
  "id_participante": 4,
  "id_usuario": 2,
  "id_viagem": 1,
  "funcao_participante": "Participante"
}
```

**Erros**

- `403` com `{ "erro": "Usuário não é participante desta viagem" }`
- `403` com `{ "erro": "Só o organizador pode adicionar participantes" }`
- `400` com `{ "erro": "Informe o email do participante" }`
- `400` com `{ "erro": "Usuário com esse email não foi encontrado" }`
- `400` com `{ "erro": "Esse usuário já participa da viagem" }`

---

## 4. Votações 🔒

### `GET /api/viagens/:id_viagem/votacoes`

Lista as votações da viagem.

**Resposta `200`**

```json
[
  {
    "id_votacao": 1,
    "id_viagem": 1,
    "tipo_votacao": "Destino",
    "permite_multipla": false,
    "prazo_votacao": "2026-07-10T23:59:00.000Z",
    "votacao_encerrada_em": null,
    "opcoes": [
      {
        "id_opcao": 1,
        "descricao_opcao": "Gramado",
        "opcao_vencedora": false
      }
    ]
  }
]
```

---

### `POST /api/viagens/:id_viagem/votacoes`

Cria uma votação com pelo menos duas opções.

**Body**

```json
{
  "tipo_votacao": "Destino",
  "permite_multipla": false,
  "prazo_votacao": "2026-07-10T23:59",
  "opcoes": ["Gramado", "Porto Alegre"]
}
```

**Resposta `201`**

```json
{
  "id_votacao": 1,
  "id_viagem": 1,
  "tipo_votacao": "Destino",
  "permite_multipla": false,
  "prazo_votacao": "2026-07-10T23:59:00.000Z",
  "opcoes": [
    {
      "id_opcao": 1,
      "id_votacao": 1,
      "descricao_opcao": "Gramado",
      "opcao_vencedora": false
    }
  ]
}
```

**Erros**

- `403` com `{ "erro": "Usuário não é participante desta viagem" }`
- `400` com `{ "erro": "Informe tipo, prazo e pelo menos duas opções" }`

---

## 5. Despesas 🔒

### `POST /api/viagens/:id_viagem/despesas`

Cria uma despesa.

**Body**

```json
{
  "descricao_despesa": "Hotel",
  "categoria_despesa": "Hospedagem",
  "valor_despesa": 350,
  "data_despesa": "2026-07-05"
}
```

**Resposta `201`**

```json
{
  "id_despesa": 1,
  "id_viagem": 1,
  "descricao_despesa": "Hotel",
  "categoria_despesa": "Hospedagem",
  "valor_despesa": "350.00",
  "data_despesa": "2026-07-05T00:00:00.000Z",
  "id_registrado_por": 3,
  "id_pagador": 3
}
```

---

### `GET /api/viagens/:id_viagem/despesas`

Lista as despesas da viagem.

**Resposta `200`**

```json
[
  {
    "id_despesa": 1,
    "descricao_despesa": "Hotel",
    "categoria_despesa": "Hospedagem",
    "valor_despesa": "350.00",
    "data_despesa": "2026-07-05T00:00:00.000Z",
    "id_registrado_por": 3,
    "id_pagador": 3
  }
]
```

---

### `PUT /api/viagens/:id_viagem/despesas/:id_despesa`

Edita uma despesa.

**Body**

```json
{
  "descricao_despesa": "Hotel 2 diárias",
  "categoria_despesa": "Hospedagem",
  "valor_despesa": 420,
  "data_despesa": "2026-07-06"
}
```

**Resposta `200`**

```json
{
  "id_despesa": 1,
  "id_viagem": 1,
  "descricao_despesa": "Hotel 2 diárias",
  "categoria_despesa": "Hospedagem",
  "valor_despesa": "420.00",
  "data_despesa": "2026-07-06T00:00:00.000Z",
  "id_registrado_por": 3,
  "id_pagador": 3
}
```

---

### `GET /api/viagens/:id_viagem/despesas/resumo`

Gera o resumo financeiro da viagem.

**Resposta `200`**

```json
[
  {
    "nome_usuario": "João Silva",
    "total_pago": 680,
    "diferenca": 166.67
  }
]
```

**Regra**

- `diferenca > 0`: a pessoa pagou mais do que a média
- `diferenca < 0`: a pessoa pagou menos do que a média

---

## 6. Contato

### `POST /api/contato`

Envia uma mensagem de contato.

**Body**

```json
{
  "nome_contato": "Maria",
  "email_contato": "maria@email.com",
  "mensagem_contato": "Encontrei um problema no sistema"
}
```

**Resposta `201`**

```json
{
  "id_contato": 1,
  "nome_contato": "Maria",
  "email_contato": "maria@email.com",
  "mensagem_contato": "Encontrei um problema no sistema",
  "data_criacao_contato": "2026-07-05T20:54:11.857Z"
}
```

**Erros**

- `400` com `{ "erro": "Campos obrigatórios não preenchidos" }`

---

## 7. Códigos HTTP

| Código | Uso |
|---|---|
| `200` | Sucesso em leitura, edição e exclusão |
| `201` | Criação com sucesso |
| `400` | Dados inválidos ou faltando |
| `403` | Usuário sem permissão |
| `500` | Erro interno do servidor |

