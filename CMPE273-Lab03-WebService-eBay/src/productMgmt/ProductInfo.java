package productMgmt;


import javax.jws.WebService;
import dbManagement.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


@WebService
public class ProductInfo {
	

	public void bidProducts(String username)
	{
		String query = "";
		if(username != "")
		{
			query = "SELECT product_id, product_name, product_adv, product_seller_info, product_price, product_base_bid, current_bid FROM ebay.product_detail "+
					"where  product_bid_flag = 'yes' and "+
					"product_sold_flag = 'no' and "+
					"product_adv != ?";
			Connection conn = ConnectionMgmt.connect();
			PreparedStatement stmt = null;
			ResultSet rs = null;
			try {
				stmt = conn.prepareStatement(query);
				stmt.setString(1, username);
				rs = stmt.executeQuery();
				int count = 0;
				while (rs.next()) 
				{
					count = Integer.parseInt(rs.getString("count"));	
				}			
					
			} catch (SQLException e) {
				e.printStackTrace();
			}
					
		}
		else
		{
			query = "SELECT product_id, product_name, product_adv, product_seller_info, product_price, product_base_bid, current_bid FROM ebay.product_detail "+
					"where  product_bid_flag = 'yes' and "+
					"product_sold_flag = 'no'";
			Connection conn = ConnectionMgmt.connect();
			PreparedStatement stmt = null;
			ResultSet rs = null;
			try {
				stmt = conn.prepareStatement(query);
				/*stmt.setString(1, username);*/
				rs = stmt.executeQuery();
				int count = 0;
				while (rs.next()) 
				{
					count = Integer.parseInt(rs.getString("count"));	
				}			
					
			} catch (SQLException e) {
				e.printStackTrace();
			}
					
					
		}

		
	}
	
	public void bidProduct(String product_id)
	{
		String query = "select product_id, product_name, product_desc, product_adv,product_seller_info, product_price,product_base_bid, current_bid from product_detail " +
				"where product_id = ?";
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.prepareStatement(query);
			stmt.setString(1, product_id);
			rs = stmt.executeQuery();
			int count = 0;
			while (rs.next()) 
			{
				count = Integer.parseInt(rs.getString("count"));	
			}			
				
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
	
	public void products(String username)
	{
		String query = "";
		if(username != "")
		{
			query = "select product_id, product_name, product_desc, product_adv,product_seller_info, product_quantity, product_price from product_detail " +
				"where product_quantity > 0 and product_bid_flag = 'no' and product_adv != ?";
			Connection conn = ConnectionMgmt.connect();
			PreparedStatement stmt = null;
			ResultSet rs = null;
			try {
				stmt = conn.prepareStatement(query);
				stmt.setString(1, username);
				rs = stmt.executeQuery();
				int count = 0;
				while (rs.next()) 
				{
					count = Integer.parseInt(rs.getString("count"));	
				}			
					
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		else
		{
			query = "select product_id, product_name, product_desc, product_adv,product_seller_info, product_quantity, product_price from product_detail " +
					"where product_quantity > 0 and product_bid_flag = 'no'";
			Connection conn = ConnectionMgmt.connect();
			PreparedStatement stmt = null;
			ResultSet rs = null;
			try {
				stmt = conn.prepareStatement(query);
				/*stmt.setString(1, username);*/
				rs = stmt.executeQuery();
				int count = 0;
				while (rs.next()) 
				{
					count = Integer.parseInt(rs.getString("count"));	
				}			
					
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
	}
	
	public void product(String product_id)
	{
		String query = "select product_id, product_name, product_desc, product_adv,product_seller_info, product_quantity, product_price from product_detail " +
		"where product_id = ?";
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.prepareStatement(query);
			stmt.setString(1, product_id);
			rs = stmt.executeQuery();
			int count = 0;
			while (rs.next()) 
			{
				count = Integer.parseInt(rs.getString("count"));	
			}			
				
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	

}
