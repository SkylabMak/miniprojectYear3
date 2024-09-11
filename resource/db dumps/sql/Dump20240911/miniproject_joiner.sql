-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: miniproject
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `joiner`
--

DROP TABLE IF EXISTS `joiner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `joiner` (
  `IDTrip` varchar(50) NOT NULL,
  `IDAccount` varchar(50) NOT NULL,
  `type` char(1) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  PRIMARY KEY (`IDTrip`,`IDAccount`),
  KEY `IDAccount` (`IDAccount`),
  CONSTRAINT `joiner_ibfk_1` FOREIGN KEY (`IDTrip`) REFERENCES `trip` (`IDTrip`),
  CONSTRAINT `joiner_ibfk_2` FOREIGN KEY (`IDAccount`) REFERENCES `account` (`IDAccount`),
  CONSTRAINT `joiner_chk_1` CHECK ((`type` in (_utf8mb4'B',_utf8mb4'J'))),
  CONSTRAINT `joiner_chk_2` CHECK ((`status` in (_utf8mb4'B',_utf8mb4'D')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `joiner`
--

LOCK TABLES `joiner` WRITE;
/*!40000 ALTER TABLE `joiner` DISABLE KEYS */;
INSERT INTO `joiner` VALUES ('267d09a5-6cd2-11ef-9f47-04421a0238fa','0e51d673-6cd2-11ef-9f47-04421a0238fa','J','D'),('267d09a5-6cd2-11ef-9f47-04421a0238fa','0e51d858-6cd2-11ef-9f47-04421a0238fa','J','D'),('267d09a5-6cd2-11ef-9f47-04421a0238fa','0e51d8aa-6cd2-11ef-9f47-04421a0238fa','J','D'),('267d09a5-6cd2-11ef-9f47-04421a0238fa','0e51d9ad-6cd2-11ef-9f47-04421a0238fa','J','D'),('267d09a5-6cd2-11ef-9f47-04421a0238fa','0e51da43-6cd2-11ef-9f47-04421a0238fa','J','D'),('7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51cc96-6cd2-11ef-9f47-04421a0238fa','B','D'),('7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51d7f7-6cd2-11ef-9f47-04421a0238fa','B','B'),('7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51d9ad-6cd2-11ef-9f47-04421a0238fa','B','B'),('afcb0f08-6cd2-11ef-9f47-04421a0238fa','0e51d673-6cd2-11ef-9f47-04421a0238fa','J','D'),('afcb0f08-6cd2-11ef-9f47-04421a0238fa','0e51d858-6cd2-11ef-9f47-04421a0238fa','J','D'),('afcb0f08-6cd2-11ef-9f47-04421a0238fa','0e51d8aa-6cd2-11ef-9f47-04421a0238fa','J','D'),('afcb0f08-6cd2-11ef-9f47-04421a0238fa','0e51d9ad-6cd2-11ef-9f47-04421a0238fa','J','D');
/*!40000 ALTER TABLE `joiner` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-11 16:11:55
