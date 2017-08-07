/**
 * This file created at 2012-8-23.
 *
 * Copyright (c) 2002-2012 Bingosoft, Inc. All rights reserved.
 */
package tools;

import java.sql.Connection;

import bingo.lang.Console;
import bingo.lang.jdbc.JDBC;
import bingo.metabase.Mb;

public class ImportDatabase {

	public static void main(String[] args) throws Exception {
		MbUtils.setUpgrade();
		
		final Mb mb = Mb.get();
		
		Connection connection = null;
		try{
			connection = mb.datasource().getConnection();
			
			Console.writeLine();
			Console.writeLine("***数据库地址***：" + connection.getMetaData().getURL());
			Console.writeLine();
			
			if("Y".equalsIgnoreCase(Console.readLine("是否导入整个数据库表为元数据模型？Y | N ",false))){
				mb.dmo().cmdImportTables().addAll(mb.db().readSchema().getTables()).execute();
			}
		}finally{
			JDBC.close(connection);
		}
    }
}
