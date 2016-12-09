package dbManagement;

import java.sql.DriverManager;
import java.sql.Connection;

public class ConnectionMgmt {
	
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost:3306/ebay";
	static final String USER = "root";
	static final String PASSWORD = "root";

	
	public static Connection connect(){
		Connection conn = null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
		    System.out.println("Connecting to Database");
		    conn = DriverManager.getConnection(DB_URL,USER,PASSWORD);	
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conn;		
	}

}
