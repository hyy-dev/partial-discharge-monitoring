/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 30/09/2019 11:37:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tb_url
-- ----------------------------
DROP TABLE IF EXISTS `tb_url`;
CREATE TABLE `tb_url`  (
  `uuid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `shorl_url_id` varchar(9) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '缩短后的短址id',
  `long_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '原网址',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `last_view` datetime(0) NULL DEFAULT NULL COMMENT '上一次访问时间',
  `view_pwd` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '访问密码',
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `user` (
  `user_id` int(32) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(32) NOT NULL UNIQUE,
  `pass_word` varchar(50) NOT NULL,
  `role_id` int(32) DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `device` (
  `device_id` bigint(20) NOT NULL,
  `name` varchar(64) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `sort_weight` int(11) NOT NULL,
  PRIMARY KEY (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `monitor_record` (
  `record_id` int(32) NOT NULL AUTO_INCREMENT,
  `device_id` bigint(20) NOT NULL,
  `qpda` double(10,2) NOT NULL,
  `qpdp` double(10,2) NOT NULL,
  `qsda` double(10,2) NOT NULL,
  `qsdp` double(10,2) NOT NULL,
  `collected_time` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `alarm_record` (
  `alarm_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `device_id` bigint(20) UNSIGNED NULL,
  `reason` text NULL,
  `content` text NULL,
  `status` tinyint(4) NOT NULL,
  `results` text NULL,
  `create_time` datetime NULL,
  PRIMARY KEY (`alarm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
