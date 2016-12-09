package userManagement;

import javax.jws.WebService;
import dbManagement.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;



@WebService
public class Register {
	
	public boolean chkUserExists(String username)
	{
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			String query = "SELECT count(1) count from user_detail WHERE username = ?";
			stmt = conn.prepareStatement(query);
			stmt.setString(1, username);
			rs = stmt.executeQuery();
			int count = 0;
			while (rs.next()) 
			{
				count = Integer.parseInt(rs.getString("count"));	
			}
			
			if(count > 0)
				return false;
			else
				return true;
				
		} catch (SQLException e) {
			
			e.printStackTrace();
			return false;
		}
	}
	
	public void addUser(String username, String password, String first_name, String last_name, String telephone) throws SQLException
	{
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		String query = "INSERT INTO user_detail (username, password, first_name, last_name,telephone) VALUES (?, ?, ?, ?, ?)";
		stmt = conn.prepareStatement(query);
		stmt.setString(1, username);
		stmt.setString(2, password);
		stmt.setString(3, first_name);
		stmt.setString(4, last_name);
		stmt.setString(5, telephone);
		
		stmt.execute();
				
	}
	

}
