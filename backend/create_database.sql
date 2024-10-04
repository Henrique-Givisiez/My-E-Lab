create database my_e_lab_database;

use my_e_lab_database;

CREATE TABLE Usuario (
	Id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    Sobrenome VARCHAR(255) NOT NULL,
    Funcao VARCHAR(255) NOT NULL,
    Genero enum('m', 'f', 'n') NOT NULL,
    PROFILE_IMG LONGBLOB,
    UNIQUE (Email)
);

CREATE TABLE Item (
    Id VARCHAR(13) NOT NULL PRIMARY KEY,
    Tipo_item VARCHAR(255) NOT NULL
);

CREATE TABLE Livro (
    ISBN  CHAR(13) PRIMARY KEY NOT NULL,
    Titulo VARCHAR(255) NOT NULL,
    Descricao TEXT,
    Categoria VARCHAR(255) NOT NULL,
    Data_aquisicao DATE NOT NULL,
    Autor VARCHAR(255) NOT NULL,
    Localizacao VARCHAR(255) NOT NULL,
    BOOK_COVER LONGBLOB,
    FOREIGN KEY (ISBN) REFERENCES Item (Id)
);

CREATE TABLE Material_Didatico (
    Numero_serie CHAR(10) PRIMARY KEY NOT NULL,
    Nome VARCHAR(255) NOT NULL,
    Descricao VARCHAR(255),
    Categoria VARCHAR(255) NOT NULL,
    Data_aquisicao DATE NOT NULL,
    Localizacao VARCHAR(255) NOT NULL,
    MATERIAL_COVER LONGBLOB,
    FOREIGN KEY (Numero_serie) REFERENCES Item (Id)
);

CREATE TABLE Emprestimo (
    FK_id_item VARCHAR(13) NOT NULL,
    Id_emprestimo INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Data_Emprestimo DATE NOT NULL,
    Data_Devolucao DATE NOT NULL,
    Status_atual VARCHAR(255) NOT NULL,
    FK_id_usuario INTEGER NOT NULL,
    FOREIGN KEY (FK_id_usuario) REFERENCES Usuario (Id),
    FOREIGN KEY (FK_id_item) REFERENCES Item (Id)
);


ALTER TABLE Emprestimo
ADD CONSTRAINT fk_item 
FOREIGN KEY (FK_id_item)
REFERENCES Item (Id)
ON UPDATE CASCADE;

ALTER TABLE Livro
ADD CONSTRAINT fk_item_2
FOREIGN KEY (ISBN)
REFERENCES Item (Id)
ON UPDATE CASCADE;

ALTER TABLE Material_Didatico
ADD CONSTRAINT fk_item_3
FOREIGN KEY (Numero_serie)
REFERENCES Item (Id)
ON UPDATE CASCADE;