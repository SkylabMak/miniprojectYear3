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
-- Table structure for table `trip`
--

DROP TABLE IF EXISTS `trip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip` (
  `IDTrip` varchar(50) NOT NULL,
  `IDOriginTrip` varchar(50) DEFAULT NULL,
  `IDAccount` varchar(50) DEFAULT NULL,
  `TripName` varchar(255) NOT NULL,
  `Detail` varchar(200) DEFAULT NULL,
  `Preparation` varchar(100) DEFAULT NULL,
  `Booking` char(2) DEFAULT NULL,
  `createDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEdit` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `private` tinyint(1) DEFAULT NULL,
  `maxJoiner` int DEFAULT NULL,
  `started` tinyint(1) DEFAULT NULL,
  `count` int DEFAULT NULL,
  PRIMARY KEY (`IDTrip`),
  KEY `IDAccount` (`IDAccount`),
  CONSTRAINT `trip_ibfk_1` FOREIGN KEY (`IDAccount`) REFERENCES `account` (`IDAccount`),
  CONSTRAINT `trip_chk_1` CHECK ((`Booking` in (_utf8mb4'NM',_utf8mb4'BI',_utf8mb4'BE')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip`
--

LOCK TABLES `trip` WRITE;
/*!40000 ALTER TABLE `trip` DISABLE KEYS */;
INSERT INTO `trip` VALUES ('267d09a5-6cd2-11ef-9f47-04421a0238fa',NULL,'0e51d7f7-6cd2-11ef-9f47-04421a0238fa','เที่ยว 3 วัดใน 1 วัน','เที่ยว 3 วัดใน 1 วัน','เตรียมตัวพร้อมถวายสังฆทาน','NM','2024-07-07 01:00:00','2024-07-07 01:00:00',0,10,1,0),('7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',NULL,'0e51d900-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BI','2024-07-08 02:00:00','2024-09-08 04:18:49',0,10,0,0),('9d785a08-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51cc96-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BE','2024-07-07 02:00:00','2024-07-07 02:00:00',1,10,0,0),('afcb0f08-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa','0e51d7f7-6cd2-11ef-9f47-04421a0238fa','เที่ยว 3 วัดใน 1 วัน (ปีหน้า)','เที่ยว 3 วัดใน 1 วัน','เตรียมตัวพร้อมถวายสังฆทาน','NM','2025-07-07 01:00:00','2024-09-08 07:04:48',0,10,0,0),('c7311a8a-e57a-48af-8bcc-448bba7ae35e','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51d9ad-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BE','2024-09-08 04:34:42','2024-09-08 04:34:42',1,10,0,1),('d4f85fe8-5a6f-4446-a50d-eb725705546b','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51d7f7-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BE','2024-09-08 01:33:35','2024-09-08 01:33:35',1,10,0,NULL);
/*!40000 ALTER TABLE `trip` ENABLE KEYS */;
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
