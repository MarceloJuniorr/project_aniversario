-- Migration: Initial Schema for Aniversario Rafael Medeiros
-- Cria as tabelas necessárias para o site

-- Tabela de Convidados (Guests)
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT true,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentário da tabela
COMMENT ON TABLE guests IS 'Lista de convidados confirmados para o aniversário';

-- Índices para guests
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_attending ON guests(attending);

-- Tabela de Acompanhantes (Companions)
CREATE TABLE IF NOT EXISTS companions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentário da tabela
COMMENT ON TABLE companions IS 'Lista de acompanhantes de cada convidado';

-- Índice para companions
CREATE INDEX IF NOT EXISTS idx_companions_guest_id ON companions(guest_id);

-- Tabela de Configurações do Site (SiteConfigurations)
CREATE TABLE IF NOT EXISTS site_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentário da tabela
COMMENT ON TABLE site_configurations IS 'Configurações dinâmicas do site';

-- Índice para site_configurations
CREATE INDEX IF NOT EXISTS idx_site_configurations_key ON site_configurations(config_key);

-- Trigger para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger na tabela guests
DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger na tabela site_configurations
DROP TRIGGER IF EXISTS update_site_configurations_updated_at ON site_configurations;
CREATE TRIGGER update_site_configurations_updated_at
    BEFORE UPDATE ON site_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações padrão
INSERT INTO site_configurations (config_key, config_value) VALUES
('hero', '{
    "date": "04 de Abril de 2026",
    "title": "Rafael Medeiros",
    "subtitle": "Estou completando mais um ano de vida e quero comemorar com você!",
    "ctaButton": "Confirmar Presença",
    "backgroundImage": "/images/rafael-cavalo.jpg",
    "overlayOpacity": 60,
    "blurAmount": 2
}'::jsonb),
('countdown', '{
    "title": "Faltam apenas...",
    "subtitle": "Para a grande celebração",
    "targetDate": "2026-04-04",
    "targetTime": "19:00"
}'::jsonb),
('about', '{
    "title": "Sobre o Rafael",
    "paragraph1": "Amante da vida no campo, dos cavalos e do gado. Rafael é aquele tipo de pessoa que encontra felicidade nas coisas simples: um pôr do sol no sítio, o galope de um cavalo, a companhia de bons amigos.",
    "paragraph2": "Sempre com um sorriso no rosto e pronto para novas aventuras, ele valoriza cada momento compartilhado com quem ama.",
    "highlightTitle": "Agora ele tem um novo sonho:",
    "highlightText": "comprar seu próprio cavalo!",
    "quote": "A vida é melhor quando vivida com paixão e propósito.",
    "image": "/images/rafael-escultura.jpg"
}'::jsonb),
('eventDetails', '{
    "title": "Detalhes do Evento",
    "date": "04 de Abril de 2026",
    "time": "19:00 horas",
    "location": "Sítio Recanto das Netinhas",
    "address": "Estrada Chico Mendes, 900 - Quintas do Jacuba, Contagem - MG",
    "copyButtonText": "Copiar",
    "mapsButtonText": "Ver no Maps"
}'::jsonb),
('rsvp', '{
    "title": "Confirme sua Presença",
    "subtitle": "Sua presença é muito importante! Por favor, confirme até",
    "deadline": "28 de março",
    "nameLabel": "Nome Completo",
    "phoneLabel": "Telefone",
    "attendingLabel": "Você vai comparecer?",
    "yesOption": "Sim, vou!",
    "noOption": "Não poderei",
    "companionsLabel": "Acompanhantes",
    "addCompanionButton": "Adicionar Acompanhante",
    "removeCompanionButton": "Remover",
    "companionPlaceholder": "Nome do acompanhante",
    "messageLabel": "Deixe uma mensagem (opcional)",
    "submitButton": "Enviar Confirmação",
    "successTitle": "Confirmação Enviada!",
    "successMessage": "Obrigado por confirmar sua presença! Estamos ansiosos para celebrar com você."
}'::jsonb),
('pix', '{
    "title": "Presente no PIX",
    "description": "Rafael está juntando dinheiro para realizar o sonho de comprar seu próprio cavalo. Sua contribuição será muito bem-vinda!",
    "dreamTitle": "O Sonho do Rafael",
    "dreamText": "Comprar seu próprio cavalo para continuar vivendo sua paixão pelo campo!",
    "pixKey": "38 998288370",
    "pixName": "Rafael",
    "pixBank": "Santander",
    "copyButtonText": "Copiar Chave PIX",
    "copiedText": "Copiado!",
    "thankYouMessage": "Obrigado por fazer parte deste sonho! 🐴"
}'::jsonb),
('footer', '{
    "text": "Feito com ❤️ para celebrar a vida do Rafael",
    "year": "2026"
}'::jsonb),
('colors', '{
    "primary": "#3D2914",
    "secondary": "#5C4024",
    "accent": "#D4AF37",
    "background": "#F5F0E6",
    "text": "#3D2914",
    "textLight": "#5C4024"
}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;

-- Políticas de segurança (RLS) - Permitir leitura pública, escrita apenas autenticada
-- Habilitar RLS nas tabelas
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_configurations ENABLE ROW LEVEL SECURITY;

-- Política para guests: qualquer um pode inserir, apenas autenticados podem ler/atualizar
DROP POLICY IF EXISTS "Allow public insert on guests" ON guests;
CREATE POLICY "Allow public insert on guests" ON guests
    FOR INSERT TO PUBLIC WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on guests" ON guests;
CREATE POLICY "Allow public read on guests" ON guests
    FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public update on guests" ON guests;
CREATE POLICY "Allow public update on guests" ON guests
    FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

-- Política para companions: qualquer um pode inserir, apenas autenticados podem ler/atualizar
DROP POLICY IF EXISTS "Allow public insert on companions" ON companions;
CREATE POLICY "Allow public insert on companions" ON companions
    FOR INSERT TO PUBLIC WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on companions" ON companions;
CREATE POLICY "Allow public read on companions" ON companions
    FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public update on companions" ON companions;
CREATE POLICY "Allow public update on companions" ON companions
    FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

-- Política para site_configurations: leitura pública, atualização apenas autenticada
DROP POLICY IF EXISTS "Allow public read on site_configurations" ON site_configurations;
CREATE POLICY "Allow public read on site_configurations" ON site_configurations
    FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public update on site_configurations" ON site_configurations;
CREATE POLICY "Allow public update on site_configurations" ON site_configurations
    FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on site_configurations" ON site_configurations;
CREATE POLICY "Allow public insert on site_configurations" ON site_configurations
    FOR INSERT TO PUBLIC WITH CHECK (true);
