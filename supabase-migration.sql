-- Таблица для раздела "Обучение"
-- Запустите этот SQL в SQL-редакторе Supabase (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS "Training" (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Индекс для сортировки
CREATE INDEX IF NOT EXISTS idx_training_id ON "Training" (id);

-- Включаем Row Level Security
ALTER TABLE "Training" ENABLE ROW LEVEL SECURITY;

-- Разрешаем чтение всем
CREATE POLICY "Training read public"
  ON "Training"
  FOR SELECT
  USING (true);

-- Разрешаем запись только с анонимным ключом (админ через ?admin=)
CREATE POLICY "Training insert anon"
  ON "Training"
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Training update anon"
  ON "Training"
  FOR UPDATE
  USING (true);

CREATE POLICY "Training delete anon"
  ON "Training"
  FOR DELETE
  USING (true);

-- Структура поля details:
-- [
--   { "name": "Название модуля", "duration": "40", "price": "5000" },
--   { "name": "Другой модуль", "duration": "20", "price": "3000" }
-- ]
