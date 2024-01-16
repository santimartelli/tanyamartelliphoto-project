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
    id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    registered datetime NOT NULL,
    last_login datetime NOT NULL
);

-- Creación de la tabla "bookings"
CREATE TABLE IF NOT EXISTS bookings (
  bookingId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  categoryId INT NOT NULL,
  sessionType VARCHAR(50) NOT NULL,
  location VARCHAR(50) NOT NULL,
  place VARCHAR(50) NOT NULL,
  selectedDate DATE NOT NULL,
  selectedTime TIME NOT NULL,
  message TEXT,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (bookingId),
  FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
);

-- Creación de la tabla "messages"
CREATE TABLE IF NOT EXISTS messages (
  messageId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT,
  PRIMARY KEY (messageId)
);

-- consultas --
select * from pictures;
