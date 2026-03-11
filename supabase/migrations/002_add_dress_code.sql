-- Migration: Adicionar campo dressCode na configuração de eventDetails
-- Atualiza a configuração existente para incluir informações de traje

-- Atualizar a configuração de eventDetails existente
UPDATE site_configurations 
SET config_value = jsonb_set(
  config_value,
  '{dressCode}',
  '"Estilo Country"'::jsonb,
  true
)
WHERE config_key = 'eventDetails';

-- Adicionar o label do traje
UPDATE site_configurations 
SET config_value = jsonb_set(
  config_value,
  '{dressCodeLabel}',
  '"Traje"'::jsonb,
  true
)
WHERE config_key = 'eventDetails';

-- Verificar se a atualização foi aplicada
SELECT config_key, config_value 
FROM site_configurations 
WHERE config_key = 'eventDetails';
