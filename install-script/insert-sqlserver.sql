alter table [portal_menu]  NOCHECK constraint all;
BEGIN TRANSACTION;
INSERT INTO [dbo].[portal_menu]([menu_id], [name], [url], [submenu_source], [submenu_source_type], [icon], [display_order], [show_type], [menu_source], [menu_source_id], [level], [modified_by], [modified_time], [parent_id], [code], [css_style], [status], [description])
SELECT N'028a2fec-41c9-4c94-9ed6-8ae2422f9dd7', N'已办事项', N'~/entities/wftask/list?view=done', NULL, N'normal', N'led-icons/emoticon_tongue.png', 4, N'tab', NULL, NULL, 1, N'管理员', '20131128 10:44:44.983', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'04b19d33-15f4-4d19-b5ad-39c34895d948', N'待阅事项', N'~/entities/wfnotify/list', NULL, N'normal', N'led-icons/camera.png', 2, N'tab', NULL, NULL, 1, N'管理员', '20131128 10:44:30.987', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'0f4f3726-1d48-4e35-9694-553a7f258baa', N'组织用户', N'~/entities/user/treeList/uamorganization?view=tree_list&refField=orgId', NULL, N'normal', N'mini/icon_tool_112.gif', 0, N'tab', NULL, NULL, 2, N'管理员', '20131128 11:25:05.327', N'f2f1572b-fcde-422c-b686-d5cc2b6cb384', NULL, NULL, 1, NULL UNION ALL
SELECT N'1327096c-b095-4491-8d90-285405748f02', N'系统工具', NULL, NULL, N'normal', N'led-icons/hammer_screwdriver.png', 9999, N'tab', NULL, NULL, 1, N'系统管理员', '20131128 10:40:27.157', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'140578ed-773b-4bb3-abc5-93ce3d300e09', N'流程提醒日志', N'~/entities/VWfDeadTask/list', NULL, N'normal', N'led-icons/wall_brick.png', 7, NULL, NULL, NULL, 2, N'系统管理员', '20140307 12:24:50.523', N'abc40c6f-c32c-4439-8e02-79d5b6fec35c', NULL, NULL, 1, NULL UNION ALL
SELECT N'148c6661-f7b7-4395-a5d7-748db608b6c4', N'系统管理', NULL, NULL, N'normal', N'led-icons/cog.png', 30, NULL, NULL, NULL, 0, N'系统管理员', '20140113 19:27:02.337', NULL, NULL, NULL, 1, NULL UNION ALL
SELECT N'15823fd2-499b-462f-ab20-df1a0999b803', N'组织结构', N'~/entities/uamorganization/treeList/uamOrganization?view=tree_list&refField=parentId', NULL, N'normal', N'mini/icon_tool_030.gif', 1, NULL, N'view', N'$UamOrganization:view:treeList_UamOrganization', 2, N'系统管理员', '20131128 11:24:16.097', N'f2f1572b-fcde-422c-b686-d5cc2b6cb384', NULL, NULL, 1, NULL UNION ALL
SELECT N'1cb6bdbd-cbd2-48b5-830f-edf3fb2df316', N'委托我的待办', N'~/entities/wftask/list?view=proxy', NULL, N'normal', N'led-icons/dashboard.png', 10, N'tab', N'view', N'$WfTask:view:proxy', 1, N'系统管理员', '20140105 20:50:31.100', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'40a124aa-3481-4651-affd-70bcfef311b9', N'流程效率分析', N'workflow/statistics/procEffectiveList', NULL, N'normal', N'led-icons/chart_curve.png', 20, N'tab', NULL, NULL, 0, N'系统管理员', '20140113 10:30:53.617', NULL, NULL, NULL, 1, NULL UNION ALL
SELECT N'41fd436f-f72c-4ee4-9292-d7be6326bc36', N'流程统计分类', N'~/entities/wfprocstatistics/list?view=list', NULL, N'normal', N'led-icons/chart_organisation.png', 0, NULL, N'view', N'$WfProcStatistics:view:list', 1, N'系统管理员', '20140331 14:30:52.297', N'40a124aa-3481-4651-affd-70bcfef311b9', NULL, NULL, 1, NULL UNION ALL
SELECT N'55065e6e-90e6-483a-b149-0c9466f2d79c', N'已阅事项', N'~/entities/wfnotify/list?view=read', NULL, N'normal', N'led-icons/emoticon_wink.png', 5, N'tab', NULL, NULL, 1, N'管理员', '20131128 10:44:52.557', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'5627d746-23f8-4be9-b86b-6041ca320666', N'流程用户角色', N'~/entities/wfuserrole/treeList/uamorganization?view=tree_list&refField=orgId', NULL, N'normal', N'led-icons/user.png', 19, NULL, NULL, NULL, 2, N'系统管理员', '20140417 18:08:21.347', N'abc40c6f-c32c-4439-8e02-79d5b6fec35c', NULL, NULL, 1, NULL UNION ALL
SELECT N'58ea3e0d-bede-4373-b0bb-2b104ceb8b37', N'待办事项', N'~/entities/wftask/list', NULL, N'normal', N'led-icons/clock.png', 1, N'tab', NULL, NULL, 1, N'管理员', '20131128 10:44:22.333', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'5a1911f2-b1c2-4df8-9426-2b431048055c', N'流程实例信息', N'~/entities/wfprocinst/list?view=all', NULL, N'normal', N'led-icons/application_view_columns.png', 3, N'tab', NULL, NULL, 2, N'系统管理员', '20140307 12:24:27.977', N'abc40c6f-c32c-4439-8e02-79d5b6fec35c', NULL, NULL, 1, NULL UNION ALL
SELECT N'64cbdecf-9d4e-4bae-932c-fc97c60f3209', N'我发起的流程', N'~/entities/wfprocinst/list', NULL, N'normal', N'led-icons/compass.png', 9, N'tab', NULL, NULL, 1, N'管理员', '20140104 21:45:52.423', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'66b74a0a-8930-43d2-bcce-3163ce22e769', N'职务管理', N'~/entities/uamduty/list?view=list', NULL, N'normal', N'led-icons/user_business_boss.png', 4, NULL, N'view', N'$UamDuty:view:list', 2, N'系统管理员', '20131128 12:25:16.197', N'f2f1572b-fcde-422c-b686-d5cc2b6cb384', NULL, NULL, 1, NULL UNION ALL
SELECT N'6940fba4-8f11-4da0-81af-1820636036f7', N'用户管理', N'~/entities/user/list', NULL, N'normal', N'led-icons/user.png', 201, N'tab', NULL, NULL, 1, N'系统管理员', '20131128 10:40:02.247', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'6c9b668a-2499-4680-b829-5199e374478f', N'默认项', NULL, NULL, N'normal', N'led-icons/lightbulb.png', 30, N'tab', NULL, NULL, 1, N'系统管理员', '20131128 10:39:16.030', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'6cc584ee-1a76-4898-9dd0-d73ac65a6cb2', N'系统模块管理', NULL, NULL, N'normal', N'led-icons/application_side_boxes.png', 5, NULL, NULL, NULL, 1, N'系统管理员', '20140307 12:24:05.697', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'88e01979-43be-4ac0-825c-7a849f9dbf44', N'安全管理', N'~/portal/menu/permission', NULL, N'normal', N'mini/icon_tool_215.gif', 3, N'tab', NULL, NULL, 1, N'系统管理员', '20140226 16:13:46.637', N'6cc584ee-1a76-4898-9dd0-d73ac65a6cb2', NULL, NULL, 1, NULL UNION ALL
SELECT N'8b5e870a-28b0-4249-93ab-99f7b4ca9646', N'工作流程信息', N'~/entities/wfproc/treeList/wfproccatagory/?view=tree_list&refField=procCatagoryId&treeLabelField=catagoryName', NULL, N'normal', N'led-icons/arrow_divide.png', 1, N'tab', NULL, NULL, 2, N'系统管理员', '20140404 15:46:36.143', N'abc40c6f-c32c-4439-8e02-79d5b6fec35c', NULL, NULL, 1, NULL UNION ALL
SELECT N'936d92a8-6670-4b30-8700-888ec08d360d', N'委托授权', N'~/entities/wfproxy/list?view=list', NULL, N'normal', N'led-icons/control_wheel.png', 11, N'tab', N'view', N'$WfProxy:view:list', 1, N'系统管理员', '20140105 20:50:42.457', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'9897c01b-7a4e-4656-9e45-3b986702e08e', N'草稿事项', N'~/entities/wfdraft/list', NULL, N'normal', N'led-icons/page_white_stack.png', 3, N'tab', NULL, NULL, 1, N'管理员', '20131128 10:44:38.087', N'cb262d0f-c376-4295-b1be-145296fb3856', NULL, NULL, 1, NULL UNION ALL
SELECT N'abc40c6f-c32c-4439-8e02-79d5b6fec35c', N'工作流程管理', NULL, NULL, N'normal', N'led-icons/books.png', 2, N'tab', NULL, NULL, 1, N'系统管理员', '20140307 12:23:53.493', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'acab678b-8965-42a2-adec-8975a17602bd', N'岗位管理', N'~/entities/uampost/treeList/uamOrganization?view=tree_list&refField=orgId', NULL, N'normal', N'led-icons/vcard.png', 5, NULL, N'view', N'$UamPost:view:treeList_uamOrganization', 2, N'系统管理员', '20131128 12:25:39.150', N'f2f1572b-fcde-422c-b686-d5cc2b6cb384', NULL, NULL, 1, NULL UNION ALL
SELECT N'b6d2fb2b-5d9e-4e9f-aedd-246f4a1b9da0', N'角色管理', N'~/entities/role/list', NULL, N'normal', N'led-icons/group.png', 5, N'tab', NULL, NULL, 1, N'系统管理员', '20140226 16:14:08.483', N'6cc584ee-1a76-4898-9dd0-d73ac65a6cb2', NULL, NULL, 1, NULL UNION ALL
SELECT N'cb262d0f-c376-4295-b1be-145296fb3856', N'工作台', N'~/workspace', NULL, N'normal', N'mini/home.gif', 0, NULL, NULL, NULL, 0, N'系统管理员', '20131110 16:24:46.710', NULL, NULL, NULL, 1, NULL UNION ALL
SELECT N'defaultfieldsmanage', N'默认字段', N'~/metadata/field?entity=DefaultFields', NULL, N'normal', N'led-icons/application_form.png', 4, N'cur-tab', NULL, NULL, 2, NULL, NULL, N'6c9b668a-2499-4680-b829-5199e374478f', NULL, NULL, 1, NULL UNION ALL
SELECT N'defaultoperationmanage', N'默认操作', N'~/metadata/uioperation?entityName=MetauiOperation', NULL, N'normal', N'led-icons/mouse.png', 5, N'cur-tab', NULL, NULL, 2, NULL, NULL, N'6c9b668a-2499-4680-b829-5199e374478f', NULL, NULL, 1, NULL UNION ALL
SELECT N'f2f1572b-fcde-422c-b686-d5cc2b6cb384', N'组织架构管理', NULL, NULL, N'normal', N'led-icons/chart_organisation.png', 1, NULL, NULL, NULL, 1, N'系统管理员', '20131222 14:19:27.253', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'fb5c9aa1-8a15-4dfe-b83c-9e37c7a483eb', N'Web资源', NULL, NULL, N'normal', N'led-icons/world.png', 8, N'cur-tab', NULL, NULL, 1, N'系统管理员', '20131128 10:38:44.873', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'fc6b1b86-02aa-40a1-8ee9-040248fc2778', N'流程效率分析', N'workflow/statistics/procEffectiveList', NULL, N'normal', N'led-icons/counter.png', 5, N'tab', NULL, NULL, 2, N'系统管理员', '20140307 12:24:38.790', N'abc40c6f-c32c-4439-8e02-79d5b6fec35c', NULL, NULL, 1, NULL UNION ALL
SELECT N'import-physical-tables', N'导入物理表', N'~/metadata/tool/import_existed_tables', NULL, N'normal', N'led-icons/car.png', 110, NULL, NULL, NULL, 2, N'系统管理员', '20131128 10:41:29.100', N'1327096c-b095-4491-8d90-285405748f02', NULL, NULL, 1, NULL UNION ALL
SELECT N'menumetadata', N'实体管理', N'~/metadata/entity', N'~/treemodels/entity_tree', N'dynamic', N'led-icons/databases.png', 99, N'tab', NULL, NULL, 0, N'管理员', '20131110 16:27:59.680', NULL, NULL, NULL, 1, NULL UNION ALL
SELECT N'metadata-base-tools', N'元数据相关', N'~/metadata/tool/', NULL, N'normal', N'led-icons/hammer.png', 110, N'tab', NULL, NULL, 2, N'系统管理员', '20131128 10:41:38.020', N'1327096c-b095-4491-8d90-285405748f02', NULL, NULL, 1, NULL UNION ALL
SELECT N'navmanage', N'导航管理', N'~/entities/portalmenu/', NULL, N'normal', N'led-icons/direction.png', 1, N'cur-tab', NULL, NULL, 1, N'系统管理员', '20140226 16:13:20.247', N'6cc584ee-1a76-4898-9dd0-d73ac65a6cb2', NULL, NULL, 1, NULL UNION ALL
SELECT N'optionsetmanage', N'选项集', N'~/metadata/optionset/', NULL, N'normal', N'led-icons/ui_combo_box.png', 6, N'cur-tab', NULL, NULL, 1, N'系统管理员', '20131128 10:38:26.650', N'148c6661-f7b7-4395-a5d7-748db608b6c4', NULL, NULL, 1, NULL UNION ALL
SELECT N'reimportNewFields', N'导入新列', N'~/metadata/tool/reimportNewFields', NULL, N'normal', N'led-icons/car.png', 110, NULL, NULL, NULL, 2, N'系统管理员', '20131128 10:41:46.487', N'1327096c-b095-4491-8d90-285405748f02', NULL, NULL, 1, NULL UNION ALL
SELECT N'scriptlibmanage', N'脚本库', N'~/scriptlib/', NULL, N'normal', N'led-icons/page_code.png', 7, N'cur-tab', NULL, NULL, 2, NULL, NULL, N'fb5c9aa1-8a15-4dfe-b83c-9e37c7a483eb', NULL, NULL, 1, NULL
COMMIT;
GO
alter table [portal_menu]  CHECK constraint all;
-- 操作数据初始化
BEGIN TRANSACTION;
INSERT INTO [dbo].[metaui_operation]([id], [name], [display_name], [entity_name], [scope], [record_Type], [icon], [icon_Small], [icon_Large], [tool_tip], [script_lib], [script], [main_func], [is_default], [display_order], [creator], [created_time], [modified_by], [modified_time], [in_control], [enabled])
SELECT N'0ade8ee0-45c1-43fb-8873-d1daa9971b43', N'delVersions', N'删除所有版本', N'MetauiTemplate', N'listtoolbar,listcontext,formtoolbar', N'single', N'mini/icon_tool_024.gif', NULL, NULL, N'删除所有版本', N'system/metauiTemplate.js', NULL, N'system/metauiTemplate.delVersions', 0, 0, N'系统管理员', '20130730 15:45:31.000', N'系统管理员', '20130730 15:45:31.000', 1, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d11', N'link', N'选择', N'MetauiOperation', N'listtoolbar', N'multi', N'main/search-add.png', NULL, NULL, N'选择', NULL, NULL, N'grid.addRelation', 1, 2, N'system', '20121225 00:00:00.000', N'system', '20130401 13:39:59.000', 1, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d15', N'create', N'新建', N'MetauiOperation', N'listtoolbar,formtoolbar', N'single', N'main/button-add.png', NULL, NULL, N'新建', NULL, NULL, N'grid.addRecord', 1, 1, N'system', '20121225 00:00:00.000', N'system', '20121225 00:00:00.000', 1, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d16', N'edit', N'修改', N'MetauiOperation', N'listtoolbar,listcontext,formtoolbar', N'single', N'main/comment-edit.png', N'mini/icon_tool_022.gif', NULL, N'修改', NULL, NULL, N'grid.editRecord', 1, 3, N'system', '20121225 00:00:00.000', N'system', '20121225 00:00:00.000', 1, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d17', N'delete', N'删除', N'MetauiOperation', N'listtoolbar,listcontext,formtoolbar', N'multi', N'main/button-white-remove.png', N'mini/icon_tool_060.gif', NULL, N'删除', NULL, NULL, N'grid.delRecord', 1, 4, N'system', '20121225 00:00:00.000', N'system', '20121225 00:00:00.000', 1, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d18', N'fresh', N'刷新', N'MetauiOperation', N'listtoolbar', N'multi', N'main/button-load.png', NULL, NULL, N'刷新', NULL, NULL, N'grid.refreshGrid', 1, 5, N'system', '20121225 00:00:00.000', N'system', '20121225 00:00:00.000', 0, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d19', N'search', N'查询', N'MetauiOperation', N'listtoolbar', N'multi', N'main/search-add.png', NULL, NULL, N'查询', NULL, NULL, N'grid.advanceSearch', 1, 6, N'system', '20121225 00:00:00.000', N'system', '20130401 15:47:06.000', 0, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d20', N'export', N'导出', N'MetauiOperation', N'listtoolbar', N'multi', N'main/file-send.png', NULL, NULL, N'导出', NULL, NULL, N'grid.exportGrid', 1, 7, N'system', '20121225 00:00:00.000', N'system', '20121225 00:00:00.000', 1, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d21', N'import', N'导入', N'MetauiOperation', N'listtoolbar', N'multi', N'main/box-up.png', NULL, NULL, N'导入', NULL, NULL, N'grid.importData', 1, 8, N'system', '20121225 00:00:00.000', N'system', '20121225 00:00:00.000', 1, 1 UNION ALL
SELECT N'179a9c32-83b2-1135-8c6b-0550f7009d22', N'config', N'配置', N'MetauiOperation', N'listtoolbar', N'multi', N'main/cog.png', NULL, NULL, N'配置视图', NULL, NULL, N'grid.configGrid', 1, 9, N'system', '20121225 00:00:00.000', N'system', '20121225 00:00:00.000', 1, 1 UNION ALL
SELECT N'1999ed42-d497-4279-9b38-1d15b357dcd0', N'read', N'阅读', N'WfNotify', N'listtoolbar,listcontext', N'single', N'led-icons/application_view_gallery.png', NULL, NULL, N'阅读', N'system/workflow.js', NULL, N'system/workflow.itemRead', 0, 0, N'管理员', '20131023 13:46:20.000', N'管理员', '20131023 13:46:20.000', 1, 1 UNION ALL
SELECT N'26849e91-b235-491e-af8d-da3c3b50c31a', N'preview', N'预览', N'MetauiTemplate', N'listtoolbar,listcontext', N'single', N'main/pictures.png', NULL, NULL, N'预览视图', NULL, NULL, N'', 0, 0, N'系统管理员', '20130730 15:36:58.000', N'系统管理员', '20130730 15:41:15.000', 1, 1 UNION ALL
SELECT N'3191afc6-e3a7-4e1d-9621-25917c07c25d', N'publish', N'发布', N'MetauiTemplate', N'listtoolbar,listcontext,formtoolbar', N'single', N'mini/icon_tool_107.gif', NULL, NULL, N'发布视图', N'system/metauiTemplate.js', NULL, N'system/metauiTemplate.publish', 0, 0, N'系统管理员', '20130730 15:40:14.000', N'系统管理员', '20130730 15:41:29.000', 1, 1 UNION ALL
SELECT N'4cf5a503-5b06-40f6-a359-a42e668498d4', N'approve', N'审批', N'WfTask', N'listtoolbar,listcontext', N'single', N'led-icons/pencil.png', NULL, NULL, N'审批', N'system/workflow.js', NULL, N'system/workflow.itemApprove', 0, 0, N'系统管理员', '20131021 17:20:50.000', N'系统管理员', '20131021 17:23:54.000', 1, 1 UNION ALL
SELECT N'4da552a9-bb06-43fa-aa59-6848a9377262', N'versions', N'版本管理', N'MetauiTemplate', N'listtoolbar,listcontext,formtoolbar', N'single', N'mini/icon_tool_026.gif', NULL, NULL, NULL, N'system/metauiTemplate.js', NULL, N'system/metauiTemplate.listVersions', 0, 0, N'系统管理员', '20130730 15:44:15.000', N'系统管理员', '20130730 15:44:15.000', 1, 1 UNION ALL
SELECT N'6c0c6c07-df5a-4393-92e6-72700c4c272b', N'deploy', N'新部署', N'WfProcDef', N'listtoolbar,listcontext', N'single', N'main/folder-add.png', NULL, NULL, N'部署新流程', N'system/workflow.js', NULL, N'system/workflow.procDefDeploy', 0, 0, N'管理员', '20131024 13:45:26.537', N'管理员', '20131024 13:45:58.393', 1, 1 UNION ALL
SELECT N'6e904c40-5561-4bc1-8689-d364088f08cd', N'design', N'设计', N'WfProc', N'listtoolbar,listcontext', N'single', N'led-icons/page_white_vector.png', NULL, NULL, N'设计流程', N'system/workflow.js', NULL, N'system/workflow.design', 0, 0, N'系统管理员', '20140217 15:11:18.450', N'系统管理员', '20140217 15:11:18.460', 1, 1 UNION ALL
SELECT N'716db6cd-2ebb-451f-a63f-929e0f0943e7', N'sendDraft', N'发起', N'WfDraft', N'listtoolbar,listcontext', N'single', N'led-icons/pencil.png', NULL, NULL, NULL, N'system/workflow.js', NULL, N'system/workflow.startProcItemByDraft', 0, 0, N'管理员', '20131023 13:46:20.000', N'管理员', '20131023 13:46:20.000', 1, 1 UNION ALL
SELECT N'87d08065-08c3-44af-82a2-279231a3b175', N'start', N'发起', N'WfProc', N'listtoolbar,listcontext,formtoolbar', N'single', N'led-icons/text_signature.png', NULL, NULL, N'发起事项', N'system/workflow.js', NULL, N'system/workflow.startProcItem', 0, 0, N'管理员', '20131024 17:09:59.723', N'管理员', '20131024 17:09:59.730', 1, 1 UNION ALL
SELECT N'a99dbdcf-247e-4f92-8ae1-2ecb0cc842b3', N'rollback', N'撤回', N'WfTask', N'listtoolbar,listcontext', N'single', N'main/arrow-left.png', NULL, NULL, NULL, N'system/workflow.js', NULL, N'system/workflow.taskRollback', 0, 0, N'管理员', '20131207 14:46:37.787', N'管理员', '20131207 14:46:37.790', 1, 1 UNION ALL
SELECT N'af8884d0-2734-42da-8f12-95cd6435cb69', N'remind', N'催办', N'WfTask', N'listtoolbar,listcontext', N'single', N'led-icons/smiley_mad.png', NULL, NULL, NULL, N'system/workflow.js', NULL, N'system/workflow.remind', 0, 0, N'系统管理员', '20140107 21:22:48.123', N'系统管理员', '20140107 21:22:48.153', 1, 1 UNION ALL
SELECT N'b64cda5c-8f49-45fa-914c-8b6d4c291f79', N'forceEnd', N'作废流程', N'WfProcInst', N'listtoolbar', N'single', N'led-icons/cross.png', NULL, NULL, N'作废流程', N'system/workflow.js', NULL, N'system/workflow.forceEnd', 0, 0, N'系统管理员', '20140303 13:37:34.067', N'系统管理员', '20140303 14:22:02.503', 1, 1 UNION ALL
SELECT N'f102cdf0-9e62-4b59-9113-e76723d8fbd9', N'batchCreate', N'新建委托', N'WfProxy', N'listtoolbar,listcontext', N'multi', N'led-icons/add.png', NULL, NULL, N'批量创建委托', N'system/workflow.js', NULL, N'system/workflow.createProxyBatch', 0, 0, N'系统管理员', '20140103 10:27:03.133', N'系统管理员', '20140103 10:27:03.140', 1, 1 UNION ALL
-- 2014-4-17 快捷删除导航菜单操作，供开发维护人员使用
SELECT N'af6fd0dc-b037-40de-b4a6-deda5e6489a6', N'deleteChild', N'删除子菜单', N'PortalMenu', N'listtoolbar,listcontext', N'single', N'led-icons/cancel.png', NULL, NULL, N'删除子菜单', N'system/portalmenu.js', NULL, N'system/portalmenu.deleteChild', 0, 0, N'系统管理员', '20140417 18:02:34.050', N'系统管理员', '20140417 18:02:34.080', 1, 1
COMMIT;
GO

