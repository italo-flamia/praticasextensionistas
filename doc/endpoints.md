# 📋 Contrato de API — Gerenciador de Viagens em Grupo

> Documento de referência compartilhado entre **backend (Node.js)** e **frontend (React)**.  
> Qualquer alteração nos endpoints deve ser combinada entre as partes e refletida aqui antes de ser implementada.

---

## 📌 Índice

1. [Como usar este documento](#como-usar-este-documento)
2. [Autenticação JWT](#autenticação-jwt)
3. [Endpoints — Autenticação](#1-autenticação)
4. [Endpoints — Viagens](#2-viagens-)
5. [Endpoints — Participantes](#3-participantes-)
6. [Endpoints — Votações](#4-votações-)
7. [Endpoints — Despesas](#5-despesas-)
8. [Códigos de resposta HTTP](#códigos-de-resposta-http)
9. [Ordem de implementação](#ordem-de-implementação)

---

## Como usar este documento

| Elemento | Significado |
|---|---|
| **Body da requisição** | JSON que o frontend envia para o backend |
| **Resposta** | JSON que o backend devolve para o frontend |
| `GET` | Busca dados — não altera nada no banco |
| `POST` | Cria um novo registro |
| `PUT` | Atualiza um registro existente |
| `DELETE` | Remove um registro |
| `:id` | Parâmetro dinâmico na URL — ex: `/api/viagens/42` |
| 🔒 | Endpoint protegido — exige token JWT no cabeçalho |
---

## Autenticação JWT

Após o login, o backend devolve um token JWT. O frontend deve armazená-lo e enviá-lo no cabeçalho de **todas** as requisições seguintes:
> 💡 O token expira em **24h**. Após isso, o usuário precisa fazer login novamente.  
> ⚠️ Endpoints marcados com 🔒 retornam **erro 401** se o token estiver ausente ou inválido.

---

## 1. Autenticação

> Ponto de entrada do sistema. Deve ser implementado antes de qualquer outra funcionalidade.

---

### `POST /api/auth/registro` — Criar conta

**Body da requisição:**
```json
{
  "nome":  "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Resposta `201`:**
```json
{
  "id":       1,
  "nome":     "João Silva",
  "email":    "joao@email.com",
  "criadoEm": "2025-06-23T14:00:00Z"
}
```

> ⚠️ A senha **nunca** deve ser devolvida na resposta.  
> ⚠️ A senha é salva criptografada (bcrypt) — nunca em texto puro.  
> ⚠️ Se o e-mail já estiver cadastrado, retornar erro `409`.

---

### `POST /api/auth/login` — Fazer login

**Body da requisição:**
```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Resposta `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "usuario": {
    "id":    1,
    "nome":  "João Silva",
    "email": "joao@email.com"
  }
}
```

> 💡 O frontend armazena o token e o envia em todas as requisições seguintes.  
> ⚠️ Se e-mail ou senha estiverem errados, retornar erro `401` sem indicar qual dos dois está errado.

---

### `POST /api/auth/logout` — Sair 🔒

Não há body — o token JWT é suficiente para identificar quem está saindo.

**Resposta `200`:**
```json
{ "mensagem": "Logout realizado com sucesso." }
```

> 💡 O frontend deve apagar o token armazenado após o logout.
---

## 2. Viagens 🔒

> Todos os endpoints de viagem exigem autenticação.  
> O usuário que cria a viagem torna-se automaticamente o **organizador**.

---

### `GET /api/viagens` — Listar minhas viagens

**Resposta `200`:**
```json
[
  {
    "id":          1,
    "titulo":      "Viagem pra Floripa",
    "status":      "planejamento",
    "minhaFuncao": "organizador"
  },
  {
    "id":          2,
    "titulo":      "Gramado com a galera",
    "status":      "em_andamento",
    "minhaFuncao": "viajante"
  }
]
```

> 💡 O backend usa o ID do usuário extraído do token JWT — o frontend não precisa enviar nada.  
> 💡 `status` pode ser: `planejamento` | `em_andamento` | `encerrada`

---

### `POST /api/viagens` — Criar viagem

**Body da requisição:**
```json
{
  "titulo": "Viagem pra Floripa"
}
```

**Resposta `201`:**
```json
{
  "id":            1,
  "titulo":        "Viagem pra Floripa",
  "status":        "planejamento",
  "organizadorId": 1,
  "criadaEm":      "2025-06-23T14:00:00Z"
}
```

> 💡 O `organizadorId` é extraído do token JWT — o frontend não precisa enviar.  
> 💡 O status começa sempre como `planejamento`.

---

### `GET /api/viagens/:id` — Detalhes da viagem

**Resposta `200`:**
```json
{
  "id":            1,
  "titulo":        "Viagem pra Floripa",
  "status":        "planejamento",
  "destino":       "Florianópolis",
  "dataInicio":    "2025-08-10",
  "dataFim":       "2025-08-15",
  "atividades":    ["Trilha", "Rafting"],
  "organizadorId": 1
}
```

> 💡 Destino, datas e atividades só aparecem após as votações serem encerradas.  
> ⚠️ Apenas participantes da viagem podem acessar este endpoint.

---

### `PUT /api/viagens/:id` — Editar viagem

**Body da requisição:**
```json
{
  "titulo": "Floripa 2025",
  "status": "em_andamento"
}
```

**Resposta `200`:**
```json
{
  "id":     1,
  "titulo": "Floripa 2025",
  "status": "em_andamento"
}
```

> ⚠️ Retornar erro `403` se quem chamou não for o organizador.

---

### `DELETE /api/viagens/:id` — Cancelar viagem

**Resposta `200`:**
```json
{ "mensagem": "Viagem removida com sucesso." }
```

> ⚠️ Ação irreversível — o frontend deve pedir confirmação antes de chamar.  
> ⚠️ Retornar erro `403` se quem chamou não for o organizador.
---

## 3. Participantes 🔒

---

### `POST /api/viagens/:id/convites` — Convidar participante

**Body da requisição:**
```json
{
  "email": "ana@email.com"
}
```

**Resposta `201`:**
```json
{
  "mensagem":     "Convite enviado para ana@email.com",
  "tokenConvite": "abc123xyz"
}
```

> 💡 O token de convite é único e tem prazo de validade (48h).  
> 💡 O frontend pode exibir o link para o organizador compartilhar manualmente.  
> ⚠️ Apenas o organizador pode convidar.

---

### `POST /api/convites/:token/aceitar` — Aceitar convite

**Resposta `200`:**
```json
{
  "mensagem": "Você agora faz parte da viagem!",
  "viagemId": 1
}
```

> ⚠️ Se o token estiver expirado ou inválido, retornar erro `400`.  
> 💡 O novo participante entra com a função `viajante` por padrão.

---

### `GET /api/viagens/:id/participantes` — Listar participantes

**Resposta `200`:**
```json
[
  { "id": 1, "nome": "João Silva",  "funcao": "organizador" },
  { "id": 2, "nome": "Ana Souza",   "funcao": "viajante"    },
  { "id": 3, "nome": "Pedro Costa", "funcao": "viajante"    }
]
```

---

### `DELETE /api/viagens/:id/participantes/:userId` — Remover participante

**Resposta `200`:**
```json
{ "mensagem": "Participante removido com sucesso." }
```

> ⚠️ O organizador não pode remover a si mesmo.  
> ⚠️ Retornar erro `403` se quem chamou não for o organizador.
---

## 4. Votações 🔒

> Uma votação encerra automaticamente quando:  
> 1. O prazo definido expira, **ou**  
> 2. Todos os participantes já votaram.

---

### `POST /api/viagens/:id/votacoes` — Criar votação

**Body da requisição:**
```json
{
  "titulo":          "Qual destino?",
  "tipo":            "destino",
  "permiteMultipla": false,
  "prazo":           "2025-07-01T23:59:00Z",
  "opcoes": [
    "Florianópolis",
    "Gramado",
    "Bonito"
  ]
}
```

**Resposta `201`:**
```json
{
  "id":              1,
  "titulo":          "Qual destino?",
  "tipo":            "destino",
  "permiteMultipla": false,
  "prazo":           "2025-07-01T23:59:00Z",
  "encerrada":       false,
  "opcoes": [
    { "id": 1, "descricao": "Florianópolis", "votos": 0 },
    { "id": 2, "descricao": "Gramado",       "votos": 0 },
    { "id": 3, "descricao": "Bonito",        "votos": 0 }
  ]
}
```

> 💡 `tipo` pode ser: `destino` | `data` | `atividade` ou qualquer texto livre.  
> 💡 Se `permiteMultipla` for `false`, cada participante vota em apenas uma opção.  
> 💡 Se `permiteMultipla` for `true`, o participante pode votar em várias opções.  
> ⚠️ Apenas o organizador pode criar votações.

---

### `GET /api/viagens/:id/votacoes` — Listar votações

**Resposta `200`:**
```json
[
  {
    "id":        1,
    "titulo":    "Qual destino?",
    "tipo":      "destino",
    "encerrada": false,
    "prazo":     "2025-07-01T23:59:00Z",
    "opcoes": [
      { "id": 1, "descricao": "Florianópolis", "votos": 3 },
      { "id": 2, "descricao": "Gramado",       "votos": 1 }
    ]
  }
]
```

> 💡 O placar é atualizado em tempo real conforme os votos chegam.

---

### `POST /api/votacoes/:id/votar` — Registrar voto

**Body da requisição:**
```json
{ "opcaoIds": [1] }
```

Se `permiteMultipla` for `true`, pode enviar mais de um:
```json
{ "opcaoIds": [1, 3] }
```

**Resposta `200`:**
```json
{
  "mensagem": "Voto registrado com sucesso.",
  "opcoes": [
    { "id": 1, "descricao": "Florianópolis", "votos": 4 },
    { "id": 2, "descricao": "Gramado",       "votos": 1 }
  ]
}
```

> ⚠️ Se o participante já votou nessa votação, retornar erro `409`.  
> ⚠️ Se a votação estiver encerrada, retornar erro `400`.

---

### `PUT /api/votacoes/:id/encerrar` — Encerrar votação

**Resposta `200`:**
```json
{
  "vencedora": {
    "id":        1,
    "descricao": "Florianópolis",
    "votos":     4
  }
}
```

> 💡 O backend também encerra automaticamente quando o prazo vence.  
> 💡 Em caso de empate, o organizador define o desempate.  
> 💡 Após encerrar, o resultado é gravado na viagem.  
> ⚠️ Apenas o organizador pode encerrar manualmente.
---

## 5. Despesas 🔒

> Qualquer participante pode registrar despesas.  
> O resumo financeiro calcula automaticamente quem pagou o quê.

---

### `GET /api/viagens/:id/gastos` — Listar gastos

**Resposta `200`:**
```json
[
  {
    "id":                1,
    "descricao":         "Gasolina ida",
    "valor":             280.00,
    "categoria":         "transporte",
    "data":              "2025-08-10",
    "pagadorId":         1,
    "pagadorNome":       "João Silva",
    "registradoPorId":   1,
    "registradoPorNome": "João Silva"
  }
]
```

---

### `POST /api/viagens/:id/gastos` — Registrar gasto

**Body da requisição:**
```json
{
  "descricao":  "Gasolina ida",
  "valor":      280.00,
  "categoria":  "transporte",
  "data":       "2025-08-10",
  "pagadorId":  1
}
```

**Resposta `201`:**
```json
{
  "id":              1,
  "descricao":       "Gasolina ida",
  "valor":           280.00,
  "categoria":       "transporte",
  "data":            "2025-08-10",
  "pagadorId":       1,
  "registradoPorId": 1
}
```

> 💡 O `registradoPorId` é preenchido automaticamente pelo backend com o ID do usuário logado.  
> 💡 O `pagadorId` vem pré-selecionado como o próprio usuário, mas pode ser alterado.  
> 💡 Categorias sugeridas: `transporte` | `hospedagem` | `alimentacao` | `atividade` | `outro`

---

### `PUT /api/gastos/:id` — Editar gasto

**Body da requisição:**
```json
{
  "descricao": "Gasolina ida e volta",
  "valor":     320.00,
  "categoria": "transporte",
  "data":      "2025-08-10",
  "pagadorId": 1
}
```

**Resposta `200`:**
```json
{
  "id":        1,
  "descricao": "Gasolina ida e volta",
  "valor":     320.00
}
```

> ⚠️ Apenas quem registrou o gasto ou o organizador pode editar.  
> ⚠️ Retornar erro `403` caso contrário.

---

### `DELETE /api/gastos/:id` — Remover gasto

**Resposta `200`:**
```json
{ "mensagem": "Gasto removido com sucesso." }
```

> ⚠️ Apenas quem registrou o gasto ou o organizador pode remover.  
> ⚠️ Retornar erro `403` caso contrário.

---

### `GET /api/viagens/:id/resumo` — Resumo financeiro

**Resposta `200`:**
```json
{
  "totalGeral":     1540.00,
  "mediaPorPessoa": 513.33,
  "porParticipante": [
    {
      "id":        1,
      "nome":      "João Silva",
      "totalPago": 680.00,
      "diferenca": 166.67,
      "categorias": {
        "transporte":  280.00,
        "alimentacao": 400.00
      }
    },
    {
      "id":        2,
      "nome":      "Ana Souza",
      "totalPago": 520.00,
      "diferenca": 6.67,
      "categorias": {
        "hospedagem": 520.00
      }
    },
    {
      "id":        3,
      "nome":      "Pedro Costa",
      "totalPago": 340.00,
      "diferenca": -173.33,
      "categorias": {
        "alimentacao": 340.00
      }
    }
  ]
}
```

> 💡 `diferenca` positiva = pagou mais que a média (a receber).  
> 💡 `diferenca` negativa = pagou menos que a média (a pagar).  
> 💡 O frontend pode usar a diferença para exibir *"Pedro deve R$ 173,33 para João"*.  
> ⚠️ Este cálculo é feito em tempo real pelo backend — nada é salvo no banco.

---

## Códigos de resposta HTTP

| Código | Nome | Quando usar |
|---|---|---|
| `200` | OK | Requisição bem-sucedida (GET, PUT, DELETE) |
| `201` | Created | Recurso criado com sucesso (POST) |
| `400` | Bad Request | Dados inválidos ou faltando no body |
| `401` | Unauthorized | Token JWT ausente, inválido ou expirado |
| `403` | Forbidden | Usuário autenticado mas sem permissão |
| `404` | Not Found | Recurso não encontrado (ID inexistente) |
| `409` | Conflict | E-mail já cadastrado, voto duplicado, etc. |
| `500` | Internal Server Error | Erro inesperado no servidor |

> ⚠️ O frontend **nunca** deve assumir que a resposta será `200`. Sempre tratar os casos de erro com mensagens amigáveis ao usuário.

---

## Ordem de implementação

| # | Módulo | Por quê esta ordem |
|---|---|---|
| 1 | Autenticação | Base de tudo — sem usuário nada funciona |
| 2 | Viagens | Contexto principal do app |
| 3 | Participantes | Depende de viagens existirem |
| 4 | Votações | Depende de participantes existirem |
| 5 | Despesas | Pode ser desenvolvido em paralelo com votações |
