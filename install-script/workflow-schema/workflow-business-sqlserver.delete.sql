/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2005                    */
/* Created on:     2013/9/23 11:29:07                           */
/*==============================================================*/


if exists (select 1
            from  sysobjects
           where  id = object_id('wf_common_option')
            and   type = 'U')
   delete from wf_common_option
go

if exists (select 1
            from  sysobjects
           where  id = object_id('wf_draft')
            and   type = 'U')
   delete from wf_draft
go

if exists (select 1
            from  sysobjects
           where  id = object_id('wf_proxy')
            and   type = 'U')
   delete from wf_proxy
go

if exists (select 1
            from  sysobjects
           where  id = object_id('wf_url_mapping')
            and   type = 'U')
   delete from wf_url_mapping
go

if exists (select 1
            from  sysobjects
           where  id = object_id('wf_proc')
            and   type = 'U')
   delete from wf_proc
go

if exists (select 1
            from  sysobjects
           where  id = object_id('wf_proc_catagory')
            and   type = 'U')
   delete from wf_proc_catagory
go

