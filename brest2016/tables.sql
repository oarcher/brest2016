/* mysql -u test -p test < tables.sql */

CREATE TABLE oarcher_animation (
  id INT NOT NULL auto_increment,
  nom VARCHAR(255) NOT NULL,
  descr VARCHAR(255) NOT NULL,
   
  PRIMARY KEY(id)
);
