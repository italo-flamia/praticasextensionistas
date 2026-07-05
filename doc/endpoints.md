# 📋 Contrato de API — Gerenciador de Viagens em Grupo

> Documento de referência compartilhado entre **backend (Node.js)** e **frontend (React)**.
> Qualquer alteração nos endpoints deve ser combinada entre as partes e refletida aqui antes de ser implementada.
>
> ⚠️ **Atualizado em: Entrega 1.** Este documento reflete o que está **realmente implementado e testado** até agora. Seções marcadas com 🔜 são planejadas, mas ainda não existem no código.

---

## 📌 Índice

1. [Como usar este documento](#como-usar-este-documento)
2. [Autenticação JWT](#autenticação-jwt)
3. [Endpoints — Autenticação](#1-autenticação)
4. [Endpoints — Viagens](#2-viagens-)
5. [Endpoints — Participantes 🔜](#3-participantes--planejado)
6. [Endpoints — Votações 🔜](#4-votações--planejado)
7. [Endpoints — Despesas](#5-despesas-)
8. [Endpoints — Contato](#6-contato)
9. [Códigos de resposta HTTP](#códigos-de-resposta-http)
10. [Dívidas técnicas e melhorias futuras](#dívidas-técnicas-e-melhorias-futuras)

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
| `:id_viagem` | Parâmetro dinâmico na URL — ex: `/api/viagens/42` |
| 🔒 | Endpoint protegido — exige token JWT no cabeçalho `Authorization` |
| 🔜 | Planejado, mas ainda **não implementado** |

> ⚠️ **Convenção de nomes:** os campos dos **bodies de requisição** de Autenticação e Viagens usam nomes simples (`nome`, `email`, `senha`, `titulo_viagem`), mas as **respostas** trazem os nomes de coluna do banco, em snake_case (`id_usuario`, `nome_usuario`, `titulo_viagem`, etc). Não existe conversão para camelCase em nenhuma camada — o frontend recebe os campos exatamente como estão no banco.

---

## Autenticação JWT

Após o login, o backend devolve um token JWT (string). O frontend deve armazená-lo e enviá-lo no cabeçalho `Authorization` de **todas** as requisições para endpoints marcados com 🔒.

> 💡 O token expira em **24h** (`expiresIn: '1d'`).
> ⚠️ Endpoints 🔒 dependem do `authMiddleware`, que injeta `req.usuario.id` a partir do token — se o token estiver ausente/inválido, a requisição é rejeitada antes de chegar ao controller.

---

## 1. Autenticação

### `POST /api/auth/registro` — Criar conta

**Body da requisição:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Resposta `201`:**
```json
{
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "João Silva",
    "email_usuario": "joao@email.com",
    "data_criacao_usuario": "2026-07-05T14:00:00Z"
  }
}
```

> 💡 A resposta vem **aninhada** sob a chave `"usuario"`.
> 💡 A senha nunca é devolvida (removida antes da resposta) e é salva com hash bcrypt.
> ⚠️ Se o e-mail já estiver cadastrado, retorna erro `400` (não `409`) com `{ "mensagem": "Email já cadastrado" }`.

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

> 💡 A resposta traz **só o token** — não há objeto de usuário aninhado.
> ⚠️ Erros retornam `400` (não `401`), com mensagens **distintas**: `{ "mensagem": "Email não cadastrado" }` ou `{ "mensagem": "Senha incorreta" }`. Ver nota em [Dívidas técnicas](#dívidas-técnicas-e-melhorias-futuras).

---

### `POST /api/auth/logout` 🔜

Planejado no documento original, ainda não implementado. Hoje o "logout" é responsabilidade só do frontend (descartar o token armazenado).

---

## 2. Viagens 🔒

> Todas as rotas abaixo passam por `autenticarToken`. O usuário que cria a viagem é inserido automaticamente como participante com função `'Organizador'`.

---

### `POST /api/viagens` — Criar viagem

**Body da requisição:**
```json
{
  "titulo_viagem": "Viagem pra Floripa"
}
```

**Resposta `201`:**
```json
{
  "viagem": {
    "id_viagem": 1,
    "titulo_viagem": "Viagem pra Floripa",
    "status": "Planejamento"
  }
}
```

> 💡 Resposta aninhada sob `"viagem"`. `status` começa sempre como `"Planejamento"` (valor padrão da coluna no banco).
> 💡 O organizador é inserido na tabela `participantes` numa transaction — se der erro em qualquer etapa, nada é salvo (rollback).

---

### `GET /api/viagens` — Listar minhas viagens

**Resposta `200`:**
```json
{
  "viagens": [
    {
      "id_viagem": 1,
      "titulo_viagem": "Viagem pra Floripa",
      "status": "Planejamento",
      "id_participante": 3,
      "funcao_participante": "Organizador",
      "id_usuario": 1
    }
  ]
}
```

> 💡 Resposta aninhada sob `"viagens"`. Cada item vem de um `JOIN` entre `viagens` e `participantes` — por isso traz também `id_participante`, `funcao_participante` e `id_usuario` misturados na mesma linha.
> 💡 O backend usa `req.usuario.id` extraído do token — o frontend não precisa enviar nada.

---

### `GET /api/viagens/:id_viagem` 🔜

Planejado no documento original (detalhe de uma viagem específica, com destino/datas/atividades). **Não implementado ainda** — não existe rota, controller nem service para isso hoje.

---

### `PUT /api/viagens/:id_viagem` — Editar viagem

**Body da requisição:**
```json
{
  "titulo_viagem": "Floripa 2025"
}
```

**Resposta `200`:**
```json
{
  "viagem": {
    "id_viagem": 1,
    "titulo_viagem": "Floripa 2025",
    "status": "Planejamento"
  }
}
```

> ⚠️ Erro `403` se o usuário não participa da viagem: `{ "mensagem": "Você não participa dessa viagem" }`
> ⚠️ Erro `403` se o usuário participa mas não é organizador: `{ "mensagem": "Só o organizador pode editar a viagem" }`
> 💡 Hoje só `titulo_viagem` é editável (não há edição de `status` por este endpoint).

---

### `DELETE /api/viagens/:id_viagem` — Cancelar viagem

**Resposta `200`:**
```json
{
  "viagem": {
    "id_viagem": 1,
    "titulo_viagem": "Floripa 2025",
    "status": "Planejamento"
  }
}
```

> 💡 Resposta traz a viagem que foi deletada (não uma mensagem de confirmação simples).
> ⚠️ Erro `403` se o usuário não participa da viagem: `{ "mensagem": "Você não participa dessa viagem" }`
> ⚠️ Erro `403` se o usuário participa mas não é organizador: `{ "mensagem": "Só o organizador pode deletar a viagem" }`
> ⚠️ Ação irreversível — o frontend deve pedir confirmação antes de chamar. Deleção usa `ON DELETE CASCADE` para remover participantes da viagem automaticamente.

---

## 3. Participantes — 🔜 planejado

> Existe hoje só a camada de repository (`participantesRepository.js`, com `inserirParticipante` e `buscarParticipante`), usada internamente pelos services de Viagens e Despesas para checar se um usuário participa de uma viagem. **Não há controller nem rotas próprias.**
>
> Hoje, a única forma de um participante entrar numa viagem é automaticamente, como organizador, na criação da viagem (`POST /api/viagens`). Não existe convite real.

Planejado para pós-Entrega 1:
- `POST /api/viagens/:id_viagem/convites` — Convidar participante
- `POST /api/convites/:token/aceitar` — Aceitar convite
- `GET /api/viagens/:id_viagem/participantes` — Listar participantes
- `DELETE /api/viagens/:id_viagem/participantes/:id_usuario` — Remover participante

---

## 4. Votações — 🔜 planejado

> Migrations das tabelas `votacoes`, `opcoes` e `votos` já existem e foram executadas, mas **nenhuma rota, controller, service ou repository foi implementado ainda.**
>
> ⚠️ Pendência conhecida a revisitar quando Votações for implementado: as FKs de `votos.id_participante` não têm `ON DELETE CASCADE`. Se uma viagem com votos existentes for deletada, o `CASCADE` de `viagens → participantes` pode falhar ao tentar remover um participante que ainda tem votos referenciando-o.

Planejado (mantendo a proposta original):
- `POST /api/viagens/:id_viagem/votacoes` — Criar votação
- `GET /api/viagens/:id_viagem/votacoes` — Listar votações
- `POST /api/votacoes/:id_votacao/votar` — Registrar voto
- `PUT /api/votacoes/:id_votacao/encerrar` — Encerrar votação

---

## 5. Despesas 🔒

> Rota aninhada: `/api/viagens/:id_viagem/despesas` (uma despesa não existe fora do contexto de uma viagem). Todas as rotas exigem `autenticarToken`, e a checagem de permissão é "é participante da viagem?" — **qualquer participante** pode registrar despesa, não só o organizador.

---

### `POST /api/viagens/:id_viagem/despesas` — Registrar despesa

**Body da requisição:**
```json
{
  "descricao_despesa": "Gasolina ida",
  "categoria_despesa": "transporte",
  "valor_despesa": 280.00,
  "id_pagador": 3
}
```

**Resposta `201`:**
```json
{
  "id_despesa": 1,
  "id_viagem": 1,
  "descricao_despesa": "Gasolina ida",
  "categoria_despesa": "transporte",
  "valor_despesa": "280.00",
  "data_despesa": "2026-07-05T14:00:00Z",
  "id_registrado_por": 3,
  "id_pagador": 3
}
```

> 💡 Resposta vem **direto**, sem chave envolvente (diferente de Viagens).
> 💡 `id_pagador` é **opcional** no body — se omitido, assume automaticamente quem registrou (`id_registrado_por`).
> 💡 `valor_despesa` volta como **string** na resposta (tipo `NUMERIC` do Postgres via `pg`) — o frontend deve converter com `Number(...)` antes de somar.
> ⚠️ Erro `403` se o usuário não participa da viagem: `{ "erro": "Usuário não é participante desta viagem" }`

---

### `GET /api/viagens/:id_viagem/despesas` — Listar despesas

**Resposta `200`:**
```json
[
  {
    "id_despesa": 1,
    "descricao_despesa": "Gasolina ida",
    "categoria_despesa": "transporte",
    "valor_despesa": "280.00",
    "data_despesa": "2026-07-05T14:00:00Z",
    "id_registrado_por": 3,
    "id_pagador": 3
  }
]
```

> 💡 Resposta é um **array direto** (sem chave envolvente), ordenado por `data_despesa DESC` (mais recente primeiro).
> ⚠️ Mesmo erro `403` de permissão que a criação.

---

### `GET /api/viagens/:id_viagem/despesas/resumo` — Resumo financeiro

**Resposta `200`:**
```json
[
  {
    "nome_usuario": "João Silva",
    "total_pago": "680.00",
    "diferenca": 166.67
  },
  {
    "nome_usuario": "Ana Souza",
    "total_pago": "520.00",
    "diferenca": 6.67
  }
]
```

> 💡 Resposta é um **array direto** de participantes — não há `totalGeral` nem `mediaPorPessoa` na resposta (calculados internamente, mas não expostos), e não há quebra por categoria.
> ⚠️ **Atenção de tipo:** `total_pago` volta como **string**, mas `diferenca` já volta como **number** (já passou por `Number(...)` no cálculo). O frontend precisa tratar os dois campos de formas diferentes.
> 💡 `diferenca` positiva = pagou mais que a média (a receber). `diferenca` negativa = pagou menos que a média (a pagar).
> ⚠️ Calculado em tempo real — nada é salvo no banco.
> ⚠️ Mesmo erro `403` de permissão que os outros endpoints de despesas.

---

## 6. Contato

> Rota **pública** — não exige autenticação. Existe para permitir que qualquer pessoa (inclusive quem não conseguiu fazer login) entre em contato com a equipe de desenvolvimento.

---

### `POST /api/contato` — Enviar mensagem de contato

**Body da requisição:**
```json
{
  "nome_contato": "Maria",
  "email_contato": "maria@teste.com",
  "mensagem_contato": "Tenho uma dúvida sobre o app"
}
```

**Resposta `201`:**
```json
{
  "id_contato": 1,
  "nome_contato": "Maria",
  "email_contato": "maria@teste.com",
  "mensagem_contato": "Tenho uma dúvida sobre o app",
  "data_criacao_contato": "2026-07-05T20:54:11.857Z"
}
```

> 💡 Resposta vem direto, sem chave envolvente — mesmo padrão de Despesas.
> 💡 Os três campos são obrigatórios. `email_contato` **não** é único — o mesmo e-mail pode enviar contato mais de uma vez.
> ⚠️ Erro `400` se algum campo estiver vazio/ausente: `{ "erro": "Campos obrigatórios não preenchidos" }`

---

## Códigos de resposta HTTP

| Código | Nome | Quando é usado hoje |
|---|---|---|
| `200` | OK | Requisição bem-sucedida (GET, PUT, DELETE) |
| `201` | Created | Recurso criado com sucesso (POST) |
| `400` | Bad Request | Dado inválido/faltando — **e também** usado hoje para e-mail duplicado e falha de login (ver dívidas técnicas) |
| `403` | Forbidden | Usuário autenticado mas sem permissão (não é participante, ou não é organizador) |
| `500` | Internal Server Error | Erro inesperado no servidor |

> ⚠️ Hoje o backend **não usa** `401`, `404` nem `409` em nenhum endpoint implementado, ao contrário do que o contrato original planejava. O frontend deve tratar principalmente `400`, `403` e `500`.

---

## Dívidas técnicas e melhorias futuras

- **Login/Registro usam sempre `400`** para erros que conceitualmente seriam `401` (senha incorreta) ou `409` (e-mail duplicado). Funciona, mas não segue o padrão HTTP mais preciso — considerar ajustar quando houver tempo.
- **Mensagens de erro distintas em login** (`"Email não cadastrado"` vs `"Senha incorreta"`) revelam se um e-mail está cadastrado ou não. Prática mais segura seria uma mensagem genérica para os dois casos.
- **FKs de `despesas` e `votos` sem `CASCADE`** apontando para `participantes.id_participante` — revisar ao implementar Votações de verdade.
- **Checagem de tipo de erro via `erro.message.includes(...)`** é frágil — melhoria futura seria criar uma classe de erro customizada (`ErroPermissao extends Error`) e checar com `instanceof`.
- **`valor_despesa` e `total_pago` voltam como string** (tipo `NUMERIC` do Postgres) em vez de number — frontend precisa converter manualmente.
- **Falta de rota `GET /api/viagens/:id_viagem`** (detalhe de viagem) — hoje o frontend só tem acesso aos dados de viagem através da listagem.