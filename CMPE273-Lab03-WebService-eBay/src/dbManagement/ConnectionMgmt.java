package dbManagement;

import java.sql.DriverManager;
import java.util.Vector;
import java.sql.Connection;

public class ConnectionMgmt {
	
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost:3306/ebay";
	static final String USER = "root";
	static final String PASSWORD = "root";
	
	static Vector connPool = new Vector();
	
	public ConnectionMgmt()
	{
	   init();
	}

	
	private void init()
	{
		//Here we can initialize all the information that we need
		initConnPool();
	}

	private void initConnPool()
	{
		while(!checkIfConnectionPoolIsFull())
	    {
			connPool.addElement(createNewConnectionForPool());
	    }
	    System.out.println("Full");
	}
	
	
	private synchronized boolean checkIfConnectionPoolIsFull()
	{
		final int MAX_POOL_SIZE = 500;
	    if(connPool.size() < MAX_POOL_SIZE)
	    {
	    	return false;
	    }
	    return true;
	}

	private Connection createNewConnectionForPool()
	{
	  Connection conn = null;

	  try
	  {
		  Class.forName("com.mysql.jdbc.Driver");
		  conn = DriverManager.getConnection(DB_URL,USER,PASSWORD);
		  System.out.println("Connection: "+conn);
	  }
	  catch(Exception e)
	  {
		  System.err.println("SQLException: "+e);
		  return null;
	  }
	  return conn;
	}
	
	 public synchronized void returnConnectionToPool(Connection connection)
	 {
		 connPool.addElement(connection);
	 }
	
	public synchronized static Connection connect(){
		Connection conn = null;
		try {
			
			///Without connection pooling make a new connection everytime
			
			Class.forName("com.mysql.jdbc.Driver");
		    System.out.println("Connecting to Database");
		    conn = DriverManager.getConnection(DB_URL,USER,PASSWORD);	
			
			
			//With connection pooling get from the pool
			/*if(connPool.size() > 0)
			{
				connPool = (Vector) connPool.firstElement();
				connPool.removeElementAt(0);
			}*/
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conn;		
	}

}
