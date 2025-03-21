-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: cardmanager
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carte`
--

DROP TABLE IF EXISTS `carte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carte` (
  `card_id` int NOT NULL AUTO_INCREMENT,
  `card_title` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB AUTO_INCREMENT=270 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carte`
--

LOCK TABLES `carte` WRITE;
/*!40000 ALTER TABLE `carte` DISABLE KEYS */;
/*!40000 ALTER TABLE `carte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carte_utilisateur`
--

DROP TABLE IF EXISTS `carte_utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carte_utilisateur` (
  `card_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`card_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carte_utilisateur_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `carte` (`card_id`) ON DELETE CASCADE,
  CONSTRAINT `carte_utilisateur_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carte_utilisateur`
--

LOCK TABLES `carte_utilisateur` WRITE;
/*!40000 ALTER TABLE `carte_utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `carte_utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentaire`
--

DROP TABLE IF EXISTS `commentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentaire` (
  `comment_id` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `card_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `replied_to_comment_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `card_id` (`card_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `commentaire_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `carte` (`card_id`),
  CONSTRAINT `commentaire_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentaire`
--

LOCK TABLES `commentaire` WRITE;
/*!40000 ALTER TABLE `commentaire` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenue_carte`
--

DROP TABLE IF EXISTS `contenue_carte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contenue_carte` (
  `content_id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `card_id` int NOT NULL,
  PRIMARY KEY (`content_id`),
  KEY `card_id` (`card_id`),
  CONSTRAINT `contenue_carte_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `carte` (`card_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenue_carte`
--

LOCK TABLES `contenue_carte` WRITE;
/*!40000 ALTER TABLE `contenue_carte` DISABLE KEYS */;
/*!40000 ALTER TABLE `contenue_carte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) NOT NULL,
  `password` varchar(80) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (5,'Kanto','$2b$10$9Fm6c2O3Za97dMW6m5ayNu4Sne2TgqMihS4iaJ0iEhsTOajqZy3d.'),(6,'Rasoa','$2b$10$n9MA8g0WVfwFxL4mePGtb.a7j225QZNU7B/NWrIuYN5h0UPMLz6pC'),(7,'Rakoto','$2b$10$TKqrFgxLrLz4HLDf4XxZXu10fDyIOD9.p83v9UCJCTNqLhzj4X7TG'),(8,'Sarah','$2b$10$An9mmOTklArQN5Ib7qfkB.L5oNH.aA8fPzEkW5Tx/V2FHJNEhMfVC'),(9,'Ranaivo','$2b$10$yk9ZblHxeV9PodeaA4mesOWN3UT8X8vnvMA8CsLk7eHehU/fmw.YW'),(10,'Boris','$2b$10$yBIyNX1JguB/hp0UsXy1NuFU8J6Ix5HXpPXUQLu4qwoVdb0Kdv4Lm'),(11,'Vladimir','$2b$10$tebajWIrxOZGNJvo03pxTeL1J2K0ai7hPt2GBdVwyV6pq.DstA2ga');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21 15:49:47
