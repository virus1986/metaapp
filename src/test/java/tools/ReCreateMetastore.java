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
import bingo.metabase.MbProtected;


public class ReCreateMetastore {

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
				mb.create();
				//MbRepoManager.get().create();
			}
		}finally{
			JDBC.close(connection);
		}
    }
}