-- 系统用户角色
BEGIN TRANSACTION;
INSERT INTO uam_user (ID, Name, [Type], Login_Id, [Password], Email, IM, TELEPHONE, SEX, BIRTHDAY, [STATUS], [RANK]) VALUES('43FE6476-CD7B-493B-8044-C7E3149D0876','系统管理员',1,'admin','RrUz48yGLWgiUOOeOeUp6Q==','',NULL,NULL,1,NULL,1,NULL);-- 默认角色
insert into sec_role (ID, NAME, [DESCRIPTION], [TYPE], PARTICIPANT_TYPE, CREATED_BY, CREATED_DATE, LAST_UPDATED_BY, LAST_UPDATED_DATE) values('00000000-0000-0000-0000-000000000000','所有用户',NULL,'0',NULL,'43FE6476-CD7B-493B-8044-C7E3149D0876','2013-06-17 13:56:16','43FE6476-CD7B-493B-8044-C7E3149D0876','2013-06-17 13:56:16');
INSERT INTO [dbo].[sec_role]([ID], [NAME], [Condition_Expr], [DESCRIPTION], [TYPE], [PARTICIPANT_TYPE], [CREATED_BY], [CREATED_DATE], [LAST_UPDATED_BY], [LAST_UPDATED_DATE], [Code], [isDefault])
SELECT N'ae3945da-8125-4c89-9bee-12d478d2334b', N'部门接口人', NULL, NULL, 1, 0, N'3a8100d5-f2f1-4c99-bccf-392254e20eea', '20140320 14:02:29.010', N'3a8100d5-f2f1-4c99-bccf-392254e20eea', '20140320 14:02:29.047', NULL, 0
COMMIT;
GO
-- 权限规则
BEGIN TRANSACTION;
INSERT INTO [dbo].[sec_permission_rule]([ID], [OPERATION_ID], [NAME], [PRIORITY], [RULE], [BEHAVIOUR], [SCOPE_TYPE], [DESCRIPTION], [CREATED_BY], [CREATED_DATE], [LAST_UPDATED_BY], [LAST_UPDATED_DATE])
SELECT N'2A38CF47-FDD8-4CCE-8C94-B1D0FDFCB001', N'all', N'所有数据', 9999, N'1=1', NULL, 4, NULL, N'43FE6476-CD7B-493B-8044-C7E3149D0876', '20111125 16:53:30.000', N'43FE6476-CD7B-493B-8044-C7E3149D0876', '20111125 16:53:30.000' UNION ALL
SELECT N'6c4a02bb-37ac-4bba-b674-8f43cfc6e3e9', N'WfNotify', N'我的通知', 10, N'(@{tableAlias}.id in (
	select wa.notifyId from wfActor wa where wa.value in (@{env.UserActors})
	union
	select wn1 .id as notifyId from wfNotify wn1 where wn1.assigneeId=''@{env.User.id}''  
))', NULL, 2, NULL, N'管理员', '20131129 16:10:08.807', N'管理员', '20131129 16:10:08.807' UNION ALL
SELECT N'da965f63-8a55-4cbf-84a3-5a6a9fd46451', N'WfTask', N'我的任务', 10, N'(@{tableAlias}.id in (
	select wa.taskId from wfActor wa where wa.value in (@{env.UserActors}) and wa.notifyId is null
	union
	select wt1.id as taskId from wfTask wt1 where wt1.assigneeId=''@{env.User.id}''  
	union
	select wt2.id as taskId from wfTask wt2 where wt2.agentId = ''@{env.User.id}''
))', NULL, 2, NULL, N'管理员', '20131031 18:14:59.547', N'管理员', '20131031 18:14:59.547'
COMMIT;
GO
BEGIN TRANSACTION;
INSERT INTO [dbo].[sec_permission]([id], [parent], [code], [name], [url], [ELEMENT_ID], [ELEMENT_BEHAVIOUR], [ORDER], [DESCRIPTION], [ICON], [ICON_LARGE], [ICON_SMALL], [ICON_MIDDLE], [CREATED_BY], [CREATED_DATE], [LAST_UPDATED_BY], [LAST_UPDATED_DATE], [IS_REFERENCE], [REFERENCE])
SELECT N'0fa80743-7ed9-40c5-9e35-bb09274a0ff2', NULL, N'$WfTask:Entity:Select', N'查询任务', NULL, N'$WfTask:Entity:Select', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '20131031 18:02:07.697', NULL, '20131031 18:02:07.700', 0, NULL UNION ALL
SELECT N'89d774f0-8a9a-4905-9b49-c40616c2bc43', NULL, N'$WfNotify:Entity:Select', N'查询通知', NULL, N'$WfNotify:Entity:Select', NULL, 0, NULL, NULL, NULL, NULL, NULL, N'cf42c0d7-878b-4468-832f-b171638ef056', '20131129 16:07:29.677', N'cf42c0d7-878b-4468-832f-b171638ef056', '20131129 16:07:29.677', 0, NULL
COMMIT;
RAISERROR (N'[dbo].[sec_permission]: Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
BEGIN TRANSACTION;
INSERT INTO [dbo].[sec_role_permission]([ROLE_ID], [OPERATION_ID], [RULE_ID], [CREATED_BY], [CREATED_DATE], [LAST_UPDATED_BY], [LAST_UPDATED_DATE])
SELECT N'00000000-0000-0000-0000-000000000000', N'0fa80743-7ed9-40c5-9e35-bb09274a0ff2', N'da965f63-8a55-4cbf-84a3-5a6a9fd46451', N'系统管理员', '20140110 13:42:44.330', N'系统管理员', '20140110 13:42:44.330' UNION ALL
SELECT N'00000000-0000-0000-0000-000000000000', N'89d774f0-8a9a-4905-9b49-c40616c2bc43', N'6c4a02bb-37ac-4bba-b674-8f43cfc6e3e9', N'管理员', '20131129 16:10:35.607', N'管理员', '20131129 16:10:35.610'
COMMIT;
RAISERROR (N'[dbo].[sec_role_permission]: Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO