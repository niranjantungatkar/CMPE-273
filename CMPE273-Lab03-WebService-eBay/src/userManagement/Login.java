package userManagement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dbManagement.ConnectionMgmt;

public class Login {

	public boolean validLogin(String username, String password)
	{
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			String query = "SELECT count(1) count from user_detail WHERE username = ? and password = ?";
			stmt = conn.prepareStatement(query);
			stmt.setString(1, username);
			stmt.setString(2, password);
			rs = stmt.executeQuery();
			int count = 0;
			while (rs.next()) 
			{
				count = Integer.parseInt(rs.getString("count"));	
			}
			
			if(count <= 0)
				return false;
			else
				return true;
				
		} catch (SQLException e) {
			
			e.printStackTrace();
			return false;
		}
	}
	
	public void updateLastLogin(String username, String time)
	{
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			String query = "update user_detail set last_login = ? where username = ?";
			stmt = conn.prepareStatement(query);
			stmt.setString(1, time);
			stmt.setString(2, username);
			stmt.execute();
				
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
	
}
