CREATE VIEW v_wf_user_role AS
SELECT DISTINCT wur.role_id, rol.NAME AS role_name, wur.org_id, org.NAME AS org_name
FROM         wf_user_role AS wur INNER JOIN
                      sec_organization AS org ON wur.org_id = org.ID INNER JOIN
                      sec_role AS rol ON wur.role_id = rol.ID

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
                                                         WHERE      (org_id = SUBSTRING(wa.value_, 6, CHARINDEX('.', wa.value_) - 6)) AND (role_id = SUBSTRING(wa.value_, CHARINDEX('.', wa.value_) + 1, 
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
                                                                                     WHERE      (ORG_ID = SUBSTRING(wa.value_, 6, CHARINDEX('.', wa.value_) - 6)) AND (DUTY_ID = SUBSTRING(wa.value_, CHARINDEX('.', 
                                                                                                            wa.value_) + 1, 100))))))
                            UNION
                            SELECT     wa.value_
                            FROM         wf_task AS wt INNER JOIN
                                                  wf_actor AS wa ON wt.id_ = wa.task_id
                            WHERE     (wt.status_ IN (0, 1)) AND (wa.type_ = 'post') AND (NOT EXISTS
                                                      (SELECT     USER_ID
                                                        FROM          uam_user_post AS wup
                                                        WHERE      (POST_ID = SUBSTRING(wa.value_, 6, 100))))))