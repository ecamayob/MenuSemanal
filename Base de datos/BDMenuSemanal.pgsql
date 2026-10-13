-- 1. Tabla Maestra de Categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla Maestra de Días de la Semana
CREATE TABLE dias_semana (
    id INT PRIMARY KEY, -- 1 = Lunes, 2 = Martes, ..., 7 = Domingo
    nombre VARCHAR(15) NOT NULL UNIQUE,
    orden INT NOT NULL UNIQUE
);

-- 3. Tabla del Catálogo de Platos
CREATE TABLE platos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria_id INT NOT NULL REFERENCES categorias(id),
    foto_url VARCHAR(255),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Menú Semanal
CREATE TABLE menu_semanal (
    id SERIAL PRIMARY KEY,
    dia_id INT NOT NULL REFERENCES dias_semana(id),
    plato_id INT NOT NULL REFERENCES platos(id) ON DELETE CASCADE,
    categoria_id INT NOT NULL REFERENCES categorias(id),
    CONSTRAINT unique_plato_por_dia_categoria UNIQUE (dia_id, categoria_id)
);

-- =====================================================
-- INSERTS INICIALES DE CONFIGURACIÓN
-- =====================================================

-- Categorías
INSERT INTO categorias (id, nombre) VALUES 
(1, 'Entrada'), 
(2, 'Fondo');

-- Días de la semana (con su orden cronológico)
INSERT INTO dias_semana (id, nombre, orden) VALUES
(1, 'Lunes', 1),
(2, 'Martes', 2),
(3, 'Miércoles', 3),
(4, 'Jueves', 4),
(5, 'Viernes', 5),
(6, 'Sábado', 6),
(7, 'Domingo', 7);

-- Platos del catálogo
INSERT INTO platos (id, nombre, categoria_id) VALUES
(1, 'Ceviche', 2),
(2, 'Ceviche mixto', 2),
(3, 'Tiradito de pescado', 2),
(4, 'Papa a la huancaína', 1),
(5, 'Causa limeña', 1);

-- Ajustar la secuencia de los IDs autoincrementables
SELECT setval('categorias_id_seq', (SELECT MAX(id) FROM categorias));
SELECT setval('platos_id_seq', (SELECT MAX(id) FROM platos));

-- Asignación de prueba en el Menú Semanal
INSERT INTO menu_semanal (dia_id, plato_id, categoria_id) VALUES
(1, 5, 1), -- Lunes: Causa limeña (Entrada)
(1, 1, 2), -- Lunes: Ceviche (Fondo)
(2, 4, 1); -- Martes: Papa a la huancaína (Entrada)

use bdmenusemanal

SELECT 
    d.nombre AS dia,
    c.nombre AS categoria,
    p.nombre AS plato,
    p.foto_url
FROM menu_semanal ms
JOIN dias_semana d ON ms.dia_id = d.id
JOIN categorias c ON ms.categoria_id = c.id
JOIN platos p ON ms.plato_id = p.id
ORDER BY d.orden ASC, c.id ASC;