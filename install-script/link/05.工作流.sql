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

/*Data for the table `wf_proc` */

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

/*Data for the table `wf_proc_def` */

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

INSERT  INTO `metaui_operation`(`id`,`name`,`display_name`,`entity_name`,`scope`,`record_Type`,`icon`,`icon_Small`,`icon_Large`,`tool_tip`,`script_lib`,`script`,`main_func`,`is_default`,`display_order`,`creator`,`created_time`,`modified_by`,`modified_time`,`in_control`,`enabled`) 
VALUES 
('0ade8ee0-45c1-43fb-8873-d1daa9971b43','delVersions','删除所有版本','MetauiTemplate','listtoolbar,listcontext,formtoolbar','single','mini/icon_tool_024.gif',NULL,NULL,'删除所有版本','system/metauiTemplate.js',NULL,'system/metauiTemplate.delVersions','\0',0,'系统管理员','2013-07-30 15:45:31','系统管理员','2013-07-30 15:45:31','',''),
('179a9c32-83b2-1135-8c6b-0550f7009d22','config','配置','MetauiOperation','listtoolbar','multi','main/cog.png',NULL,NULL,'配置视图',NULL,NULL,'grid.configGrid','',9,'system','2012-12-25 00:00:00','system','2012-12-25 00:00:00','',''),
('1999ed42-d497-4279-9b38-1d15b357dcd0','read','阅读','WfNotify','listtoolbar,listcontext','single','led-icons/application_view_gallery.png',NULL,NULL,'阅读','system/workflow.js',NULL,'system/workflow.itemRead','\0',0,'管理员','2013-10-23 13:46:20','管理员','2013-10-23 13:46:20','',''),
('26849e91-b235-491e-af8d-da3c3b50c31a','preview','预览','MetauiTemplate','listtoolbar,listcontext','single','main/pictures.png',NULL,NULL,'预览视图',NULL,NULL,'','\0',0,'系统管理员','2013-07-30 15:36:58','系统管理员','2013-07-30 15:41:15','',''),
('3191afc6-e3a7-4e1d-9621-25917c07c25d','publish','发布','MetauiTemplate','listtoolbar,listcontext,formtoolbar','single','mini/icon_tool_107.gif',NULL,NULL,'发布视图','system/metauiTemplate.js',NULL,'system/metauiTemplate.publish','\0',0,'系统管理员','2013-07-30 15:40:14','系统管理员','2013-07-30 15:41:29','',''),
('4cf5a503-5b06-40f6-a359-a42e668498d4','approve','审批','WfTask','listtoolbar,listcontext','single','led-icons/pencil.png',NULL,NULL,'审批','system/workflow.js',NULL,'system/workflow.itemApprove','\0',0,'系统管理员','2013-10-21 17:20:50','系统管理员','2013-10-21 17:23:54','',''),
('4da552a9-bb06-43fa-aa59-6848a9377262','versions','版本管理','MetauiTemplate','listtoolbar,listcontext,formtoolbar','single','mini/icon_tool_026.gif',NULL,NULL,NULL,'system/metauiTemplate.js',NULL,'system/metauiTemplate.listVersions','\0',0,'系统管理员','2013-07-30 15:44:15','系统管理员','2013-07-30 15:44:15','',''),
('6c0c6c07-df5a-4393-92e6-72700c4c272b','deploy','新部署','WfProcDef','listtoolbar,listcontext','single','main/folder-add.png',NULL,NULL,'部署新流程','system/workflow.js',NULL,'system/workflow.procDefDeploy','\0',0,'管理员','2013-10-24 13:45:26','管理员','2013-10-24 13:45:58','',''),
('6e904c40-5561-4bc1-8689-d364088f08cd','design','设计','WfProc','listtoolbar,listcontext','single','led-icons/page_white_vector.png',NULL,NULL,'设计流程','system/workflow.js',NULL,'system/workflow.design','\0',0,'系统管理员','2014-02-17 15:11:18','系统管理员','2014-02-17 15:11:18','',''),
('716db6cd-2ebb-451f-a63f-929e0f0943e7','sendDraft','发起','WfDraft','listtoolbar,listcontext','single','led-icons/pencil.png',NULL,NULL,NULL,'system/workflow.js',NULL,'system/workflow.startProcItemByDraft','\0',0,'管理员','2013-10-23 13:46:20','管理员','2013-10-23 13:46:20','',''),
('87d08065-08c3-44af-82a2-279231a3b175','start','发起','WfProc','listtoolbar,listcontext,formtoolbar','single','led-icons/text_signature.png',NULL,NULL,'发起事项','system/workflow.js',NULL,'system/workflow.startProcItem','\0',0,'管理员','2013-10-24 17:09:59','管理员','2013-10-24 17:09:59','',''),
('a99dbdcf-247e-4f92-8ae1-2ecb0cc842b3','rollback','撤回','WfTask','listtoolbar,listcontext','single','main/arrow-left.png',NULL,NULL,NULL,'system/workflow.js',NULL,'system/workflow.taskRollback','\0',0,'管理员','2013-12-07 14:46:37','管理员','2013-12-07 14:46:37','',''),
('af6fd0dc-b037-40de-b4a6-deda5e6489a6','deleteChild','删除子菜单','PortalMenu','listtoolbar,listcontext','single','led-icons/cancel.png',NULL,NULL,'删除子菜单','system/portalmenu.js',NULL,'system/portalmenu.deleteChild','\0',0,'系统管理员','2014-04-17 18:02:34','系统管理员','2014-04-17 18:02:34','',''),
('af8884d0-2734-42da-8f12-95cd6435cb69','remind','催办','WfTask','listtoolbar,listcontext','single','led-icons/smiley_mad.png',NULL,NULL,NULL,'system/workflow.js',NULL,'system/workflow.remind','\0',0,'系统管理员','2014-01-07 21:22:48','系统管理员','2014-01-07 21:22:48','',''),
('b64cda5c-8f49-45fa-914c-8b6d4c291f79','forceEnd','作废流程','WfProcInst','listtoolbar','single','led-icons/cross.png',NULL,NULL,'作废流程','system/workflow.js',NULL,'system/workflow.forceEnd','\0',0,'系统管理员','2014-03-03 13:37:34','系统管理员','2014-03-03 14:22:02','',''),
('f102cdf0-9e62-4b59-9113-e76723d8fbd9','batchCreate','新建委托','WfProxy','listtoolbar,listcontext','multi','led-icons/add.png',NULL,NULL,'批量创建委托','system/workflow.js',NULL,'system/workflow.createProxyBatch','\0',0,'系统管理员','2014-01-03 10:27:03','系统管理员','2014-01-03 10:27:03','','');

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('04b19d33-15f4-4d19-b5ad-39c34895d948','待阅事项',NULL,'~/entities/wfnotify/list','1',NULL,'normal','led-icons/camera.png',NULL,'2','tab',NULL,NULL,'1','管理员','2013-11-28 10:44:30',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('140578ed-773b-4bb3-abc5-93ce3d300e09','流程提醒日志',NULL,'~/entities/VWfDeadTask/list','1',NULL,'normal','led-icons/wall_brick.png',NULL,'7',NULL,NULL,NULL,'2','系统管理员','2014-03-07 12:24:50',NULL,'abc40c6f-c32c-4439-8e02-79d5b6fec35c');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('1cb6bdbd-cbd2-48b5-830f-edf3fb2df316','委托我的待办',NULL,'~/entities/wftask/list?view=proxy','1',NULL,'normal','led-icons/dashboard.png',NULL,'10','tab','view','$WfTask:view:proxy','1','系统管理员','2014-01-05 20:50:31',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('55065e6e-90e6-483a-b149-0c9466f2d79c','已阅事项',NULL,'~/entities/wfnotify/list?view=read','1',NULL,'normal','led-icons/emoticon_wink.png',NULL,'5','tab',NULL,NULL,'1','管理员','2013-11-28 10:44:52',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('5627d746-23f8-4be9-b86b-6041ca320666','流程用户角色',NULL,'~/entities/wfuserrole/treeList/uamorganization?view=tree_list&refField=orgId','1',NULL,'normal','led-icons/user.png',NULL,'19',NULL,NULL,NULL,'2','系统管理员','2014-04-17 18:08:21',NULL,'abc40c6f-c32c-4439-8e02-79d5b6fec35c');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('58ea3e0d-bede-4373-b0bb-2b104ceb8b37','待办事项',NULL,'~/entities/wftask/list','1',NULL,'normal','led-icons/clock.png',NULL,'1','tab',NULL,NULL,'1','管理员','2013-11-28 10:44:22',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('5a1911f2-b1c2-4df8-9426-2b431048055c','流程实例信息',NULL,'~/entities/wfprocinst/list?view=all','1',NULL,'normal','led-icons/application_view_columns.png',NULL,'3','tab',NULL,NULL,'2','系统管理员','2014-03-07 12:24:27',NULL,'abc40c6f-c32c-4439-8e02-79d5b6fec35c');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('64cbdecf-9d4e-4bae-932c-fc97c60f3209','我发起的流程',NULL,'~/entities/wfprocinst/list','1',NULL,'normal','led-icons/compass.png',NULL,'9','tab',NULL,NULL,'1','管理员','2014-01-04 21:45:52',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('8b5e870a-28b0-4249-93ab-99f7b4ca9646','工作流程信息',NULL,'~/entities/wfproc/treeList/wfproccatagory/?view=tree_list&refField=procCatagoryId&treeLabelField=catagoryName','1',NULL,'normal','led-icons/arrow_divide.png',NULL,'1','tab',NULL,NULL,'2','系统管理员','2014-04-04 15:46:36',NULL,'abc40c6f-c32c-4439-8e02-79d5b6fec35c');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('936d92a8-6670-4b30-8700-888ec08d360d','委托授权',NULL,'~/entities/wfproxy/list?view=list','1',NULL,'normal','led-icons/control_wheel.png',NULL,'11','tab','view','$WfProxy:view:list','1','系统管理员','2014-01-05 20:50:42',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('9897c01b-7a4e-4656-9e45-3b986702e08e','草稿事项',NULL,'~/entities/wfdraft/list','1',NULL,'normal','led-icons/page_white_stack.png',NULL,'3','tab',NULL,NULL,'1','管理员','2013-11-28 10:44:38',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('abc40c6f-c32c-4439-8e02-79d5b6fec35c','工作流程管理',NULL,NULL,'1',NULL,'normal','led-icons/books.png',NULL,'2','tab',NULL,NULL,'1','系统管理员','2014-03-07 12:23:53',NULL,'menuadmin');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('cb262d0f-c376-4295-b1be-145296fb3856','工作台',NULL,'~/workspace','1',NULL,'normal','mini/home.gif',NULL,'0',NULL,NULL,NULL,'0','系统管理员','2013-11-10 16:24:46',NULL,'menuadmin');
INSERT INTO `portal_menu` (`menu_id`, `name`, `code`, `url`, `status`, `submenu_source`, `submenu_source_type`, `icon`, `css_style`, `display_order`, `show_type`, `menu_source`, `menu_source_id`, `level`, `modified_by`, `modified_time`, `description`, `parent_id`) VALUES('fc6b1b86-02aa-40a1-8ee9-040248fc2778','流程效率分析',NULL,'workflow/statistics/procEffectiveList','1',NULL,'normal','led-icons/counter.png',NULL,'5','tab',NULL,NULL,'2','系统管理员','2014-03-07 12:24:38',NULL,'abc40c6f-c32c-4439-8e02-79d5b6fec35c');
insert  into `portal_menu`(`menu_id`,`name`,`code`,`url`,`status`,`submenu_source`,`submenu_source_type`,`icon`,`css_style`,`display_order`,`show_type`,`menu_source`,`menu_source_id`,`level`,`modified_by`,`modified_time`,`description`,`parent_id`)values('028a2fec-41c9-4c94-9ed6-8ae2422f9dd7','已办事项',NULL,'~/entities/wftask/list?view=done',1,NULL,'normal','led-icons/emoticon_tongue.png',NULL,4,'tab',NULL,NULL,1,'管理员','2013-11-28 10:44:44',NULL,'cb262d0f-c376-4295-b1be-145296fb3856');
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=1 */;


INSERT  INTO `sec_role`(`ID`,`Code`,`Name`,`Description`,`Condition_Expr`,`Type`,`Participant_Type`,`Created_By`,`Created_Date`,`Last_Updated_By`,`Last_Updated_Date`,`isDefault`) VALUES ('ae3945da-8125-4c89-9bee-12d478d2334b',NULL,'部门接口人',NULL,NULL,1,0,'3a8100d5-f2f1-4c99-bccf-392254e20eea','2014-03-20 14:02:29','3a8100d5-f2f1-4c99-bccf-392254e20eea','2014-03-20 14:02:29','\0');

/*Data for the table `sec_permission_rule` */
insert  into `sec_permission_rule`(`ID`,`OPERATION_ID`,`NAME`,`PRIORITY`,`RULE`,`BEHAVIOUR`,`SCOPE_TYPE`,`DESCRIPTION`,`CREATED_BY`,`CREATED_DATE`,`LAST_UPDATED_BY`,`LAST_UPDATED_DATE`) values ('6c4a02bb-37ac-4bba-b674-8f43cfc6e3e9','WfNotify','我的通知',10,'(@{tableAlias}.id in (\r\n	select wa.notifyId from wfActor wa where wa.value in (@{env.UserActors})\r\n	union\r\n	select wn1 .id as notifyId from wfNotify wn1 where wn1.assigneeId=\'@{env.User.id}\'  \r\n))',NULL,2,NULL,'管理员','2013-11-29 16:10:08','管理员','2013-11-29 16:10:08'),('da965f63-8a55-4cbf-84a3-5a6a9fd46451','WfTask','我的任务',10,'(@{tableAlias}.id in (\r\n	select wa.taskId from wfActor wa where wa.value in (@{env.UserActors}) and wa.notifyId is null\r\n	union\r\n	select wt1.id as taskId from wfTask wt1 where wt1.assigneeId=\'@{env.User.id}\'  \r\n	union\r\n	select wt2.id as taskId from wfTask wt2 where wt2.agentId = \'@{env.User.id}\'\r\n))',NULL,2,NULL,'管理员','2013-10-31 18:14:59','管理员','2013-10-31 18:14:59');
/*Data for the table `sec_permission` */
INSERT  INTO `sec_permission`(`id`,`parent`,`code`,`name`,`url`,`ELEMENT_ID`,`ELEMENT_BEHAVIOUR`,`ORDER`,`DESCRIPTION`,`ICON`,`ICON_LARGE`,`ICON_SMALL`,`ICON_MIDDLE`,`CREATED_BY`,`CREATED_DATE`,`LAST_UPDATED_BY`,`LAST_UPDATED_DATE`,`IS_REFERENCE`,`REFERENCE`) VALUES ('79e8d226-6d4f-41c2-b7e3-532a0ed02193',NULL,'$WfNotify:Entity:Select','查询通知',NULL,'$WfNotify:Entity:Select',NULL,0,NULL,NULL,NULL,NULL,NULL,'43FE6476-CD7B-493B-8044-C7E3149D0876','2014-04-29 17:23:58','43FE6476-CD7B-493B-8044-C7E3149D0876','2014-04-29 17:23:58','\0',NULL);
INSERT  INTO `sec_permission`(`id`,`parent`,`code`,`name`,`url`,`ELEMENT_ID`,`ELEMENT_BEHAVIOUR`,`ORDER`,`DESCRIPTION`,`ICON`,`ICON_LARGE`,`ICON_SMALL`,`ICON_MIDDLE`,`CREATED_BY`,`CREATED_DATE`,`LAST_UPDATED_BY`,`LAST_UPDATED_DATE`,`IS_REFERENCE`,`REFERENCE`) VALUES ('94d3563e-a842-4f2e-a8af-dbff9f5ff522',NULL,'$WfTask:Entity:Select','查询任务',NULL,'$WfTask:Entity:Select',NULL,0,NULL,NULL,NULL,NULL,NULL,'43FE6476-CD7B-493B-8044-C7E3149D0876','2014-04-29 17:23:10','43FE6476-CD7B-493B-8044-C7E3149D0876','2014-04-29 17:23:10','\0',NULL);
/*Data for the table `sec_role_permission` */
INSERT  INTO `sec_role_permission`(`ROLE_ID`,`OPERATION_ID`,`RULE_ID`,`CREATED_BY`,`CREATED_DATE`,`LAST_UPDATED_BY`,`LAST_UPDATED_DATE`) VALUES ('00000000-0000-0000-0000-000000000000','79e8d226-6d4f-41c2-b7e3-532a0ed02193','6c4a02bb-37ac-4bba-b674-8f43cfc6e3e9','系统管理员','2014-04-29 17:24:08','系统管理员','2014-04-29 17:24:08');
INSERT  INTO `sec_role_permission`(`ROLE_ID`,`OPERATION_ID`,`RULE_ID`,`CREATED_BY`,`CREATED_DATE`,`LAST_UPDATED_BY`,`LAST_UPDATED_DATE`) VALUES ('00000000-0000-0000-0000-000000000000','94d3563e-a842-4f2e-a8af-dbff9f5ff522','da965f63-8a55-4cbf-84a3-5a6a9fd46451','系统管理员','2014-04-29 17:23:38','系统管理员','2014-04-29 17:23:38');
insert  into `wf_proc_def`(`id_`,`app_code`,`key_`,`version_`,`title_`,`type_`,`content_`,`form_key`,`resource_name`,`resource_url`,`diagram_url`,`enabled_`,`description_`,`creator_id`,`creator_name`,`create_time`,`deleted_`,`deleted_time`,`deleted_comment`) values ('20140513_00001',NULL,'freeStyleProcess',1,'自由流','bpmn','<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:p1=\"http://schemas.bingosoft.net/p1/1.0\" id=\"_wfdesigner_\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\" targetNamespace=\"null\">\r\n  <process id=\"freeStyleProcess\" name=\"自由流\">\r\n    <startEvent id=\"_D9186EBF-9502-4510-BAAE-C660AB029D43\" name=\"开始自由流\">\r\n      <outgoing>_6C3DFDFC-ED1D-4DB3-ACFE-462DFD84F5AF</outgoing>\r\n    </startEvent>\r\n    <sequenceFlow id=\"_6C3DFDFC-ED1D-4DB3-ACFE-462DFD84F5AF\" sourceRef=\"_D9186EBF-9502-4510-BAAE-C660AB029D43\" targetRef=\"_058003C5-A5BE-4DA0-A845-DB28AEAEA56D\"/>\r\n    <userTask p1:type=\"draft\" id=\"_058003C5-A5BE-4DA0-A845-DB28AEAEA56D\" name=\"拟稿任务\">\r\n      <incoming>_6C3DFDFC-ED1D-4DB3-ACFE-462DFD84F5AF</incoming>\r\n      <outgoing>_9C64A4AD-278C-4032-BD3C-6A26EBB92CEB</outgoing>\r\n      <outgoing>_8500C14A-98C8-4BC9-8DE0-6779925BC605</outgoing>\r\n      <outgoing>_5F93014E-207E-4DF5-BEAF-6B6E612F18ED</outgoing>\r\n    </userTask>\r\n    <subProcess id=\"_9A7EF099-1CCD-4DFE-ABB8-95B46EC35084\" p1:assignees=\"${loopItem}\" name=\"会签\">\r\n      <incoming>_07BAE238-5EDE-42D8-B5BE-4A93AE6E546E</incoming>\r\n      <incoming>_8500C14A-98C8-4BC9-8DE0-6779925BC605</incoming>\r\n      <multiInstanceLoopCharacteristics id=\"_sp8U0PYLEeOD6pi7bYx2RA\" p1:collection=\"assigneeList\" p1:elementVariable=\"loopItem\">\r\n        <completionCondition xsi:type=\"tFormalExpression\" id=\"_sp8U0fYLEeOD6pi7bYx2RA\"></completionCondition>\r\n      </multiInstanceLoopCharacteristics>\r\n      <startEvent id=\"_E9CEC789-040B-45D8-B676-8C27110192AF\" name=\"开始会签\">\r\n        <outgoing>_AC6010D4-DFAD-4247-8F5D-04D0876BEBD8</outgoing>\r\n      </startEvent>\r\n      <userTask id=\"_F4898AE9-B2B4-4768-99FD-FBADC40D3147\" p1:userChoiceActors=\"true\" name=\"会签内部审批\">\r\n        <incoming>_AC6010D4-DFAD-4247-8F5D-04D0876BEBD8</incoming>\r\n        <incoming>_B6E47E9C-D282-44D3-98AF-E6FF90868011</incoming>\r\n        <outgoing>_051DAC80-B339-4C75-8163-723A79F3F70F</outgoing>\r\n        <outgoing>_B6E47E9C-D282-44D3-98AF-E6FF90868011</outgoing>\r\n        <property id=\"isNeedUserSelectAct\" name=\"true\"/>\r\n        <property id=\"isContersignInner\" name=\"true\"/>\r\n      </userTask>\r\n      <endEvent id=\"_F41CCDB6-AE12-4440-9A57-F2BB3A7AF8B7\" name=\"结束会签\">\r\n        <incoming>_051DAC80-B339-4C75-8163-723A79F3F70F</incoming>\r\n      </endEvent>\r\n      <sequenceFlow id=\"_AC6010D4-DFAD-4247-8F5D-04D0876BEBD8\" sourceRef=\"_E9CEC789-040B-45D8-B676-8C27110192AF\" targetRef=\"_F4898AE9-B2B4-4768-99FD-FBADC40D3147\"/>\r\n      <sequenceFlow id=\"_051DAC80-B339-4C75-8163-723A79F3F70F\" name=\"结束内部会签\" sourceRef=\"_F4898AE9-B2B4-4768-99FD-FBADC40D3147\" targetRef=\"_F41CCDB6-AE12-4440-9A57-F2BB3A7AF8B7\">\r\n        <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp8U0vYLEeOD6pi7bYx2RA\">${countersign&lt;0}</conditionExpression>\r\n      </sequenceFlow>\r\n      <sequenceFlow id=\"_B6E47E9C-D282-44D3-98AF-E6FF90868011\" name=\"内部循环\" sourceRef=\"_F4898AE9-B2B4-4768-99FD-FBADC40D3147\" targetRef=\"_F4898AE9-B2B4-4768-99FD-FBADC40D3147\">\r\n        <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp8U0_YLEeOD6pi7bYx2RA\">${countersign==0}</conditionExpression>\r\n      </sequenceFlow>\r\n    </subProcess>\r\n    <userTask id=\"_4ED0E55A-62A2-47EA-8D74-9C5928049E7C\" p1:userChoiceActors=\"true\" name=\"循环审批\">\r\n      <incoming>_48B86B37-C0E4-4B40-B135-BAE7F2BDBDAA</incoming>\r\n      <incoming>_9C64A4AD-278C-4032-BD3C-6A26EBB92CEB</incoming>\r\n      <outgoing>_C09E22AB-52ED-49B9-82AB-C7F0AFA39A8E</outgoing>\r\n      <outgoing>_48B86B37-C0E4-4B40-B135-BAE7F2BDBDAA</outgoing>\r\n      <outgoing>_07BAE238-5EDE-42D8-B5BE-4A93AE6E546E</outgoing>\r\n      <property id=\"isNeedUserSelectAct\" name=\"true\"/>\r\n    </userTask>\r\n    <sequenceFlow id=\"_9C64A4AD-278C-4032-BD3C-6A26EBB92CEB\" name=\"普通审批\" sourceRef=\"_058003C5-A5BE-4DA0-A845-DB28AEAEA56D\" targetRef=\"_4ED0E55A-62A2-47EA-8D74-9C5928049E7C\">\r\n      <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp8U1PYLEeOD6pi7bYx2RA\">${countersign==0}</conditionExpression>\r\n    </sequenceFlow>\r\n    <endEvent id=\"_CCE61B82-9DB8-493F-8FD8-64B9D29E67DC\" name=\"结束自由流\">\r\n      <incoming>_5F93014E-207E-4DF5-BEAF-6B6E612F18ED</incoming>\r\n      <incoming>_C09E22AB-52ED-49B9-82AB-C7F0AFA39A8E</incoming>\r\n    </endEvent>\r\n    <sequenceFlow id=\"_C09E22AB-52ED-49B9-82AB-C7F0AFA39A8E\" name=\"结束流程\" sourceRef=\"_4ED0E55A-62A2-47EA-8D74-9C5928049E7C\" targetRef=\"_CCE61B82-9DB8-493F-8FD8-64B9D29E67DC\">\r\n      <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp874PYLEeOD6pi7bYx2RA\">${countersign&lt;0}</conditionExpression>\r\n    </sequenceFlow>\r\n    <sequenceFlow id=\"_48B86B37-C0E4-4B40-B135-BAE7F2BDBDAA\" sourceRef=\"_4ED0E55A-62A2-47EA-8D74-9C5928049E7C\" targetRef=\"_4ED0E55A-62A2-47EA-8D74-9C5928049E7C\">\r\n      <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp874fYLEeOD6pi7bYx2RA\">${countersign==0}</conditionExpression>\r\n    </sequenceFlow>\r\n    <sequenceFlow id=\"_8500C14A-98C8-4BC9-8DE0-6779925BC605\" name=\"发起会签\" sourceRef=\"_058003C5-A5BE-4DA0-A845-DB28AEAEA56D\" targetRef=\"_9A7EF099-1CCD-4DFE-ABB8-95B46EC35084\">\r\n      <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp874vYLEeOD6pi7bYx2RA\">${countersign==1}</conditionExpression>\r\n    </sequenceFlow>\r\n    <sequenceFlow id=\"_5F93014E-207E-4DF5-BEAF-6B6E612F18ED\" name=\"结束流程\" sourceRef=\"_058003C5-A5BE-4DA0-A845-DB28AEAEA56D\" targetRef=\"_CCE61B82-9DB8-493F-8FD8-64B9D29E67DC\">\r\n      <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp874_YLEeOD6pi7bYx2RA\">${countersign&lt;0}</conditionExpression>\r\n    </sequenceFlow>\r\n    <sequenceFlow id=\"_07BAE238-5EDE-42D8-B5BE-4A93AE6E546E\" name=\"从循环审批发起会签\" sourceRef=\"_4ED0E55A-62A2-47EA-8D74-9C5928049E7C\" targetRef=\"_9A7EF099-1CCD-4DFE-ABB8-95B46EC35084\">\r\n      <conditionExpression xsi:type=\"tFormalExpression\" id=\"_sp875PYLEeOD6pi7bYx2RA\">${countersign==1}</conditionExpression>\r\n    </sequenceFlow>\r\n  </process>\r\n  <bpmndi:BPMNDiagram id=\"_sp875fYLEeOD6pi7bYx2RA\">\r\n    <bpmndi:BPMNPlane id=\"_sp875vYLEeOD6pi7bYx2RA\" bpmnElement=\"freeStyleProcess\">\r\n      <bpmndi:BPMNShape id=\"_sp875_YLEeOD6pi7bYx2RA\" bpmnElement=\"_D9186EBF-9502-4510-BAAE-C660AB029D43\">\r\n        <dc:Bounds height=\"34.0\" width=\"34.0\" x=\"248.0\" y=\"7.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNEdge id=\"_sp876PYLEeOD6pi7bYx2RA\" bpmnElement=\"_6C3DFDFC-ED1D-4DB3-ACFE-462DFD84F5AF\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"24.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"132.0\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNShape id=\"_sp876fYLEeOD6pi7bYx2RA\" bpmnElement=\"_058003C5-A5BE-4DA0-A845-DB28AEAEA56D\">\r\n        <dc:Bounds height=\"54.0\" width=\"110.0\" x=\"210.0\" y=\"105.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNShape id=\"_sp876vYLEeOD6pi7bYx2RA\" bpmnElement=\"_9A7EF099-1CCD-4DFE-ABB8-95B46EC35084\">\r\n        <dc:Bounds height=\"173.0\" width=\"347.0\" x=\"465.0\" y=\"195.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNShape id=\"_sp876_YLEeOD6pi7bYx2RA\" bpmnElement=\"_E9CEC789-040B-45D8-B676-8C27110192AF\">\r\n        <dc:Bounds height=\"34.0\" width=\"34.0\" x=\"22.0\" y=\"29.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNShape id=\"_sp877PYLEeOD6pi7bYx2RA\" bpmnElement=\"_F4898AE9-B2B4-4768-99FD-FBADC40D3147\">\r\n        <dc:Bounds height=\"54.0\" width=\"110.0\" x=\"90.0\" y=\"15.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNShape id=\"_sp877fYLEeOD6pi7bYx2RA\" bpmnElement=\"_F41CCDB6-AE12-4440-9A57-F2BB3A7AF8B7\">\r\n        <dc:Bounds height=\"33.0\" width=\"33.0\" x=\"285.0\" y=\"25.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNEdge id=\"_sp877vYLEeOD6pi7bYx2RA\" bpmnElement=\"_AC6010D4-DFAD-4247-8F5D-04D0876BEBD8\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"39.0\" y=\"46.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"145.0\" y=\"42.0\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNEdge id=\"_sp877_YLEeOD6pi7bYx2RA\" bpmnElement=\"_051DAC80-B339-4C75-8163-723A79F3F70F\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"145.0\" y=\"42.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"301.5\" y=\"41.5\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNEdge id=\"_sp9i8PYLEeOD6pi7bYx2RA\" bpmnElement=\"_B6E47E9C-D282-44D3-98AF-E6FF90868011\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"145.0\" y=\"42.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"610.0\" y=\"333.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"674.0\" y=\"333.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"674.0\" y=\"301.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"145.0\" y=\"42.0\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNShape id=\"_sp9i8fYLEeOD6pi7bYx2RA\" bpmnElement=\"_4ED0E55A-62A2-47EA-8D74-9C5928049E7C\">\r\n        <dc:Bounds height=\"54.0\" width=\"110.0\" x=\"210.0\" y=\"240.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNEdge id=\"_sp9i8vYLEeOD6pi7bYx2RA\" bpmnElement=\"_9C64A4AD-278C-4032-BD3C-6A26EBB92CEB\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"132.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"267.0\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNShape id=\"_sqDpkPYLEeOD6pi7bYx2RA\" bpmnElement=\"_CCE61B82-9DB8-493F-8FD8-64B9D29E67DC\">\r\n        <dc:Bounds height=\"33.0\" width=\"33.0\" x=\"248.0\" y=\"443.0\"/>\r\n      </bpmndi:BPMNShape>\r\n      <bpmndi:BPMNEdge id=\"_sqDpkfYLEeOD6pi7bYx2RA\" bpmnElement=\"_C09E22AB-52ED-49B9-82AB-C7F0AFA39A8E\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"267.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"264.5\" y=\"459.5\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNEdge id=\"_sqDpkvYLEeOD6pi7bYx2RA\" bpmnElement=\"_48B86B37-C0E4-4B40-B135-BAE7F2BDBDAA\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"267.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"142.0\" y=\"329.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"142.0\" y=\"284.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"267.0\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNEdge id=\"_sqDpk_YLEeOD6pi7bYx2RA\" bpmnElement=\"_8500C14A-98C8-4BC9-8DE0-6779925BC605\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"132.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"638.0\" y=\"132.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"638.5\" y=\"281.5\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNEdge id=\"_sqDplPYLEeOD6pi7bYx2RA\" bpmnElement=\"_5F93014E-207E-4DF5-BEAF-6B6E612F18ED\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"132.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"66.0\" y=\"272.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"66.0\" y=\"387.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"264.5\" y=\"459.5\"/>\r\n      </bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNEdge id=\"_sqDplfYLEeOD6pi7bYx2RA\" bpmnElement=\"_07BAE238-5EDE-42D8-B5BE-4A93AE6E546E\">\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"265.0\" y=\"267.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"345.0\" y=\"443.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"524.0\" y=\"443.0\"/>\r\n        <di:waypoint xsi:type=\"dc:Point\" x=\"638.5\" y=\"281.5\"/>\r\n      </bpmndi:BPMNEdge>\r\n    </bpmndi:BPMNPlane>\r\n  </bpmndi:BPMNDiagram>\r\n</definitions>\r\n',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2014-05-13 11:23:56',0,NULL,NULL);
insert  into `wf_proc_catagory`(`PROC_CATAGORY_ID`,`PARENT_ID`,`CATAGORY_NAME`,`CATAGORY_DESC`,`APP_CODE`) values ('5339650f-a793-4cd2-83a9-b742bde517c2',NULL,'自由流程分类',NULL,NULL);
insert  into `wf_proc`(`PROC_ID`,`PROC_CATAGORY_ID`,`created_time`,`icon`,`bg_color`,`PROC_NAME`,`entity_name`,`proc_title_def`,`proc_def_id`,`PROC_DEF_KEY`,`APP_CODE`,`is_last`,`url`,`remarks`,`proc_stati_parentid`,`proc_stati_id`,`standard_consuming`) values ('2ed0b476-ebcd-4b02-a3ef-df7717ea4b9f','5339650f-a793-4cd2-83a9-b742bde517c2','2014-05-13 11:24:27','icon-heart','yellow','自由流流程','test',NULL,'20140513_00001','freeStyleProcess',NULL,'','~/entities/test/form?view=workflow',NULL,'a9258672-cd62-4081-8ab7-8cb773931ba2','4fe530af-86a7-4cca-8892-263347077941',55);


/*Table structure for table `new_test` */

CREATE TABLE `new_test` (
  `id` varchar(36) NOT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `modified_by` varchar(36) DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `_wen_ben` varchar(500) DEFAULT NULL,
  `_ri_qi` date DEFAULT NULL,
  `_fu_wen_ben` longtext,
  `_dai_ma` varchar(8000) DEFAULT NULL,
  `_duo_xing_wen_ben` varchar(2000) DEFAULT NULL,
  `_wen_jian_shang_chuan` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `_you_jian` varchar(255) DEFAULT NULL,
  `_tu_pian` varchar(255) DEFAULT NULL,
  `_shi_jian_chuo` datetime DEFAULT NULL,
  `_shi_fu` bit(1) DEFAULT NULL,
  `_bai_fen_bi` decimal(19,4) DEFAULT NULL,
  `_duo_xuan_xiang` varchar(255) DEFAULT 'blue',
  `_fu_dian_shu` double DEFAULT NULL,
  `_huo_bi` decimal(19,4) DEFAULT NULL,
  `_ri_qi_shi_jian` datetime DEFAULT NULL,
  `_zheng_shu` int(11) DEFAULT NULL,
  `_dan_xuan_xiang` varchar(255) DEFAULT 'M',
  `_shu_zi` decimal(19,4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `new_test` */

INSERT  INTO `metaui_template`(`id`,`name`,`entity_name`,`display_name`,`type`,`creator`,`creation_time`,`last_modified_by`,`last_modified`,`config_data`,`converter`,`template`,`priority_by`,`version`,`status`,`layout_type`,`url`,`real_path`,`description`,`data_source_type`,`sql`,`in_control`) VALUES ('00bda016-d9df-47a5-ad30-5dfdfa34adce','workflow','test','workflow','main','系统管理员','2014-05-20 10:37:00','系统管理员','2014-05-20 10:37:00','<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<form xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n    <hiddenFields>\n        <hiddenField>id</hiddenField>\n    </hiddenFields>\n    <sections>\n        <section colNum=\"2\" name=\"test\">\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"name\" id=\"050ebb3b-066d-4038-b377-59a5a0f2eaaf\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"WenBen\" id=\"a52024ac-def6-4750-8407-4b3639ffe142\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"RiQi\" id=\"7b10b85f-08a2-4c99-93a7-1bfbbc1898e3\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"String\">\n                    <attrs/>\n                    <content xsi:type=\"xs:string\"> </content>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"2\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"FuWenBen\" id=\"1380900f-8a6e-4d20-9138-af3526850935\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"DaiMa\" id=\"22029a4a-9402-4ef5-a134-54c6fab84f8d\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"DuoXingWenBen\" id=\"226b4bf2-b7d1-4d41-9c86-50c38c8a3031\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"WenJianShangChuan\" id=\"68763171-134e-49fb-a858-ea26d0c2bd9f\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"url\" id=\"69388ece-e0fa-42a7-a2df-98c93f7ccc72\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"YouJian\" id=\"9d68bd83-2e01-4ef9-bbb1-145c0473e571\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"TuPian\" id=\"5d0d0804-972f-4928-bb8d-a057324b22b5\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"ShiJianChuo\" id=\"8f125e11-fc1e-4804-9998-2ba4e59a686f\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"ShiFu\" id=\"d527e368-4d80-4584-a3ee-67b04c5ba435\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"BaiFenBi\" id=\"8a883a6c-84c5-4be3-b4fc-0207534b719e\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"DuoXuanXiang\" id=\"eb3e9710-6f7c-4312-bace-d85304551d06\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"FuDianShu\" id=\"ecd9f94a-d387-4b61-ae01-10a11bf60947\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"HuoBi\" id=\"06d6ffdb-ffe3-4221-829c-40b95c3eac5d\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"RiQiShiJian\" id=\"ba83d161-b02c-481b-bf84-60bcf018ad48\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"ZhengShu\" id=\"40d891ab-e14c-4177-b80e-a378f84710d8\"/>\n                </cell>\n            </rows>\n            <rows capacity=\"2\">\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"DanXuanXiang\" id=\"d44a0d15-6fde-4522-a3a7-3842f2008c6d\"/>\n                </cell>\n                <cell colspan=\"1\" contentType=\"Control\">\n                    <attrs/>\n                    <content xsi:type=\"control\" dataFieldName=\"ShuZi\" id=\"ff6ec58d-a89f-45d9-8a43-366058c31543\"/>\n                </cell>\n            </rows>\n        </section>\n    </sections>\n</form>','form_template_workflow','<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<div th:id=\"${viewId}\">\n  <form class=\"form-horizontal ajaxpost\" data-widget=\"validator\"\n    id=\"entityForm\" method=\"post\" th:action=\"${requestUrl}\" th:object=\"${entity}\">\n    <div class=\"portlet box tea-green\">\n      <div class=\"portlet-title\">\n        <div class=\"caption\">\n          <i class=\"icon-reorder\"/>\n          <span>test</span>\n        </div>\n        <div class=\"tools\">\n          <a class=\"collapse\" href=\"javascript:;\"/>\n          <!-- <a href=\"javascript:;\" class=\"reload\"></a> -->\n        </div>\n      </div>\n      <div class=\"portlet-body form-bordered\">\n        <table class=\"form-table col4-fluid\">\n          <tr>\n            <th>\n              <label>名称：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"name\"/>\n            </td>\n            <th>\n              <label>文本：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"WenBen\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>日期：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"RiQi\"/>\n            </td>\n            <th>\n              <label/>\n            </th>\n            <td colspan=\"1\">\n              <span/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>富文本：</label>\n            </th>\n            <td colspan=\"3\">\n              <input meta:field=\"FuWenBen\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>代码：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"DaiMa\"/>\n            </td>\n            <th>\n              <label>多行文本：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"DuoXingWenBen\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>文件上传：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"WenJianShangChuan\"/>\n            </td>\n            <th>\n              <label>url：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"url\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>邮件：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"YouJian\"/>\n            </td>\n            <th>\n              <label>图片：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"TuPian\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>时间戳：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"ShiJianChuo\"/>\n            </td>\n            <th>\n              <label>是否：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"ShiFu\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>百分比：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"BaiFenBi\"/>\n            </td>\n            <th>\n              <label>多选项：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"DuoXuanXiang\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>浮点数：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"FuDianShu\"/>\n            </td>\n            <th>\n              <label>货币：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"HuoBi\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>日期时间：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"RiQiShiJian\"/>\n            </td>\n            <th>\n              <label>整数：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"ZhengShu\"/>\n            </td>\n          </tr>\n          <tr>\n            <th>\n              <label>单选项：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"DanXuanXiang\"/>\n            </td>\n            <th>\n              <label>数字：</label>\n            </th>\n            <td colspan=\"1\">\n              <input meta:field=\"ShuZi\"/>\n            </td>\n          </tr>\n        </table>\n      </div>\n    </div>\n  </form>\n  <script th:inline=\"javascript\" type=\"text/javascript\">\n	//<![CDATA[ \n		$(function(){\n			var viewId=/*[[${viewId}]]*/;\n			var container=$(\'#\' + viewId);\n			Page.init(container);\n		});\n	//]]></script>\n</div>',NULL,1,10,'form',NULL,'test/workflow',NULL,NULL,NULL,'');

ALTER TABLE wf_proc ADD COLUMN first_step_actors VARCHAR(2000) NULL;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
