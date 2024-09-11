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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `IDAccount` varchar(50) NOT NULL,
  `IDGoogle` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Org` tinyint(1) DEFAULT NULL,
  `imgURL` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IDAccount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('0e51cc96-6cd2-11ef-9f47-04421a0238fa','googleid_1','user1@example.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User One'),('0e51d673-6cd2-11ef-9f47-04421a0238fa','googleid_2','user2@example.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Two'),('0e51d7f7-6cd2-11ef-9f47-04421a0238fa','114483550156828378171','publicaccout.mek@gmail.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Three'),('0e51d858-6cd2-11ef-9f47-04421a0238fa','googleid_4','user4@example.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Four'),('0e51d8aa-6cd2-11ef-9f47-04421a0238fa','googleid_5','user5@example.com',1,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Five'),('0e51d900-6cd2-11ef-9f47-04421a0238fa','googleid_6','user6@example.com',1,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Six'),('0e51d94e-6cd2-11ef-9f47-04421a0238fa','googleid_7','user7@example.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Seven'),('0e51d9ad-6cd2-11ef-9f47-04421a0238fa','googleid_8','user8@example.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Eight'),('0e51d9fe-6cd2-11ef-9f47-04421a0238fa','googleid_9','user9@example.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Nine'),('0e51da43-6cd2-11ef-9f47-04421a0238fa','googleid_10','user10@example.com',0,'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png','User Ten');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
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
