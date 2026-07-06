# CollabTravel

Aplicação fullstack para planejamento colaborativo de viagens, com:

- autenticação
- criação de viagens
- participantes
- votações
- despesas
- contato com o desenvolvedor

O projeto está organizado assim:

- `index.js` e `src/`: backend Node.js + Express + PostgreSQL
- `frontend/`: frontend React + Vite
- `doc/endpoints.md`: contrato atualizado da API

---

## 1. Pré-requisitos

Antes de começar, instale:

- `Node.js` 18 ou superior
- `npm`
- `Docker Desktop` ou PostgreSQL local

Para conferir:

```powershell
node -v
npm -v
docker -v
```

---

## 2. Clonar e entrar no projeto

Se você ainda não tiver o projeto:

```powershell
git clone https://github.com/italo-flamia/praticasextensionistas.git
cd praticasextensionistas
git checkout collabtravel/v1.0.0
```

Se já tiver o projeto clonado:

```powershell
git checkout collabtravel/v1.0.0
git pull
```

---

## 3. Configurar o banco de dados

Você tem 2 opções.

### Opção A — usando Docker

Na raiz do projeto:

```powershell
docker compose up -d
```

Isso sobe um PostgreSQL com:

- banco: `collabtravel`
- usuário: `root`
- senha: `root`
- porta: `5432`

---

### Opção B — usando PostgreSQL local

Crie manualmente um banco chamado:

```text
collabtravel
```

Depois ajuste seu `.env`.

---

## 4. Configurar o backend

Na raiz do projeto, crie o arquivo `.env`.

Você pode copiar do exemplo:

```powershell
Copy-Item .env.example .env
```

Conteúdo esperado:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=collabtravel
PORT=3001
JWT_SECRET=collabtravel_secret_dev
```

---

## 5. Instalar dependências do backend

Na raiz:

```powershell
npm install
```

---

## 6. Criar as tabelas do banco

Você precisa rodar as migrations SQL na ordem.

Arquivos:

- `migrations/001_create_usuarios.sql`
- `migrations/002_create_viagens.sql`
- `migrations/003_create_participantes.sql`
- `migrations/004_create_votacoes.sql`
- `migrations/005_create_opcoes.sql`
- `migrations/006_create_votos.sql`
- `migrations/007_create_despesas.sql`
- `migrations/008_alter_participantes_cascade.sql`
- `migrations/009_create_contato.sql`

Se estiver usando Docker, um jeito simples é entrar no container:

```powershell
docker exec -it viagens_db psql -U root -d collabtravel
```

Lá dentro, rode os SQLs copiando o conteúdo de cada arquivo na ordem acima.

Se preferir rodar cada arquivo por comando:

```powershell
Get-Content .\migrations\001_create_usuarios.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\002_create_viagens.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\003_create_participantes.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\004_create_votacoes.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\005_create_opcoes.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\006_create_votos.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\007_create_despesas.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\008_alter_participantes_cascade.sql | docker exec -i viagens_db psql -U root -d collabtravel
Get-Content .\migrations\009_create_contato.sql | docker exec -i viagens_db psql -U root -d collabtravel
```

---

## 7. Rodar o backend

Na raiz do projeto:

### Modo desenvolvimento

```powershell
npm run dev
```

### Modo normal

```powershell
npm start
```

Se tudo estiver certo, o backend sobe em:

```text
http://localhost:3001
```

Teste rápido:

```text
http://localhost:3001/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "mensagem": "Servidor rodando!"
}
```

---

## 8. Configurar o frontend

Agora entre na pasta do frontend:

```powershell
cd frontend
```

Crie o `.env`:

```powershell
Copy-Item .env.example .env
```

Conteúdo esperado:

```env
VITE_API_URL=http://localhost:3001
```

---

## 9. Instalar dependências do frontend

Dentro de `frontend/`:

```powershell
npm install
```

---

## 10. Rodar o frontend

Dentro de `frontend/`:

```powershell
npm run dev
```

O frontend normalmente sobe em:

```text
http://localhost:3000
```

ou outra porta mostrada no terminal.

---

## 11. Ordem correta para iniciar tudo

Use esta ordem:

1. subir o banco
2. garantir que as tabelas existem
3. rodar o backend
4. rodar o frontend

Resumo:

```powershell
docker compose up -d
npm install
npm run dev
cd frontend
npm install
npm run dev
```

---

## 12. Como testar rapidamente

### Backend

Abra no navegador:

- `http://localhost:3001/health`

### Frontend

Abra no navegador:

- `http://localhost:3000`

Depois teste este fluxo:

1. criar conta
2. fazer login
3. criar viagem
4. adicionar participante
5. criar votação
6. adicionar despesa
7. abrir resumo da viagem
8. testar formulário de contato

---

## 13. Problemas comuns

### Porta 5432 ocupada

Troque a porta do PostgreSQL local ou pare outro serviço que esteja usando essa porta.

### Porta 3001 ocupada

Mude o valor de `PORT` no `.env` do backend.

### Frontend não conecta no backend

Confirme:

- backend rodando
- `VITE_API_URL=http://localhost:3001`
- sem erro de CORS

### Formulário de contato não envia

Confirme se a migration abaixo foi executada:

- `migrations/009_create_contato.sql`

### Não consigo adicionar participante

O e-mail informado já precisa existir na tabela `usuarios`.

---

## 14. Documentação da API

Consulte:

- `doc/endpoints.md`

