-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Dim 28 Février 2016 à 16:43
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

-- --------------------------------------------------------

--
-- Structure de la table `oarcher_activite`
--

CREATE TABLE IF NOT EXISTS `oarcher_activite` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `lieu` varchar(255) NOT NULL,
  `datedebut` datetime NOT NULL,
  `datefin` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `oarcher_visiteur`
--

CREATE TABLE IF NOT EXISTS `oarcher_visiteur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `oarcher_visiteur`
--

INSERT INTO `oarcher_visiteur` (`id`, `nom`, `prenom`, `password`) VALUES
(1, 'admin', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `oarcher_visiteur_oarcher_activite`
--

CREATE TABLE IF NOT EXISTS `oarcher_visiteur_oarcher_activite` (
  `visiteur_id` int(11) NOT NULL,
  `activite_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `oarcher_visiteur_oarcher_activite`
--

INSERT INTO `oarcher_visiteur_oarcher_activite` (`visiteur_id`, `activite_id`) VALUES
(0, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
