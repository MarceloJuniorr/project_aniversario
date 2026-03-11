-- Migration: Add DELETE policies for RLS
-- Adiciona políticas de DELETE para as tabelas guests e companions

-- Política de DELETE para guests
CREATE POLICY "Allow public delete on guests" ON guests
  FOR DELETE TO PUBLIC USING (true);

-- Política de DELETE para companions
CREATE POLICY "Allow public delete on companions" ON companions
  FOR DELETE TO PUBLIC USING (true);