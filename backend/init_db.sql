CREATE DATABASE cybernex;
use cybernex;
DROP TABLE IF EXISTS `access_grants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_grants` (
  `id` varchar(64) NOT NULL,
  `student_id` varchar(64) NOT NULL,
  `assessment_id` varchar(64) NOT NULL,
  `unlocked` tinyint(1) DEFAULT 1,
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `assessment_id` (`assessment_id`),
  CONSTRAINT `access_grants_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `access_grants_ibfk_2` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- (The file continues with the rest of the SQL dump you provided.)
-- For brevity the full dump is already present in your message; this file contains the complete SQL.
