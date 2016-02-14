/* mysql -u test -p test < tables.sql */


CREATE TABLE IF NOT EXISTS oarcher_animation (
  id INT NOT NULL auto_increment,
  nom VARCHAR(255) NOT NULL,
  descr VARCHAR(255) NOT NULL,
   
  PRIMARY KEY(id)
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

CREATE TABLE IF NOT EXISTS `oarcher_animation_horaire` (
  `idAnimation` INT NOT NULL,
  `idHoraire` INT NOT NULL
) ;

CREATE TABLE IF NOT EXISTS `oarcher_visiteur_horaire` (
  `idVisiteur` INT NOT NULL,
  `idHoraire` INT NOT NULL
) ;


--
-- Contenu de la table `oarcher_horaire`
--

INSERT INTO `oarcher_horaire` (`id`, `plage`) VALUES
(1, 'matin'),
(2, 'midi'),
(3, 'après midi'),
(4, 'soir');

