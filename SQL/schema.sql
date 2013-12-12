CREATE DATABASE chat;

USE chat;

CREATE TABLE `messages` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Users` VARCHAR(20),
  `Message` VARCHAR(255),
  `Roomname` VARCHAR(30),
  PRIMARY KEY  (`ID`)
);


/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
