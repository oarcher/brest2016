/* mysql -u test -p test < tables.sql */

DROP TABLE IF EXISTS `oarcher_stand`;
DROP TABLE IF EXISTS `oarcher_horaire`;
DROP TABLE IF EXISTS `oarcher_visiteur`;
DROP TABLE IF EXISTS `oarcher_visiteur_horaire`;
DROP TABLE IF EXISTS `oarcher_stand_horaire`;
DROP TABLE IF EXISTS `oarcher_visiteur_horaire_stand`;
DROP TABLE IF EXISTS `oarcher_visiteur_stand`;
DROP TABLE IF EXISTS `oarcher_activite`;
DROP TABLE IF EXISTS `oarcher_activite_visiteur`;
DROP TABLE IF EXISTS `oarcher_activite_stand`;
DROP TABLE IF EXISTS `oarcher_activite_horaire`;

CREATE TABLE IF NOT EXISTS `oarcher_stand` (
  id INT NOT NULL auto_increment,
  nom VARCHAR(255) NOT NULL,
  descr VARCHAR(255) NOT NULL,
   
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS `oarcher_activite_stand` (
  idActivite INT,
  idStand INT
);

CREATE TABLE IF NOT EXISTS `oarcher_activite_horaire` (
  idActivite INT,
  idHoraire INT
);




CREATE TABLE IF NOT EXISTS `oarcher_horaire` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `plage` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE IF NOT EXISTS `oarcher_visiteur` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE IF NOT EXISTS `oarcher_stand_horaire` (
  `idStand` INT NOT NULL,
  `idHoraire` INT NOT NULL
) ;

CREATE TABLE IF NOT EXISTS `oarcher_visiteur_horaire_stand` (
  `idVisiteur` INT NOT NULL,
  `idHoraire` INT NOT NULL,
  `idStand` INT NOT NULL
) ;

CREATE TABLE IF NOT EXISTS `oarcher_visiteur_stand` (
  `idVisiteur` INT NOT NULL,
  `idStand` INT NOT NULL
) ;

CREATE TABLE IF NOT EXISTS `oarcher_visiteur_horaire` (
  `idVisiteur` INT NOT NULL,
  `idHoraire` INT NOT NULL
) ;

CREATE TABLE IF NOT EXISTS `oarcher_activite` (
  `id` INT NOT NULL,
  `idStand` INT,
  `idHoraire` INT
) ;

CREATE TABLE IF NOT EXISTS `oarcher_activite_visiteur` (
	`idActivite` INT NOT NULL,
	`idVisiteur` INT NOT NULL
);

--
-- Contenu de la table `oarcher_horaire`
--

INSERT INTO `oarcher_horaire` (`id`, `plage`) VALUES
(1, 'matin'),
(2, 'midi'),
(3, 'après midi'),
(4, 'soir');

INSERT INTO `oarcher_stand` (`id`, `nom`, `descr`) VALUES
(1, 'Recouvrane', 'Visite'),
(2, 'Belle Poule' , 'Ballade');

INSERT INTO `oarcher_visiteur` (`id`, `nom`, `prenom`) VALUES
(1, 'Archer', 'Olivier');

INSERT INTO `oarcher_visiteur_horaire_stand` (`idVisiteur`, `idHoraire`, `idStand`) VALUES
(1, 2, 2);

INSERT INTO `oarcher_visiteur_stand` (`idVisiteur`, `idStand`) VALUES
(1, 1);


INSERT INTO oarcher_activite (id , idStand, idHoraire) VALUES
(1, 1, 1),
(2, 2, 1);

INSERT INTO oarcher_activite_visiteur ( idActivite, idVisiteur ) VALUES
(1 , 1);

