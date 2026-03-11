# Configuração do Supabase

Este guia explica como configurar o Supabase para persistir os dados do site.

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Escolha um nome (ex: `aniversario-rafael`)
4. Escolha a região mais próxima (recomendado: `South America`)
5. Clique em "Create new project"

## 2. Obter Credenciais

Após criar o projeto:

1. Vá em **Project Settings** (engrenagem no menu lateral)
2. Clique em **API**
3. Copie:
   - **URL** (ex: `https://abcdefgh12345678.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIs...`)

## 3. Configurar Variáveis de Ambiente

No projeto, crie um arquivo `.env` na raiz:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

Substitua com os valores copiados no passo anterior.

## 4. Criar Tabelas no Supabase

No dashboard do Supabase:

### 4.1 Tabela `guests`

1. Vá em **Table Editor** no menu lateral
2. Clique em **New table**
3. Nome: `guests`
4. Columns:
   - `id`: uuid, primary key, default: `gen_random_uuid()`
   - `name`: text, not null
   - `phone`: text, not null
   - `attending`: boolean, default: true
   - `message`: text, nullable
   - `status`: text, default: 'pending'
   - `created_at`: timestamptz, default: `now()`
   - `updated_at`: timestamptz, default: `now()`

### 4.2 Tabela `companions`

1. Clique em **New table**
2. Nome: `companions`
3. Columns:
   - `id`: uuid, primary key, default: `gen_random_uuid()`
   - `guest_id`: uuid, foreign key → guests(id), onDelete: CASCADE
   - `name`: text, not null
   - `created_at`: timestamptz, default: `now()`

### 4.3 Tabela `site_configurations`

1. Clique em **New table**
2. Nome: `site_configurations`
3. Columns:
   - `id`: uuid, primary key, default: `gen_random_uuid()`
   - `config_key`: text, not null, unique
   - `config_value`: jsonb, default: '{}'
   - `updated_at`: timestamptz, default: `now()`

## 5. Configurar Políticas de Segurança (RLS)

Para cada tabela, habilite RLS e configure as políticas:

### Tabela `guests`

```sql
-- Habilitar RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública
CREATE POLICY "Allow public insert on guests" ON guests
  FOR INSERT TO PUBLIC WITH CHECK (true);

-- Permitir leitura pública
CREATE POLICY "Allow public read on guests" ON guests
  FOR SELECT TO PUBLIC USING (true);

-- Permitir atualização pública
CREATE POLICY "Allow public update on guests" ON guests
  FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);
```

### Tabela `companions`

```sql
-- Habilitar RLS
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública
CREATE POLICY "Allow public insert on companions" ON companions
  FOR INSERT TO PUBLIC WITH CHECK (true);

-- Permitir leitura pública
CREATE POLICY "Allow public read on companions" ON companions
  FOR SELECT TO PUBLIC USING (true);

-- Permitir atualização pública
CREATE POLICY "Allow public update on companions" ON companions
  FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);
```

### Tabela `site_configurations`

```sql
-- Habilitar RLS
ALTER TABLE site_configurations ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Allow public read on site_configurations" ON site_configurations
  FOR SELECT TO PUBLIC USING (true);

-- Permitir atualização pública
CREATE POLICY "Allow public update on site_configurations" ON site_configurations
  FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

-- Permitir inserção pública
CREATE POLICY "Allow public insert on site_configurations" ON site_configurations
  FOR INSERT TO PUBLIC WITH CHECK (true);
```

## 6. Inserir Configurações Padrão

No SQL Editor, execute:

```sql
INSERT INTO site_configurations (config_key, config_value) VALUES
('hero', '{"date": "04 de Abril de 2026", "title": "Rafael Medeiros", "subtitle": "Estou completando mais um ano de vida e quero comemorar com você!", "ctaButton": "Confirmar Presença", "backgroundImage": "/images/rafael-cavalo.jpg", "overlayOpacity": 60, "blurAmount": 2}'::jsonb),
('countdown', '{"title": "Faltam apenas...", "subtitle": "Para a grande celebração", "targetDate": "2026-04-04", "targetTime": "19:00"}'::jsonb),
('about', '{"title": "Sobre o Rafael", "paragraph1": "Amante da vida no campo...", "paragraph2": "Sempre com um sorriso no rosto...", "highlightTitle": "Agora ele tem um novo sonho:", "highlightText": "comprar seu próprio cavalo!", "quote": "A vida é melhor quando vivida com paixão e propósito.", "image": "/images/rafael-escultura.jpg"}'::jsonb),
('eventDetails', '{"title": "Detalhes do Evento", "date": "04 de Abril de 2026", "time": "19:00 horas", "location": "Sítio Recanto das Netinhas", "address": "Estrada Chico Mendes, 900 - Quintas do Jacuba, Contagem - MG", "copyButtonText": "Copiar", "mapsButtonText": "Ver no Maps"}'::jsonb),
('rsvp', '{"title": "Confirme sua Presença", "subtitle": "Sua presença é muito importante! Por favor, confirme até", "deadline": "28 de março", "nameLabel": "Nome Completo", "phoneLabel": "Telefone", "attendingLabel": "Você vai comparecer?", "yesOption": "Sim, vou!", "noOption": "Não poderei", "companionsLabel": "Acompanhantes", "addCompanionButton": "Adicionar Acompanhante", "removeCompanionButton": "Remover", "companionPlaceholder": "Nome do acompanhante", "messageLabel": "Deixe uma mensagem (opcional)", "submitButton": "Enviar Confirmação", "successTitle": "Confirmação Enviada!", "successMessage": "Obrigado por confirmar sua presença!"}'::jsonb),
('pix', '{"title": "Presente no PIX", "description": "Rafael está juntando dinheiro para realizar o sonho de comprar seu próprio cavalo...", "dreamTitle": "O Sonho do Rafael", "dreamText": "Comprar seu próprio cavalo para continuar vivendo sua paixão pelo campo!", "pixKey": "38 998288370", "pixName": "Rafael", "pixBank": "Santander", "copyButtonText": "Copiar Chave PIX", "copiedText": "Copiado!", "thankYouMessage": "Obrigado por fazer parte deste sonho! 🐴"}'::jsonb),
('footer', '{"text": "Feito com ❤️ para celebrar a vida do Rafael", "year": "2026"}'::jsonb),
('colors', '{"primary": "#3D2914", "secondary": "#5C4024", "accent": "#D4AF37", "background": "#F5F0E6", "text": "#3D2914", "textLight": "#5C4024"}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;
```

## 7. Testar Conexão

1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse o site e tente fazer uma confirmação de presença
3. Verifique no Supabase (Table Editor) se os dados foram salvos

## Estrutura das Tabelas

### guests
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | ID único do convidado |
| name | text | Nome do convidado |
| phone | text | Telefone |
| attending | boolean | Se vai comparecer |
| message | text | Mensagem opcional |
| status | text | pending/confirmed/declined |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### companions
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | ID único do acompanhante |
| guest_id | uuid | FK para guests |
| name | text | Nome do acompanhante |
| created_at | timestamptz | Data de criação |

### site_configurations
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | ID único |
| config_key | text | Chave da configuração (hero, rsvp, etc) |
| config_value | jsonb | Valor em JSON |
| updated_at | timestamptz | Data de atualização |

## Funcionalidades

- ✅ Convidados salvos no Supabase
- ✅ Acompanhantes com nomes individuais
- ✅ Configurações do site persistidas
- ✅ Painel admin com lista de convidados e acompanhantes
- ✅ Exportar dados para CSV
- ✅ Marcar presença na hora da festa
- ✅ Excluir convidados
