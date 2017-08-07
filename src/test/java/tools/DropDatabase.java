/**
 * This file created at 2012-8-23.
 *
 * Copyright (c) 2002-2012 Bingosoft, Inc. All rights reserved.
 */
package tools;

import java.sql.Connection;
import java.sql.DriverManager;

import bingo.lang.Console;
import bingo.lang.jdbc.JDBC;
import bingo.metabase.database.Db;
import bingo.metabase.database.DbFactory;

public class DropDatabase {

	public static void main(String[] args) throws Exception {
	    
		String driverClass = Console.readLine("driver class [com.mysql.jdbc.Driver] :","com.mysql.jdbc.Driver");
		String url         = Console.readLine("url [jdbc:mysql://localhost:3306/{name}] :",true);
		String user        = Console.readLine("username:",true);
		String pass        = Console.readLine("password:",false);
		
		Class.forName(driverClass);
		
		Connection connection = null;
		
		try{
			connection = DriverManager.getConnection(url,user,pass);

			Db db = DbFactory.createInstance(connection);
			
			if("y".equalsIgnoreCase(Console.readLine("将会**删除**数据库的所有表结构和数据，请确认是否继续？ Y | N ", true))){
				db.dropSchema(connection,db.readSchema(connection));	
			}
			
		}finally{
			JDBC.close(connection);
		}
    }
	
}
