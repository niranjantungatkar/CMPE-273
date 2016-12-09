package checkout;

import javax.jws.WebService;
import dbManagement.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@WebService
public class Checkout {
	
	public void updateQuantity(String product_id, int product_quantity)
	{
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			String query = "SELECT  product_quantity from product_detail WHERE product_id = ?";
			stmt = conn.prepareStatement(query);
			stmt.setString(1, product_id);
			rs = stmt.executeQuery();
			int count = 0;
			while (rs.next()) 
			{
				count = Integer.parseInt(rs.getString("product_quantity"));	
			}
			
			int new_quantity = count - product_quantity;
			
			String query2 = "update product_detail set product_quantity = ? where product_id = ?";
			stmt = conn.prepareStatement(query2);
			stmt.setInt(1, new_quantity);
			stmt.setString(2, product_id);
			stmt.execute();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
	
	
	public void recordTransaction(String username, String product_id, String product_price, String product_quantity, String time)
	{
		String transactionQuery = "INSERT INTO transaction_detail (trans_id, trans_type, username,product_id, trans_amount, product_quantity, trans_time) VALUES"+
				"(null, '1', ?, ?, ?, ?, ?)";
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			
			stmt = conn.prepareStatement(transactionQuery);
			stmt.setString(1, username);
			stmt.setString(2, product_id);
			stmt.setString(3, product_price);
			stmt.setString(4, product_quantity);
			stmt.setString(5, time);
			stmt.execute();

			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
	}
	

}
