SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM wf_variable;

DELETE FROM wf_actor;

DELETE FROM wf_notify_reader;

DELETE FROM wf_notify;

DELETE FROM wf_task;

DELETE FROM wf_act_inst;

DELETE FROM wf_execution;

DELETE FROM wf_proc_inst;

DELETE FROM wf_param;
SET FOREIGN_KEY_CHECKS = 1;