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
  `imageURL` varchar(500) DEFAULT NULL,
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
INSERT INTO `trip` VALUES ('00441743-8e1f-4453-87e0-072b94ed2dd6','267d09a5-6cd2-11ef-9f47-04421a0238fa','5197bc95-3679-4005-8444-7bbec0fa6156','เที่ยว 3 วัดใน 1 วัน','เที่ยว 3 วัดใน 1 วัน','เตรียมตัวพร้อมถวายสังฆทาน','NM','2024-09-29 02:02:33','2024-09-29 02:02:33',1,10,0,1,NULL),('24f98f4b-aa89-4bbf-890e-18aa4cfa5e6f',NULL,'0e51d900-6cd2-11ef-9f47-04421a0238fa','test create new trip booking','test create new trip booking',NULL,'BI','2024-09-13 00:55:46','2024-09-29 15:57:43',0,10,0,7,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('267d09a5-6cd2-11ef-9f47-04421a0238fa',NULL,'0e51d7f7-6cd2-11ef-9f47-04421a0238fa','เที่ยว 3 วัดใน 1 วัน','เที่ยว 3 วัดใน 1 วัน','เตรียมตัวพร้อมถวายสังฆทาน และข้าวสารอาหารแห้ง','NM','2024-07-07 01:00:00','2024-09-29 22:57:15',0,10,1,7,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('3599124e-efff-4c84-9c0c-599134ab9cd5','24f98f4b-aa89-4bbf-890e-18aa4cfa5e6f','0e51d673-6cd2-11ef-9f47-04421a0238fa','test create new trip booking','test create new trip booking',NULL,'BE','2024-09-13 01:09:23','2024-09-21 01:34:47',1,10,0,1,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('79b9d5b3-e856-4649-8466-1a2ed08ad7b5','c04c2bbe-91dc-4865-935e-809c1cca877e','0e51d7f7-6cd2-11ef-9f47-04421a0238fa','ทดสอบ','ทดสอบการตั้งค่าทริป','ใจ','BE','2024-10-01 03:38:28','2024-10-01 03:38:28',1,10,0,2,NULL),('7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',NULL,'0e51d900-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BI','2024-07-08 02:00:00','2024-09-21 01:34:47',0,10,0,0,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('9d785a08-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51cc96-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BE','2024-07-07 02:00:00','2024-09-21 01:34:47',1,10,0,0,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('afcb0f08-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa','0e51d7f7-6cd2-11ef-9f47-04421a0238fa','เที่ยว 3 วัดใน 1 วัน (ปีหน้า)','เที่ยว 3 วัดใน 1 วัน','เตรียมตัวพร้อมถวายสังฆทาน','NM','2025-07-07 01:00:00','2024-10-01 06:33:52',0,10,0,0,'http://res.cloudinary.com/ybmedia/image/upload/c_crop,h_1123,w_2000,x_0,y_126/c_fill,f_auto,h_900,q_auto,w_1600/v1/m/4/2/422c917a5d3d306a7b992a5dd256dbe25916d183/20-essential-tips-successful-road-trip.jpg'),('b87268a6-c388-4079-a21f-9eef220523b2','24f98f4b-aa89-4bbf-890e-18aa4cfa5e6f','0e51d94e-6cd2-11ef-9f47-04421a0238fa','test create new trip booking','test create new trip booking',NULL,'BE','2024-09-14 00:16:40','2024-09-21 01:34:47',1,10,0,2,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('c04c2bbe-91dc-4865-935e-809c1cca877e',NULL,'0e51d900-6cd2-11ef-9f47-04421a0238fa','ทดสอบ','ทดสอบการตั้งค่าทริป','ใจ','BI','2024-10-01 03:09:40','2024-10-01 03:51:15',1,10,0,2,NULL),('c7311a8a-e57a-48af-8bcc-448bba7ae35e','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51d9ad-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BE','2024-09-08 04:34:42','2024-09-21 01:34:47',1,10,0,1,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('d4f85fe8-5a6f-4446-a50d-eb725705546b','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa','0e51d7f7-6cd2-11ef-9f47-04421a0238fa','เที่ยวรอบเขื่อนขุลด่าน','เที่ยวรอบเขื่อนขุลด่าน','เตรียมตัวเที่ยวรอบเขื่อน','BE','2024-09-08 01:33:35','2024-09-21 01:34:47',1,10,0,2,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'),('f6572283-8fcb-4aed-8f92-1ffe3b94e364',NULL,'0e51d8aa-6cd2-11ef-9f47-04421a0238fa','test edit trip 03','notinggggggggggggggggggggggggg','noting to preparation','NM','2024-09-11 23:06:29','2024-09-21 01:34:47',1,30,0,0,'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg');
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

-- Dump completed on 2024-10-06 12:44:10
