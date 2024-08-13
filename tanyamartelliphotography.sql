-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS tanyamartelliphotography;

-- Selección de la base de datos para trabajar con ella
USE tanyamartelliphotography;

-- Creación de la tabla "categories"
CREATE TABLE IF NOT EXISTS categories (
  categoryId INT NOT NULL AUTO_INCREMENT,
  categoryName VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (categoryId)
);

-- Creación de la tabla "pictures"
CREATE TABLE IF NOT EXISTS pictures (
  pictureId INT NOT NULL AUTO_INCREMENT,
  picturePath VARCHAR(255) DEFAULT NULL,
  categoryId INT DEFAULT NULL,
  PRIMARY KEY (pictureId),
  FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
);

-- Creación de la tabla "users"
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    registered datetime NOT NULL,
    last_login datetime default NULL,
    PRIMARY KEY (id)
);

-- Creación de la tabla "bookings"
CREATE TABLE IF NOT EXISTS bookings (
  bookingId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sesion VARCHAR(255) NOT NULL,
  location VARCHAR(50) NOT NULL,
  place VARCHAR(50) NOT NULL,
  selectedDate VARCHAR(50) NOT NULL,
  selectedTime VARCHAR(50) NOT NULL,
  message TEXT,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (bookingId),
);

-- Creación de la tabla "messages"
CREATE TABLE IF NOT EXISTS messages (
  messageId INT NOT NULL AUTO_INCREMENT,
  messageName VARCHAR(255) NOT NULL,
  messageEmail VARCHAR(255) NOT NULL,
  messageContent TEXT,
  PRIMARY KEY (messageId)
);

-- consultas --
select * from users;
select * from categories;
select * from pictures;
select * from bookings;
select * from messages;