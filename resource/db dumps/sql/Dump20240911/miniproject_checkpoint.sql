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
-- Table structure for table `checkpoint`
--

DROP TABLE IF EXISTS `checkpoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkpoint` (
  `IDCheckpoint` varchar(50) NOT NULL,
  `IDTrip` varchar(50) DEFAULT NULL,
  `OrderC` int DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `time` timestamp NULL DEFAULT NULL,
  `locationName` varchar(50) DEFAULT NULL,
  `detail` varchar(100) DEFAULT NULL,
  `type` char(1) DEFAULT NULL,
  PRIMARY KEY (`IDCheckpoint`),
  KEY `IDTrip` (`IDTrip`),
  CONSTRAINT `checkpoint_ibfk_1` FOREIGN KEY (`IDTrip`) REFERENCES `trip` (`IDTrip`),
  CONSTRAINT `checkpoint_chk_1` CHECK ((`type` in (_utf8mb4'D',_utf8mb4'G',_utf8mb4'A')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkpoint`
--

LOCK TABLES `checkpoint` WRITE;
/*!40000 ALTER TABLE `checkpoint` DISABLE KEYS */;
INSERT INTO `checkpoint` VALUES ('0556d6ee-a714-4f20-b7df-0facafe0f44d','d4f85fe8-5a6f-4446-a50d-eb725705546b',1,'2024-09-08 01:33:35','2024-09-08 02:00:00','นีราการ์เดนส์','Destination 1','D'),('05e8ef06-511f-42a5-92ba-a54a3f7ec8f7','c7311a8a-e57a-48af-8bcc-448bba7ae35e',6,'2024-09-08 04:34:42','2024-09-08 07:30:00','รวมตัวเดินทาง','Gather 2','G'),('310db747-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',1,'2024-07-07 01:00:00','2024-09-07 01:00:00','วัดลานบุญ','Starting point','D'),('310dc3a6-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',2,'2024-07-07 01:05:00','2024-09-07 01:30:00','ถวายสังฆทาน','Activity 1','A'),('310dc734-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',3,'2024-07-07 01:10:00','2024-09-07 02:30:00','วัดสังฆราชา','Destination 2','D'),('310dc95d-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',4,'2024-07-07 01:15:00','2024-09-07 03:00:00','ถวายสังฆทาน','Activity 2','A'),('310dcb81-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',5,'2024-07-07 01:20:00','2024-09-07 05:00:00','กินข้าวเที่ยง','Gather','G'),('310dcd3a-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',6,'2024-07-07 01:25:00','2024-09-07 06:30:00','วัดลาดกระบัง','Destination 3','D'),('310dcee3-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',7,'2024-07-07 01:30:00','2024-09-07 07:00:00','ถวายสังฆทาน','Activity 3','A'),('310dd0c7-6cd2-11ef-9f47-04421a0238fa','267d09a5-6cd2-11ef-9f47-04421a0238fa',8,'2024-07-07 01:35:00','2024-09-07 08:30:00','พูดคุยกัน','Gather','G'),('31f81b52-eaab-4201-9dc7-6377de9c8d26','c7311a8a-e57a-48af-8bcc-448bba7ae35e',8,'2024-09-08 04:34:42','2024-09-08 10:00:00','นีราการ์เดนส์','Destination 5','D'),('33ecfdfa-be0b-44b2-b29a-8ccebba46800','d4f85fe8-5a6f-4446-a50d-eb725705546b',7,'2024-09-08 01:33:35','2024-09-08 08:30:00','เขื่อนขุนด่านปราการชล','Destination 4','D'),('48cd764f-04bc-4e3b-9497-07aabcf8b861','c7311a8a-e57a-48af-8bcc-448bba7ae35e',3,'2024-09-08 04:34:42','2024-09-08 04:00:00','สวนคุณเล็ก','Destination 2','D'),('5f4f3d39-b308-41ff-9f88-5db554eb40f6','d4f85fe8-5a6f-4446-a50d-eb725705546b',3,'2024-09-08 01:33:35','2024-09-08 04:00:00','สวนคุณเล็ก','Destination 2','D'),('6507fd43-6614-40ba-8b75-1245bf733028','d4f85fe8-5a6f-4446-a50d-eb725705546b',4,'2024-09-08 01:33:35','2024-09-08 05:30:00','นีราการ์เดนส์','Destination 3','D'),('7836f29e-3a0c-4995-8f85-705de64fb404','c7311a8a-e57a-48af-8bcc-448bba7ae35e',2,'2024-09-08 04:34:42','2024-09-08 02:30:00','รวมตัว','Gather 1','G'),('82d4ffee-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',1,'2024-07-08 02:00:00','2024-09-08 02:00:00','นีราการ์เดนส์','Destination 1','D'),('82d50a1d-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',2,'2024-07-08 02:05:00','2024-09-08 02:30:00','รวมตัว','Gather 1','G'),('82d50c37-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',3,'2024-07-08 02:10:00','2024-09-08 04:00:00','สวนคุณเล็ก','Destination 2','D'),('82d50d94-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',4,'2024-07-08 02:15:00','2024-09-08 05:30:00','นีราการ์เดนส์','Destination 3','D'),('82d50ec3-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',5,'2024-07-08 02:20:00','2024-09-08 06:00:00','กินข้าวและพักผ่อน','Activity','A'),('82d5107c-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',6,'2024-07-08 02:25:00','2024-09-08 07:30:00','รวมตัวเดินทาง','Gather 2','G'),('82d511de-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',7,'2024-07-08 02:30:00','2024-09-08 08:30:00','เขื่อนขุนด่านปราการชล','Destination 4','D'),('82d512f7-6cd2-11ef-9f47-04421a0238fa','7c6ad9a0-6cd2-11ef-9f47-04421a0238fa',8,'2024-07-08 02:35:00','2024-09-08 10:00:00','นีราการ์เดนส์','Destination 5','D'),('8b0b28bd-3649-492b-93a7-b1e84dca5993','c7311a8a-e57a-48af-8bcc-448bba7ae35e',1,'2024-09-08 04:34:42','2024-09-08 02:00:00','นีราการ์เดนส์','Destination 1','D'),('92de7ebe-05ee-4d2a-b330-584d5b4f487b','c7311a8a-e57a-48af-8bcc-448bba7ae35e',4,'2024-09-08 04:34:42','2024-09-08 05:30:00','นีราการ์เดนส์','Destination 3','D'),('9c75ec62-b73b-4649-aedb-5b6238f92826','d4f85fe8-5a6f-4446-a50d-eb725705546b',2,'2024-09-08 01:33:35','2024-09-08 02:30:00','รวมตัว','Gather 1','G'),('a5f3c6b3-3ab7-4c67-95ec-11315f7a2c72','d4f85fe8-5a6f-4446-a50d-eb725705546b',8,'2024-09-08 01:33:35','2024-09-08 10:00:00','นีราการ์เดนส์','Destination 5','D'),('a95ef75b-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',1,'2024-07-08 02:00:00','2024-09-08 02:00:00','นีราการ์เดนส์','Destination 1','D'),('a95ef8fb-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',2,'2024-07-08 02:05:00','2024-09-08 02:30:00','รวมตัว','Gather 1','G'),('a95ef98f-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',3,'2024-07-08 02:10:00','2024-09-08 04:00:00','สวนคุณเล็ก','Destination 2','D'),('a95efa05-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',4,'2024-07-08 02:15:00','2024-09-08 05:30:00','นีราการ์เดนส์','Destination 3','D'),('a95efac2-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',5,'2024-07-08 02:20:00','2024-09-08 06:00:00','กินข้าวและพักผ่อน','Activity','A'),('a95efb2e-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',6,'2024-07-08 02:25:00','2024-09-08 07:30:00','รวมตัวเดินทาง','Gather 2','G'),('a95efba2-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',7,'2024-07-08 02:30:00','2024-09-08 08:30:00','เขื่อนขุนด่านปราการชล','Destination 4','D'),('a95efc08-6cd2-11ef-9f47-04421a0238fa','9d785a08-6cd2-11ef-9f47-04421a0238fa',8,'2024-07-08 02:35:00','2024-09-08 10:00:00','นีราการ์เดนส์','Destination 5','D'),('b171cb10-836c-41e1-b0fb-0ed6bfb2be1a','c7311a8a-e57a-48af-8bcc-448bba7ae35e',7,'2024-09-08 04:34:42','2024-09-08 08:30:00','เขื่อนขุนด่านปราการชล','Destination 4','D'),('b9529f6c-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',1,'2025-07-07 01:00:00','2025-09-07 01:00:00','วัดลานบุญ','Starting point','D'),('b952a008-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',2,'2025-07-07 01:05:00','2025-09-07 01:30:00','ถวายสังฆทาน','Activity 1','A'),('b952a037-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',3,'2025-07-07 01:10:00','2025-09-07 02:30:00','วัดสังฆราชา','Destination 2','D'),('b952a061-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',4,'2025-07-07 01:15:00','2025-09-07 03:00:00','ถวายสังฆทาน','Activity 2','A'),('b952a0da-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',5,'2025-07-07 01:20:00','2025-09-07 05:00:00','กินข้าวเที่ยง','Gather','G'),('b952a106-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',6,'2025-07-07 01:25:00','2025-09-07 06:30:00','วัดลาดกระบัง','Destination 3','D'),('b952a130-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',7,'2025-07-07 01:30:00','2025-09-07 07:00:00','ถวายสังฆทาน','Activity 3','A'),('b952a157-6cd2-11ef-9f47-04421a0238fa','afcb0f08-6cd2-11ef-9f47-04421a0238fa',8,'2025-07-07 01:35:00','2025-09-07 08:30:00','พูดคุยกัน','Gather','G'),('bc2bf38e-20fc-47f5-90b2-ffe60a11cda3','d4f85fe8-5a6f-4446-a50d-eb725705546b',5,'2024-09-08 01:33:35','2024-09-08 06:00:00','กินข้าวและพักผ่อน','Activity','A'),('bf75dbb6-7a39-4826-8928-84ee8f5159ee','c7311a8a-e57a-48af-8bcc-448bba7ae35e',5,'2024-09-08 04:34:42','2024-09-08 06:00:00','กินข้าวและพักผ่อน','Activity','A'),('fcc65189-088f-4fa5-a34a-269d6f833463','d4f85fe8-5a6f-4446-a50d-eb725705546b',6,'2024-09-08 01:33:35','2024-09-08 07:30:00','รวมตัวเดินทาง','Gather 2','G');
/*!40000 ALTER TABLE `checkpoint` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-11 16:11:54
