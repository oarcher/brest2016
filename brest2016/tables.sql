-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Ven 18 Mars 2016 à 23:22
-- Version du serveur: 5.5.47-0ubuntu0.14.04.1
-- Version de PHP: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;

-- --------------------------------------------------------

--
-- Structure de la table `oarcher_activite`
--

DROP TABLE IF EXISTS `oarcher_activite`;
CREATE TABLE IF NOT EXISTS `oarcher_activite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datedebut` datetime NOT NULL,
  `datefin` datetime NOT NULL,
  `moyen_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=548 ;

--
-- Contenu de la table `oarcher_activite`
--

INSERT INTO `oarcher_activite` (`id`, `datedebut`, `datefin`, `moyen_id`) VALUES
(527, '2016-07-14 17:30:00', '2016-07-14 19:30:00', 122),
(528, '2016-07-14 15:00:00', '2016-07-14 17:00:00', 122),
(529, '2016-07-15 16:00:00', '2016-07-15 18:00:00', 123),
(530, '2016-07-16 15:00:00', '2016-07-16 17:00:00', 123),
(531, '2016-07-14 14:00:00', '2016-07-14 16:00:00', 123),
(535, '2016-07-13 15:00:00', '2016-07-13 17:00:00', 122),
(536, '2016-07-14 09:30:00', '2016-07-14 15:00:00', 122),
(537, '2016-07-19 13:00:00', '2016-07-19 15:00:00', 123),
(539, '2016-07-17 13:30:00', '2016-07-17 15:30:00', 123),
(542, '2016-07-15 12:00:00', '2016-07-15 16:00:00', 123),
(545, '2016-07-18 14:00:00', '2016-07-18 16:00:00', 122),
(547, '2016-07-18 17:00:00', '2016-07-18 19:00:00', 129);

-- --------------------------------------------------------

--
-- Structure de la table `oarcher_moyen`
--

DROP TABLE IF EXISTS `oarcher_moyen`;
CREATE TABLE IF NOT EXISTS `oarcher_moyen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `lieu` text NOT NULL,
  `nbPlaces` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=137 ;

--
-- Contenu de la table `oarcher_moyen`
--

INSERT INTO `oarcher_moyen` (`id`, `nom`, `lieu`, `nbPlaces`) VALUES
(122, 'test1', 'port', 1),
(123, 'ballade recouvrance', 'la rade', 10),
(126, 'tes', 'port', 1),
(127, 'ballade', 'test', 3),
(128, 'truc', 'Paris', 2),
(129, 'maaa', 'Paris', 3),
(130, 'tttt', 'tttt', 4),
(131, 'gggg', 'Paris', 40),
(132, 'hh', 'Paris', 1),
(133, 'test', 'Paris', 3),
(134, 'test', 'Paris', 4),
(135, 'teet', 'Paris', 4),
(136, 'tedst', 'Paris', 3);

-- --------------------------------------------------------

--
-- Structure de la table `oarcher_visiteur`
--

DROP TABLE IF EXISTS `oarcher_visiteur`;
CREATE TABLE IF NOT EXISTS `oarcher_visiteur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `oarcher_visiteur`
--

INSERT INTO `oarcher_visiteur` (`id`, `login`, `password`) VALUES
(1, 'admin', 'admin'),
(2, 'user', 'user'),
(3, 'oarcher', 'oarcher');

-- --------------------------------------------------------

--
-- Structure de la table `oarcher_visiteur_oarcher_activite`
--

DROP TABLE IF EXISTS `oarcher_visiteur_oarcher_activite`;
CREATE TABLE IF NOT EXISTS `oarcher_visiteur_oarcher_activite` (
  `visiteur_id` int(11) NOT NULL,
  `activite_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `oarcher_visiteur_oarcher_activite`
--

INSERT INTO `oarcher_visiteur_oarcher_activite` (`visiteur_id`, `activite_id`) VALUES
(0, 1),
(2, 483),
(2, 484),
(2, 486),
(2, 491),
(2, 485),
(2, 493),
(2, 498),
(2, 496),
(2, 494),
(2, 516),
(2, 525),
(2, 517),
(2, 509),
(2, 505),
(2, 529),
(2, 527),
(2, 520),
(2, 519),
(2, 532),
(3, 529),
(3, 531),
(3, 535),
(2, 528),
(2, 534),
(3, 539),
(2, 530),
(3, 538),
(2, 537),
(3, 530),
(3, 542),
(3, 545);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
