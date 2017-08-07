/*
SQLyog v10.2 
MySQL - 5.5.21-log : Database - uam_140422
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*Table structure for table `sys_data_change_log` */

CREATE TABLE `sys_data_change_log` (
  `id` varchar(36) NOT NULL,
  `entity_name` varchar(50) NOT NULL,
  `record_id` varchar(36) NOT NULL,
  `reason` varchar(250) DEFAULT NULL,
  `operator` varchar(50) NOT NULL,
  `change_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_data_change_log` */

/*Table structure for table `sys_data_change_log_item` */

CREATE TABLE `sys_data_change_log_item` (
  `id` varchar(36) NOT NULL,
  `field` varchar(50) NOT NULL,
  `before` varchar(300) DEFAULT NULL,
  `after` varchar(300) DEFAULT NULL,
  `log_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_sys_data_change_lo_logId` (`log_id`),
  CONSTRAINT `FK_sys_data_change_lo_logId` FOREIGN KEY (`log_id`) REFERENCES `sys_data_change_log` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_data_change_log_item` */

/*Table structure for table `wf_act_inst` */

CREATE TABLE `wf_act_inst` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `revision_` int(11) NOT NULL DEFAULT '0',
  `seq_` int(11) DEFAULT NULL,
  `path_` varchar(50) DEFAULT NULL,
  `root_inst_id` varchar(36) DEFAULT NULL,
  `calling_path` varchar(50) DEFAULT NULL,
  `calling_inst_id` varchar(36) DEFAULT NULL,
  `mi_batch` int(11) DEFAULT NULL,
  `proc_def_id` varchar(36) NOT NULL,
  `proc_inst_id` varchar(36) NOT NULL,
  `execution_id` varchar(36) NOT NULL,
  `execution_path` varchar(50) NOT NULL,
  `pre_task_id` varchar(36) DEFAULT NULL,
  `name_` varchar(150) NOT NULL,
  `title_` varchar(300) DEFAULT NULL,
  `type_` varchar(50) DEFAULT NULL,
  `ext_type` varchar(50) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_` bigint(20) DEFAULT NULL,
  `status_` smallint(6) DEFAULT '1',
  `end_reason` smallint(6) DEFAULT NULL,
  `end_comment` varchar(500) DEFAULT NULL,
  `deleted_` smallint(6) NOT NULL DEFAULT '0',
  `deleted_time` datetime DEFAULT NULL,
  `deleted_comment` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `FK_wf_act_inst_FK_WF_A` (`proc_def_id`),
  KEY `FK_wf_act_inst_FK_WF_0` (`execution_id`),
  KEY `FK_wf_act_inst_FK_WF_1` (`proc_inst_id`),
  CONSTRAINT `FK_wf_act_inst_FK_WF_1` FOREIGN KEY (`proc_inst_id`) REFERENCES `wf_proc_inst` (`id_`),
  CONSTRAINT `FK_wf_act_inst_FK_WF_0` FOREIGN KEY (`execution_id`) REFERENCES `wf_execution` (`id_`),
  CONSTRAINT `FK_wf_act_inst_FK_WF_A` FOREIGN KEY (`proc_def_id`) REFERENCES `wf_proc_def` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_act_inst` */

/*Table structure for table `wf_actor` */

CREATE TABLE `wf_actor` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `proc_inst_id` varchar(36) NOT NULL,
  `task_id` varchar(36) DEFAULT NULL,
  `notify_id` varchar(36) DEFAULT NULL,
  `usage_` smallint(6) NOT NULL DEFAULT '0',
  `type_` varchar(20) NOT NULL,
  `identity_` varchar(150) NOT NULL,
  `value_` varchar(350) NOT NULL,
  PRIMARY KEY (`id_`),
  KEY `FK_wf_actor_FK_WF_A` (`task_id`),
  KEY `FK_wf_actor_FK_WF_0` (`proc_inst_id`),
  KEY `FK_wf_actor_FK_WF_1` (`notify_id`),
  CONSTRAINT `FK_wf_actor_FK_WF_1` FOREIGN KEY (`notify_id`) REFERENCES `wf_notify` (`id_`),
  CONSTRAINT `FK_wf_actor_FK_WF_0` FOREIGN KEY (`proc_inst_id`) REFERENCES `wf_proc_inst` (`id_`),
  CONSTRAINT `FK_wf_actor_FK_WF_A` FOREIGN KEY (`task_id`) REFERENCES `wf_task` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_actor` */

/*Table structure for table `wf_backservice_task` */

CREATE TABLE `wf_backservice_task` (
  `id` varchar(36) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `creator_type` varchar(10) DEFAULT NULL,
  `last_executed_time` datetime DEFAULT NULL,
  `executed_times` int(11) DEFAULT NULL,
  `max_executed_times` int(11) DEFAULT NULL,
  `execute_start_time` datetime DEFAULT NULL,
  `execute_expired_time` datetime DEFAULT NULL,
  `parent` varchar(36) DEFAULT NULL,
  `task_type` varchar(10) DEFAULT NULL,
  `business_data` varchar(4000) DEFAULT NULL,
  `from_id` varchar(36) DEFAULT NULL,
  `from_name` varchar(150) DEFAULT NULL,
  `to_id` varchar(36) DEFAULT NULL,
  `processing_key` varchar(36) DEFAULT 'new',
  `to_name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_backservice_task` */

/*Table structure for table `wf_backservice_task_history` */

CREATE TABLE `wf_backservice_task_history` (
  `id` varchar(36) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `creator_type` varchar(10) DEFAULT NULL,
  `last_executed_time` datetime DEFAULT NULL,
  `executed_times` int(11) DEFAULT NULL,
  `max_executed_times` int(11) DEFAULT NULL,
  `execute_start_time` datetime DEFAULT NULL,
  `execute_expired_time` datetime DEFAULT NULL,
  `parent` varchar(36) DEFAULT NULL,
  `task_type` varchar(10) DEFAULT NULL,
  `business_data` varchar(4000) DEFAULT NULL,
  `from_id` varchar(36) DEFAULT NULL,
  `from_name` varchar(150) DEFAULT NULL,
  `to_id` varchar(36) DEFAULT NULL,
  `to_name` varchar(150) DEFAULT NULL,
  `execute_status` smallint(6) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_backservice_task_history` */

/*Table structure for table `wf_code` */

CREATE TABLE `wf_code` (
  `name_` varchar(150) NOT NULL,
  `value_` varchar(50) NOT NULL,
  `last_seq` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`name_`,`value_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_code` */

/*Table structure for table `wf_common_opinion` */

CREATE TABLE `wf_common_opinion` (
  `id` varchar(36) NOT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_by` varchar(36) DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `name` varchar(500) DEFAULT NULL,
  `content` varchar(4000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_common_opinion` */

/*Table structure for table `wf_custom_id` */

CREATE TABLE `wf_custom_id` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_custom_id` */

/*Table structure for table `wf_custom_id_component` */

CREATE TABLE `wf_custom_id_component` (
  `id` varchar(36) NOT NULL,
  `belong_to` varchar(36) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `last_date` datetime DEFAULT NULL,
  `fixed_value` varchar(50) DEFAULT NULL,
  `time_format` varchar(50) DEFAULT 'yyddMM',
  `start_value` int(11) DEFAULT '1',
  `length` int(11) DEFAULT '4',
  `next_value` int(11) DEFAULT '1',
  `step` int(11) DEFAULT '1',
  `prefix` varchar(50) DEFAULT NULL,
  `suffix` varchar(50) DEFAULT NULL,
  `scope` varchar(50) DEFAULT 'yyyyMMdd',
  PRIMARY KEY (`id`),
  KEY `FK_wf_custom_id_compo_Referen` (`belong_to`),
  CONSTRAINT `FK_wf_custom_id_compo_Referen` FOREIGN KEY (`belong_to`) REFERENCES `wf_custom_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_custom_id_component` */

/*Table structure for table `wf_draft` */

CREATE TABLE `wf_draft` (
  `DRAFT_ID` varchar(36) NOT NULL,
  `PROC_ID` varchar(36) NOT NULL,
  `TITLE` varchar(150) NOT NULL,
  `CREATED_DATE` datetime NOT NULL,
  `BUSINESS_ID` varchar(36) NOT NULL,
  `business_data` VARCHAR(2000) NULL,
  `OWNER_ID` varchar(36) DEFAULT NULL,
  `APP_CODE` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`DRAFT_ID`),
  KEY `FK_wf_draft_FK_WF_D` (`PROC_ID`),
  CONSTRAINT `FK_wf_draft_FK_WF_D` FOREIGN KEY (`PROC_ID`) REFERENCES `wf_proc` (`PROC_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_draft` */

/*Table structure for table `wf_execution` */

CREATE TABLE `wf_execution` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `revision_` int(11) NOT NULL DEFAULT '0',
  `seq_` int(11) DEFAULT NULL,
  `path_` varchar(50) DEFAULT NULL,
  `root_inst_id` varchar(36) DEFAULT NULL,
  `proc_def_id` varchar(36) NOT NULL,
  `proc_inst_id` varchar(36) NOT NULL,
  `caller_inst_id` varchar(36) DEFAULT NULL,
  `caller_exec_id` varchar(36) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `parent_act_name` varchar(150) DEFAULT NULL,
  `parent_act_title` varchar(300) DEFAULT NULL,
  `parent_act_path` varchar(50) DEFAULT NULL,
  `start_act_name` varchar(150) DEFAULT NULL,
  `start_act_title` varchar(300) DEFAULT NULL,
  `income_trans_name` varchar(150) DEFAULT NULL,
  `curr_act_inst_id` varchar(36) DEFAULT NULL,
  `last_task_id` varchar(36) DEFAULT NULL,
  `curr_act_path` varchar(50) DEFAULT NULL,
  `curr_act_name` varchar(150) DEFAULT NULL,
  `curr_act_title` varchar(300) DEFAULT NULL,
  `curr_act_started` smallint(6) NOT NULL DEFAULT '1',
  `end_act_name` varchar(150) DEFAULT NULL,
  `end_act_title` varchar(300) DEFAULT NULL,
  `parallel_` smallint(6) NOT NULL DEFAULT '0',
  `parallel_type` smallint(6) NOT NULL DEFAULT '0',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_` bigint(20) DEFAULT NULL,
  `status_` smallint(6) NOT NULL DEFAULT '1',
  `end_reason` smallint(6) DEFAULT NULL,
  `end_comment` varchar(500) DEFAULT NULL,
  `deleted_` smallint(6) NOT NULL DEFAULT '0',
  `deleted_time` datetime DEFAULT NULL,
  `deleted_comment` varchar(500) DEFAULT NULL,
  `child_seq` smallint(6) DEFAULT NULL,
  `act_seq` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_`),
  KEY `FK_wf_execution_FK_WF_P` (`proc_def_id`),
  KEY `FK_wf_execution_FK_WF_0` (`parent_id`),
  KEY `FK_wf_execution_FK_WF_1` (`proc_inst_id`),
  CONSTRAINT `FK_wf_execution_FK_WF_1` FOREIGN KEY (`proc_inst_id`) REFERENCES `wf_proc_inst` (`id_`),
  CONSTRAINT `FK_wf_execution_FK_WF_0` FOREIGN KEY (`parent_id`) REFERENCES `wf_execution` (`id_`),
  CONSTRAINT `FK_wf_execution_FK_WF_P` FOREIGN KEY (`proc_def_id`) REFERENCES `wf_proc_def` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_execution` */

/*Table structure for table `wf_form_attachment` */

CREATE TABLE `wf_form_attachment` (
  `id` varchar(36) NOT NULL,
  `name` varchar(300) NOT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_by` varchar(36) DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `creator` varchar(150) DEFAULT NULL,
  `business_id` varchar(36) DEFAULT NULL,
  `url` varchar(350) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_form_attachment` */

/*Table structure for table `wf_notify` */

CREATE TABLE `wf_notify` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `revision_` int(11) NOT NULL DEFAULT '0',
  `batch_` int(11) DEFAULT NULL,
  `proc_def_id` varchar(36) DEFAULT NULL,
  `proc_inst_id` varchar(36) DEFAULT NULL,
  `root_inst_id` varchar(36) DEFAULT NULL,
  `execution_id` varchar(36) DEFAULT NULL,
  `act_inst_id` varchar(36) DEFAULT NULL,
  `task_id` varchar(36) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `type_` smallint(6) NOT NULL DEFAULT '0',
  `title_` varchar(300) NOT NULL,
  `message_` varchar(4000) DEFAULT NULL,
  `priority_` smallint(6) NOT NULL DEFAULT '5',
  `act_name` varchar(150) NOT NULL,
  `act_title` varchar(300) DEFAULT NULL,
  `passer_id` varchar(36) DEFAULT NULL,
  `passer_name` varchar(150) DEFAULT NULL,
  `passer_dept_id` varchar(36) DEFAULT NULL,
  `passer_dept_name` varchar(150) DEFAULT NULL,
  `assignee_id` varchar(36) DEFAULT NULL,
  `assignee_name` varchar(150) DEFAULT NULL,
  `assignee_dept_id` varchar(36) DEFAULT NULL,
  `assignee_dept_name` varchar(150) DEFAULT NULL,
  `assignee_identity_id` varchar(36) DEFAULT NULL,
  `assignee_identity_name` varchar(150) DEFAULT NULL,
  `expire_time` datetime DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `read_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_` bigint(20) DEFAULT NULL,
  `status_` smallint(6) NOT NULL DEFAULT '1',
  `end_reason` smallint(6) DEFAULT '0',
  `end_comment` varchar(500) DEFAULT NULL,
  `user_comment` varchar(500) DEFAULT NULL,
  `deleted_` smallint(6) NOT NULL DEFAULT '0',
  `deleted_time` datetime DEFAULT NULL,
  `deleted_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `FK_wf_notify_FK_WF_N` (`parent_id`),
  CONSTRAINT `FK_wf_notify_FK_WF_N` FOREIGN KEY (`parent_id`) REFERENCES `wf_notify` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_notify` */

/*Table structure for table `wf_notify_reader` */

CREATE TABLE `wf_notify_reader` (
  `id` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `notify_id` varchar(36) DEFAULT NULL,
  `reader_id` varchar(36) DEFAULT NULL,
  `reader_name` varchar(150) DEFAULT NULL,
  `read_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_wf_notify_reader_FK_WF_N` (`notify_id`),
  CONSTRAINT `FK_wf_notify_reader_FK_WF_N` FOREIGN KEY (`notify_id`) REFERENCES `wf_notify` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_notify_reader` */

/*Table structure for table `wf_org_role` */

CREATE TABLE `wf_org_role` (
  `org_id` varchar(36) NOT NULL,
  `role_org_id` varchar(36) NOT NULL,
  `role_id` varchar(36) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL,
  `last_updated_by` varchar(50) NOT NULL,
  `last_updated_date` datetime NOT NULL,
  PRIMARY KEY (`org_id`,`role_org_id`,`role_id`),
  KEY `FK_wf_org_role_fk_wf_o` (`role_org_id`),
  KEY `FK_wf_org_role_fk_wf_1` (`role_id`),
  CONSTRAINT `FK_wf_org_role_fk_wf_1` FOREIGN KEY (`role_id`) REFERENCES `sec_role` (`ID`),
  CONSTRAINT `FK_wf_org_role_fk_wf_0` FOREIGN KEY (`org_id`) REFERENCES `uam_organization` (`ORG_ID`),
  CONSTRAINT `FK_wf_org_role_fk_wf_o` FOREIGN KEY (`role_org_id`) REFERENCES `uam_organization` (`ORG_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_org_role` */

/*Table structure for table `wf_param` */

CREATE TABLE `wf_param` (
  `name_` varchar(150) NOT NULL,
  `value_` varchar(350) DEFAULT NULL,
  `revision_` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`name_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_param` */

/*Table structure for table `wf_proc` */

CREATE TABLE `wf_proc` (
  `PROC_ID` varchar(36) NOT NULL,
  `PROC_CATAGORY_ID` varchar(36) NOT NULL,
  `created_time` datetime NOT NULL,
  `icon` varchar(150) DEFAULT 'icon-credit-card',
  `bg_color` varchar(50) DEFAULT NULL,
  `PROC_NAME` varchar(150) NOT NULL,
  `entity_name` varchar(50) NOT NULL,
  `proc_title_def` varchar(500) DEFAULT NULL,
  `proc_def_id` varchar(36) NULL,
  `PROC_DEF_KEY` varchar(36) NULL,
  `APP_CODE` varchar(36) DEFAULT NULL,
  `is_last` bit(1) NOT NULL DEFAULT b'1',
  `url` varchar(500) NOT NULL,
  `remarks` varchar(1500) DEFAULT NULL,
  `proc_stati_parentid` varchar(36) DEFAULT NULL,
  `proc_stati_id` varchar(36) DEFAULT NULL,
  `standard_consuming` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`PROC_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `wf_proc_catagory` */

CREATE TABLE `wf_proc_catagory` (
  `PROC_CATAGORY_ID` varchar(36) NOT NULL,
  `PARENT_ID` varchar(36) DEFAULT NULL,
  `CATAGORY_NAME` varchar(150) NOT NULL,
  `CATAGORY_DESC` varchar(500) DEFAULT NULL,
  `APP_CODE` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`PROC_CATAGORY_ID`),
  KEY `FK_wf_proc_catagory_FK_PROC` (`PARENT_ID`),
  CONSTRAINT `FK_wf_proc_catagory_FK_PROC` FOREIGN KEY (`PARENT_ID`) REFERENCES `wf_proc_catagory` (`PROC_CATAGORY_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_proc_catagory` */

/*Table structure for table `wf_proc_def` */

CREATE TABLE `wf_proc_def` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `key_` varchar(150) NOT NULL,
  `version_` int(11) NOT NULL DEFAULT '0',
  `title_` varchar(300) NOT NULL,
  `type_` varchar(20) NOT NULL DEFAULT 'bpmn',
  `content_` longtext NOT NULL,
  `form_key` varchar(150) DEFAULT NULL,
  `resource_name` varchar(150) DEFAULT NULL,
  `resource_url` varchar(350) DEFAULT NULL,
  `diagram_url` varchar(350) DEFAULT NULL,
  `enabled_` smallint(6) NOT NULL DEFAULT '1',
  `description_` varchar(4000) DEFAULT NULL,
  `creator_id` varchar(36) DEFAULT NULL,
  `creator_name` varchar(150) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `deleted_` smallint(6) NOT NULL DEFAULT '0',
  `deleted_time` datetime DEFAULT NULL,
  `deleted_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `wf_proc_inst` */

CREATE TABLE `wf_proc_inst` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `revision_` int(11) NOT NULL DEFAULT '0',
  `root_inst_id` varchar(36) DEFAULT NULL,
  `path_` varchar(50) DEFAULT NULL,
  `calling_path` varchar(50) DEFAULT NULL,
  `proc_def_id` varchar(36) NOT NULL,
  `proc_def_key` varchar(150) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `form_key` varchar(150) DEFAULT NULL,
  `business_id` varchar(36) DEFAULT NULL,
  `business_data` varchar(4000) DEFAULT NULL,
  `title_` varchar(500) NOT NULL,
  `priority_` smallint(6) NOT NULL DEFAULT '5',
  `starter_id` varchar(36) DEFAULT NULL,
  `starter_name` varchar(150) DEFAULT NULL,
  `starter_dept_id` varchar(36) DEFAULT NULL,
  `starter_dept_name` varchar(150) DEFAULT NULL,
  `starter_identity_id` varchar(36) DEFAULT NULL,
  `starter_identity_name` varchar(150) DEFAULT NULL,
  `agent_id` varchar(36) DEFAULT NULL,
  `agent_name` varchar(150) DEFAULT NULL,
  `agent_dept_id` varchar(36) DEFAULT NULL,
  `agent_dept_name` varchar(150) DEFAULT NULL,
  `agent_identity_id` varchar(36) DEFAULT NULL,
  `agent_identity_name` varchar(150) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `expire_time` datetime DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_` bigint(20) DEFAULT NULL,
  `status_` smallint(6) NOT NULL,
  `end_reason` smallint(6) DEFAULT NULL,
  `end_comment` varchar(500) DEFAULT NULL,
  `deleted_` smallint(6) NOT NULL DEFAULT '0',
  `deleted_time` datetime DEFAULT NULL,
  `deleted_comment` varchar(36) DEFAULT NULL,
  `exec_seq` int(11) NOT NULL DEFAULT '0',
  `act_seq` int(11) NOT NULL DEFAULT '0',
  `task_seq` int(11) NOT NULL DEFAULT '0',
  `actor_seq` int(11) NOT NULL DEFAULT '1',
  `notify_seq` int(11) NOT NULL DEFAULT '0',
  `var_seq` int(11) NOT NULL DEFAULT '0',
  `child_seq` int(11) DEFAULT NULL,
  `batch_seq` int(11) NOT NULL DEFAULT '0',
  `business_type` varchar(50) DEFAULT NULL,
  `proposer_id` varchar(36) DEFAULT NULL,
  `proposer_name` varchar(150) DEFAULT NULL,
  `proposer_dept_id` varchar(36) DEFAULT NULL,
  `proposer_dept_name` varchar(150) DEFAULT NULL,
  `current_activity_name` varchar(50) DEFAULT NULL,
  `current_activity_title` varchar(500) DEFAULT NULL,
  `END_USER_NAME` varchar(150) DEFAULT NULL,
  `proposer_identity_id` varchar(36) DEFAULT NULL,
  `END_USER_ID` varchar(36) DEFAULT NULL,
  `proposer_identity_name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `FK_wf_proc_inst_FK_WF_P` (`root_inst_id`),
  KEY `FK_wf_proc_inst_FK_WF_0` (`proc_def_id`),
  KEY `FK_wf_proc_inst_FK_WF_1` (`parent_id`),
  CONSTRAINT `FK_wf_proc_inst_FK_WF_1` FOREIGN KEY (`parent_id`) REFERENCES `wf_proc_inst` (`id_`),
  CONSTRAINT `FK_wf_proc_inst_FK_WF_0` FOREIGN KEY (`proc_def_id`) REFERENCES `wf_proc_def` (`id_`),
  CONSTRAINT `FK_wf_proc_inst_FK_WF_P` FOREIGN KEY (`root_inst_id`) REFERENCES `wf_proc_inst` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_proc_inst` */

/*Table structure for table `wf_proc_manager` */

CREATE TABLE `wf_proc_manager` (
  `proc_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`proc_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_proc_manager` */

/*Table structure for table `wf_proc_statistics` */

CREATE TABLE `wf_proc_statistics` (
  `proc_stati_id` varchar(36) NOT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `stati_name` varchar(150) DEFAULT NULL,
  `stati_desc` varchar(500) DEFAULT NULL,
  `level_type` int(11) NOT NULL DEFAULT '1',
  `exp_duration` int(11) DEFAULT '0',
  PRIMARY KEY (`proc_stati_id`),
  KEY `FK_wf_proc_statistics_fk_proc` (`parent_id`),
  CONSTRAINT `FK_wf_proc_statistics_fk_proc` FOREIGN KEY (`parent_id`) REFERENCES `wf_proc_statistics` (`proc_stati_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_proc_statistics` */

/*Table structure for table `wf_proxy` */

CREATE TABLE `wf_proxy` (
  `PROXY_ID` varchar(36) NOT NULL,
  `PROC_ID` varchar(36) NOT NULL,
  `ACTIVITY_NAMES` varchar(500) DEFAULT NULL,
  `ACTIVITY_TITLES` varchar(500) DEFAULT NULL,
  `ASSIGNEE_ID` varchar(36) NOT NULL,
  `ASSIGNEE_NAME` varchar(150) NOT NULL,
  `AGENT_ID` varchar(36) NOT NULL,
  `AGENT_NAME` varchar(150) NOT NULL,
  `START_DATE` datetime NOT NULL,
  `END_DATE` datetime NOT NULL,
  `LAST_UPDATED_TIME` datetime NOT NULL,
  `APP_CODE` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PROXY_ID`),
  KEY `FK_wf_proxy_FK_PROX` (`PROC_ID`),
  CONSTRAINT `FK_wf_proxy_FK_PROX` FOREIGN KEY (`PROC_ID`) REFERENCES `wf_proc` (`PROC_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_proxy` */

/*Table structure for table `wf_task` */

CREATE TABLE `wf_task` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `revision_` int(11) NOT NULL DEFAULT '0',
  `seq_` int(11) DEFAULT NULL,
  `batch_` int(11) DEFAULT NULL,
  `proc_def_id` varchar(36) NOT NULL,
  `proc_inst_id` varchar(36) NOT NULL,
  `root_inst_id` varchar(36) NOT NULL,
  `execution_id` varchar(36) DEFAULT NULL,
  `act_inst_id` varchar(36) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `deliver_task_id` varchar(36) DEFAULT NULL,
  `pre_task_id` varchar(36) DEFAULT NULL,
  `form_key` varchar(150) DEFAULT NULL,
  `business_id` varchar(36) DEFAULT NULL,
  `business_data` varchar(4000) DEFAULT NULL,
  `type_` smallint(6) NOT NULL DEFAULT '1',
  `title_` varchar(300) NOT NULL,
  `priority_` smallint(6) NOT NULL DEFAULT '5',
  `act_name` varchar(150) NOT NULL,
  `act_title` varchar(300) DEFAULT NULL,
  `creator_id` varchar(36) DEFAULT NULL,
  `creator_name` varchar(150) DEFAULT NULL,
  `assignee_id` varchar(36) DEFAULT NULL,
  `assignee_name` varchar(150) DEFAULT NULL,
  `assignee_dept_id` varchar(36) DEFAULT NULL,
  `assignee_dept_name` varchar(150) DEFAULT NULL,
  `assignee_identity_id` varchar(36) DEFAULT NULL,
  `assignee_identity_name` varchar(150) DEFAULT NULL,
  `agent_id` varchar(36) DEFAULT NULL,
  `agent_name` varchar(150) DEFAULT NULL,
  `agent_dept_id` varchar(36) DEFAULT NULL,
  `agent_dept_name` varchar(150) DEFAULT NULL,
  `agent_identity_id` varchar(36) DEFAULT NULL,
  `agent_identity_name` varchar(150) DEFAULT NULL,
  `expire_time` datetime DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `claim_time` datetime DEFAULT NULL,
  `read_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_` bigint(20) DEFAULT NULL,
  `status_` smallint(6) NOT NULL DEFAULT '1',
  `end_reason` smallint(6) DEFAULT '0',
  `end_comment` varchar(500) DEFAULT NULL,
  `user_input` varchar(2000) DEFAULT NULL,
  `user_comment` varchar(4000) DEFAULT NULL,
  `description_` varchar(2000) DEFAULT NULL,
  `deleted_` smallint(6) NOT NULL DEFAULT '0',
  `deleted_time` datetime DEFAULT NULL,
  `deleted_comment` varchar(500) DEFAULT NULL,
  `terminal` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `FK_wf_task_FK_WF_T` (`parent_id`),
  KEY `FK_wf_task_FK_WF_0` (`proc_def_id`),
  KEY `FK_wf_task_FK_WF_1` (`deliver_task_id`),
  KEY `FK_wf_task_FK_WF_2` (`proc_inst_id`),
  KEY `FK_wf_task_FK_WF_3` (`root_inst_id`),
  CONSTRAINT `FK_wf_task_FK_WF_3` FOREIGN KEY (`root_inst_id`) REFERENCES `wf_proc_inst` (`id_`),
  CONSTRAINT `FK_wf_task_FK_WF_0` FOREIGN KEY (`proc_def_id`) REFERENCES `wf_proc_def` (`id_`),
  CONSTRAINT `FK_wf_task_FK_WF_1` FOREIGN KEY (`deliver_task_id`) REFERENCES `wf_task` (`id_`),
  CONSTRAINT `FK_wf_task_FK_WF_2` FOREIGN KEY (`proc_inst_id`) REFERENCES `wf_proc_inst` (`id_`),
  CONSTRAINT `FK_wf_task_FK_WF_T` FOREIGN KEY (`parent_id`) REFERENCES `wf_task` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_task` */

/*Table structure for table `wf_user_role` */

CREATE TABLE `wf_user_role` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `org_id` varchar(36) NOT NULL,
  `role_id` varchar(36) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL,
  `last_updated_by` varchar(50) NOT NULL,
  `last_updated_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_wf_user_role_fk_wf_u` (`role_id`),
  KEY `FK_wf_user_role_fk_wf_0` (`user_id`),
  KEY `FK_wf_user_role_fk_wf_1` (`org_id`),
  CONSTRAINT `FK_wf_user_role_fk_wf_1` FOREIGN KEY (`org_id`) REFERENCES `uam_organization` (`ORG_ID`),
  CONSTRAINT `FK_wf_user_role_fk_wf_0` FOREIGN KEY (`user_id`) REFERENCES `uam_user` (`USER_ID`),
  CONSTRAINT `FK_wf_user_role_fk_wf_u` FOREIGN KEY (`role_id`) REFERENCES `sec_role` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wf_user_role` */

/*Table structure for table `wf_variable` */

CREATE TABLE `wf_variable` (
  `id_` varchar(36) NOT NULL,
  `app_code` varchar(36) DEFAULT NULL,
  `revision_` int(11) NOT NULL DEFAULT '0',
  `proc_inst_id` varchar(36) NOT NULL,
  `execution_id` varchar(36) DEFAULT NULL,
  `act_name` varchar(150) DEFAULT NULL,
  `task_id` varchar(36) DEFAULT NULL,
  `type_` smallint(6) NOT NULL DEFAULT '0',
  `clazz_` varchar(350) DEFAULT NULL,
  `name_` varchar(150) NOT NULL,
  `value_` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `FK_wf_variable_FK_WF_V` (`execution_id`),
  KEY `FK_wf_variable_FK_WF_0` (`proc_inst_id`),
  KEY `FK_wf_variable_FK_WF_1` (`task_id`),
  CONSTRAINT `FK_wf_variable_FK_WF_1` FOREIGN KEY (`task_id`) REFERENCES `wf_task` (`id_`),
  CONSTRAINT `FK_wf_variable_FK_WF_0` FOREIGN KEY (`proc_inst_id`) REFERENCES `wf_proc_inst` (`id_`),
  CONSTRAINT `FK_wf_variable_FK_WF_V` FOREIGN KEY (`execution_id`) REFERENCES `wf_execution` (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE VIEW v_wf_user_role AS
SELECT DISTINCT wur.role_id, rol.NAME AS role_name, wur.org_id, org.NAME AS org_name
FROM         wf_user_role AS wur INNER JOIN
                      uam_organization AS org ON wur.org_id = org.org_ID INNER JOIN
                      sec_role AS rol ON wur.role_id = rol.ID;

CREATE VIEW v_wf_dead_task AS
SELECT     wt1.id_, wt1.act_title, wt1.act_name, wt1.creator_id, wt1.creator_name, wt1.start_time, wt1.expire_time, wt1.pre_task_id, wproc.proc_name, wproc.proc_id, 
                      wt1.proc_inst_id, wpi.title_, wa1.value_ AS dead_actor_value, wpi.starter_id, wpi.starter_name
FROM         wf_task AS wt1 INNER JOIN
                      wf_actor AS wa1 ON wt1.id_ = wa1.task_id INNER JOIN
                      wf_proc_inst AS wpi ON wt1.proc_inst_id = wpi.id_ INNER JOIN
                      wf_proc AS wproc ON wpi.business_type = wproc.proc_id
WHERE     (wt1.deleted_ = 0) AND (wt1.status_ = 1) AND (wa1.value_ IN
                          (SELECT     wa.value_
                            FROM          wf_task AS wt INNER JOIN
                                                   wf_actor AS wa ON wt.id_ = wa.task_id
                            WHERE      (wt.status_ IN (0, 1)) AND (wa.type_ = 'role') AND (NOT EXISTS
                                                       (SELECT     user_id
                                                         FROM          wf_user_role AS wur
                                                         WHERE      (org_id = SUBSTRING(wa.value_, 6, LOCATE('.', wa.value_) - 6)) AND (role_id = SUBSTRING(wa.value_, LOCATE('.', wa.value_) + 1, 
                                                                                100))))
                            UNION
                            SELECT     wa.value_
                            FROM         wf_task AS wt INNER JOIN
                                                  wf_actor AS wa ON wt.id_ = wa.task_id
                            WHERE     (wt.status_ IN (0, 1)) AND (wa.type_ = 'duty') AND (NOT EXISTS
                                                      (SELECT     USER_ID
                                                        FROM          uam_user_post AS wup
                                                        WHERE      (POST_ID =
                                                                                   (SELECT     POST_ID
                                                                                     FROM          uam_post AS wfpost
                                                                                     WHERE      (ORG_ID = SUBSTRING(wa.value_, 6, LOCATE('.', wa.value_) - 6)) AND (DUTY_ID = SUBSTRING(wa.value_, LOCATE('.', 
                                                                                                            wa.value_) + 1, 100))))))
                            UNION
                            SELECT     wa.value_
                            FROM         wf_task AS wt INNER JOIN
                                                  wf_actor AS wa ON wt.id_ = wa.task_id
                            WHERE     (wt.status_ IN (0, 1)) AND (wa.type_ = 'post') AND (NOT EXISTS
                                                      (SELECT     USER_ID
                                                        FROM          uam_user_post AS wup
                                                        WHERE      (POST_ID = SUBSTRING(wa.value_, 6, 100))))));

/*Data for the table `wf_variable` */
CREATE TABLE `wf_act_config` (
  `id` VARCHAR(36)  NOT NULL,
  `proc_id` VARCHAR(36)  NOT NULL,
  `act_name` VARCHAR(150)  NOT NULL,
  `entity_name` VARCHAR(38)  DEFAULT NULL,
  `form_url` VARCHAR(500)  DEFAULT NULL,
  `approve_for` VARCHAR(150)  DEFAULT NULL,
  `is_need_approve` BIT(1) DEFAULT NULL,
  `is_need_opinion` BIT(1) DEFAULT NULL,
  `businessData` VARCHAR(2000)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_wf_act_config_FK_wf_u` (`proc_id`),
  CONSTRAINT `FK_wf_act_config_FK_wf_u` FOREIGN KEY (`proc_id`) REFERENCES `wf_proc` (`PROC_ID`)
);

/*Table structure for table `wf_event_config` */

CREATE TABLE `wf_event_config` (
  `id` VARCHAR(36)  NOT NULL COMMENT '主键',
  `proc_id` VARCHAR(36)  DEFAULT NULL COMMENT '流程',
  `act_name` VARCHAR(150)  DEFAULT NULL COMMENT '环节',
  `event_type` VARCHAR(150)  DEFAULT NULL COMMENT '事件类型',
  `event_operation` VARCHAR(150)  DEFAULT NULL COMMENT '事件操作',
  `business_data` VARCHAR(2000)  DEFAULT NULL COMMENT '业务数据',
  PRIMARY KEY (`id`)
);

/*Table structure for table `wf_proc_permission` */

CREATE TABLE `wf_proc_permission` (
  `id` VARCHAR(36)  NOT NULL COMMENT '主键',
  `proc_id` VARCHAR(36)  NOT NULL COMMENT '流程',
  `act_name` VARCHAR(150)  DEFAULT NULL COMMENT '环节名',
  `entity_name` VARCHAR(38)  DEFAULT NULL COMMENT '实体名',
  `name` VARCHAR(38)  NOT NULL COMMENT '权限名称',
  `type` VARCHAR(38)  DEFAULT NULL COMMENT '权限类型',
  `permission` VARCHAR(50)  NOT NULL COMMENT '权限',
  PRIMARY KEY (`id`)
);
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
