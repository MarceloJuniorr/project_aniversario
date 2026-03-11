# 🎉 Aniversário Rafael Medeiros

Um site elegante e responsivo para celebrar o aniversário de Rafael Medeiros, desenvolvido com tecnologias modernas para proporcionar uma experiência incrível aos convidados.

![Preview do Site](https://via.placeholder.com/800x400/3D2914/D4AF37?text=Aniversário+Rafael+Medeiros)

## ✨ Funcionalidades

### 🏠 Página Principal
- **Hero Section**: Apresentação com imagem de fundo, título e chamada para ação
- **Countdown**: Contador regressivo para a data do evento
- **Sobre Rafael**: Biografia e informações pessoais
- **Detalhes do Evento**: Local, data, horário e código de vestimenta
- **Confirmação de Presença (RSVP)**: Formulário para confirmação com acompanhantes
- **Presentes via PIX**: Seção para contribuições para o sonho de Rafael (comprar cavalo)
- **Footer**: Informações de contato e direitos autorais

### 👨‍💼 Painel Administrativo
- **Autenticação**: Login seguro com senha
- **Gerenciamento de Convidados**: Lista completa com filtros e busca
- **Status dos Convidados**: Marcar como confirmado, pendente ou não vai
- **Acompanhantes**: Visualizar acompanhantes de cada convidado
- **Exclusão de Convidados**: Remover convidados e seus acompanhantes
- **Configurações Dinâmicas**: Personalizar todas as seções do site
- **Export CSV**: Exportar lista de convidados para Excel
- **Reset de Configurações**: Restaurar configurações padrão

### 📱 Responsividade
- Design totalmente responsivo para desktop, tablet e mobile
- Interface otimizada para todas as telas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **React Router** - Roteamento para SPA
- **Sonner** - Notificações toast elegantes

### Backend & Banco de Dados
- **Supabase** - Plataforma backend-as-a-service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança a nível de linha

### Desenvolvimento
- **ESLint** - Linting para código consistente
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Conta no **Supabase** (gratuita)

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/aniversario-rafael.git
   cd aniversario-rafael
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

4. **Configure o Supabase** (veja seção específica abaixo)

5. **Execute o projeto**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

   O site estará disponível em `http://localhost:5173`

## 🗄️ Configuração do Supabase

### 1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Escolha nome: `aniversario-rafael`
4. Selecione região: `South America (São Paulo)`

### 2. Obter Credenciais
1. Vá em **Settings > API**
2. Copie **URL** e **anon public key**
3. Cole no arquivo `.env`

### 3. Criar Tabelas
Execute os scripts SQL no **SQL Editor** do Supabase:

#### Tabela `guests` (Convidados)
```sql
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT true,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabela `companions` (Acompanhantes)
```sql
CREATE TABLE companions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabela `site_configurations` (Configurações)
```sql
CREATE TABLE site_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Configurar Segurança (RLS)
```sql
-- Para guests
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on guests" ON guests FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Allow public read on guests" ON guests FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Allow public update on guests" ON guests FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on guests" ON guests FOR DELETE TO PUBLIC USING (true);

-- Para companions
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on companions" ON companions FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Allow public read on companions" ON companions FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Allow public update on companions" ON companions FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on companions" ON companions FOR DELETE TO PUBLIC USING (true);

-- Para site_configurations
ALTER TABLE site_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on site_configurations" ON site_configurations FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Allow public update on site_configurations" ON site_configurations FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert on site_configurations" ON site_configurations FOR INSERT TO PUBLIC WITH CHECK (true);
```

### 5. Inserir Configurações Padrão
Execute o script de inserção das configurações padrão (disponível em `SUPABASE_SETUP.md`).

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── admin/
│   │   └── ConfigPanel.tsx          # Painel de configurações admin
│   └── ui/                          # Componentes UI reutilizáveis
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
├── context/
│   └── ConfigContext.tsx            # Context para configurações e dados
├── hooks/
│   └── use-mobile.ts                # Hook para detectar mobile
├── lib/
│   ├── supabase.ts                  # Configuração do Supabase
│   └── utils.ts                     # Utilitários
├── pages/
│   ├── Admin.tsx                    # Página do painel admin
│   └── sections/                    # Seções da página principal
│       ├── About.tsx
│       ├── Countdown.tsx
│       ├── EventDetails.tsx
│       ├── Footer.tsx
│       ├── GiftPix.tsx
│       ├── Hero.tsx
│       └── RSVP.tsx
├── App.css                          # Estilos globais
├── App.tsx                          # Componente principal
├── index.css                        # CSS base e Tailwind
└── main.tsx                         # Ponto de entrada

supabase/
└── migrations/                      # Migrações do banco
    ├── 001_initial_schema.sql
    ├── 002_add_dress_code.sql
    └── 003_add_delete_policies.sql

public/
├── images/                          # Imagens do site
└── _redirects                       # Configuração Netlify
```

## 🎯 Como Usar

### Para Convidados
1. Acesse o site
2. Navegue pelas seções para conhecer sobre Rafael
3. Clique em "Confirmar Presença" para RSVP
4. Preencha o formulário com nome, telefone e acompanhantes
5. Deixe uma mensagem opcional
6. Contribua com o presente via PIX se desejar

### Para Administradores
1. Acesse `/admin`
2. Faça login com a senha `rafael2026`
3. Gerencie convidados: confirme presença, exclua registros
4. Personalize o site nas abas de configuração
5. Exporte a lista de convidados para CSV

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executa ESLint

# TypeScript
npm run type-check   # Verifica tipos TypeScript
```

## 🎨 Personalização

### Cores do Tema
As cores podem ser alteradas no painel admin ou diretamente no código:

```typescript
// src/context/ConfigContext.tsx
colors: {
  primary: '#3D2914',      // Marrom escuro
  secondary: '#5C4024',    // Marrom médio
  accent: '#D4AF37',       // Dourado
  background: '#F5F0E6',   // Bege claro
  text: '#3D2914',         // Texto escuro
  textLight: '#5C4024',    // Texto médio
}
```

### Imagens
Coloque as imagens em `public/images/`:
- `rafael-cavalo.jpg` - Imagem do hero
- `rafael-escultura.jpg` - Imagem da seção sobre

### Textos e Configurações
Todos os textos podem ser editados no painel admin sem alterar código.

## 🚀 Deploy

### Netlify
1. Conecte seu repositório GitHub ao Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Adicione variáveis de ambiente no Netlify
4. Deploy automático a cada push

### Vercel
1. Importe o projeto no Vercel
2. Configure variáveis de ambiente
3. Deploy automático

### Outros
Compatível com qualquer host estático que suporte SPA.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **Rafael Medeiros** - Pelo aniversário incrível!
- **Supabase** - Pela plataforma backend incrível
- **Tailwind CSS** - Pelo framework CSS fantástico
- **Vite** - Pela experiência de desenvolvimento rápida

---

**Feito com ❤️ para celebrar a vida do Rafael**

🐴 *Que seu sonho de comprar o cavalo se realize!* 🐴
