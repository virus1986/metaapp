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
import bingo.metabase.MbManager;


public class DropMetabase {

	public static void main(String[] args) throws Exception {
		MbUtils.setUpgrade();
		
		Mb mb = Mb.get();
		
		Connection connection = null;
		try{
			connection = mb.datasource().getConnection();
			
			Console.writeLine();
			Console.writeLine("***数据库地址***：" + connection.getMetaData().getURL());
			Console.writeLine();
			
			String confirm = Console.readLine("将会删除元数据库表，请确认上面的数据库地址？  Y | N ",true);
			
			if("Y".equalsIgnoreCase(confirm)){
				MbManager.get().drop();
			}
		}finally{
			JDBC.close(connection);
		}
    }
}
