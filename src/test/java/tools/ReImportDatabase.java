/**
 * This file created at 2012-8-23.
 *
 * Copyright (c) 2002-2012 Bingosoft, Inc. All rights reserved.
 */
package tools;

import java.sql.Connection;

import bingo.lang.Console;
import bingo.lang.Strings;
import bingo.lang.jdbc.JDBC;
import bingo.metabase.Mb;
import bingo.metabase.MbProtected;
import bingo.metabase.api.enums.Semantics;
import bingo.metabase.database.model.DbColumn;
import bingo.metabase.database.model.DbTable;
import bingo.metabase.dm.command.ImportTables;
import bingo.metabase.dm.value.MetaEntity;
import bingo.metabase.dm.value.MetaField;


public class ReImportDatabase {

	public static void main(String[] args) throws Exception {
		MbUtils.setUpgrade();
		
		final Mb mb = Mb.get();
		
		Connection connection = null;
		try{
			connection = mb.datasource().getConnection();
			
			Console.writeLine();
			Console.writeLine("***数据库地址***：" + connection.getMetaData().getURL());
			Console.writeLine();
			
			String confirm = Console.readLine("将会删除所有数据库中的元数据级表结构，请确认上面的数据库地址？  Y | N ",true);
			
			if("Y".equalsIgnoreCase(confirm)){
				MbProtected.execute(new MbProtected.Action() {
					public void run() {
						drop(mb.metastore());
					}
				});
				mb.create(true);
				mb.dmo().cmdImportTables().addAll(mb.db().readSchema().getTables()).setTranslator(new ImportTables.TableImportTranslator() {
					public void translate(DbTable table, MetaEntity entity) {
						String tbComment= table.getComment();
						if(Strings.isNotEmpty(tbComment)){
							entity.setDisplayName(tbComment);
						}
					}
					
					public void translate(DbColumn column, MetaField field) {
						if(column.isPrimaryKey()){
							field.setIsIdentity(true);
						}
						if(null != field.getIsIdentity() && field.getIsIdentity()){
							field.setIsDisplay(false);
						}
						
						if(Strings.contains(field.getName().toLowerCase(), "name") || Strings.contains(field.getName().toLowerCase(), "title")){
							field.setSemantics(Semantics.Title);
						}
					}
				}) .execute();
			}
		}finally{
			JDBC.close(connection);
		}
		
		System.out.print("===complete===");
		System.exit(1);
    }
}
