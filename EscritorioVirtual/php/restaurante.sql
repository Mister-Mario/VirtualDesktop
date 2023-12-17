-- Crear la tabla Cocineros
CREATE TABLE Cocineros (
    COCINERO_ID INT PRIMARY KEY,
    NOMBRE VARCHAR(255),
    APELLIDOS VARCHAR(255)
);

-- Insertar datos en la tabla Cocineros
INSERT INTO Cocineros (COCINERO_ID, NOMBRE, APELLIDOS)
VALUES
    (0, 'CARLOS', 'HOVAN LLANO'),
    (1, 'MARIO', 'JUNQUERA ROJAS'),
    (2, 'LUIS', 'MANZANO ZAPATERO');

-- Crear la tabla Cocina
CREATE TABLE Cocina (
    ID_COCINERO INT,
    ID_PLATO INT,
    CANTIDAD INT,
    PRIMARY KEY (ID_COCINERO, ID_PLATO),
    FOREIGN KEY (ID_COCINERO) REFERENCES Cocineros(COCINERO_ID),
    FOREIGN KEY (ID_PLATO) REFERENCES Platos(PLATO_ID)
);

-- Insertar datos en la tabla Cocina
LOAD DATA INFILE 'ruta_del_archivo/cocina.csv' 
INTO TABLE Cocina
FIELDS TERMINATED BY ';' 
LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;

-- Crear la tabla Platos
CREATE TABLE Platos (
    PLATO_ID INT PRIMARY KEY,
    NOMBRE_PLATO VARCHAR(255),
    ORDEN VARCHAR(255),
    PRECIO_VENTA DECIMAL(10, 2)
);

-- Insertar datos en la tabla Platos
LOAD DATA INFILE 'ruta_del_archivo/platos.csv' 
INTO TABLE Platos
FIELDS TERMINATED BY ';' 
LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;

-- Crear la tabla Cocinado_Con
CREATE TABLE Cocinado_Con (
    PLATO_ID INT,
    INGREDIENTE_ID INT,
    CANTIDAD INT,
    PRIMARY KEY (PLATO_ID, INGREDIENTE_ID),
    FOREIGN KEY (PLATO_ID) REFERENCES Platos(PLATO_ID),
    FOREIGN KEY (INGREDIENTE_ID) REFERENCES Ingredientes(INGREDIENTE_ID)
);

-- Insertar datos en la tabla Cocinado_Con
LOAD DATA INFILE 'ruta_del_archivo/cocinado_con.csv' 
INTO TABLE Cocinado_Con
FIELDS TERMINATED BY ';' 
LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;

-- Crear la tabla Ingredientes
CREATE TABLE Ingredientes (
    INGREDIENTE_ID INT PRIMARY KEY,
    NOMBRE_INGREDIENTE VARCHAR(255),
    CANTIDAD_EN_ALMACEN INT,
    ALMACENAMIENTO VARCHAR(255)
);

-- Insertar datos en la tabla Ingredientes
LOAD DATA INFILE 'ruta_del_archivo/ingredientes.csv' 
INTO TABLE Ingredientes
FIELDS TERMINATED BY ';' 
LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;
