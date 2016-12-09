package productMgmt;

import javax.jws.WebService;
import dbManagement.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


@WebService
public class AddProduct {
	
	
	public void addProduct(String product_name,
			String product_category, 
			String product_desc, 
			String product_adv,
			String product_seller_info,
			int product_quantity, 
			float product_price,
			String product_bid_flag,
			float product_base_bid, 
			String product_adv_time,
			String product_bid_end_time,
			float current_bid){

		String insertQuery = "INSERT INTO product_detail"+
				"(product_id, product_name, product_category, product_desc, product_adv, product_seller_info, product_quantity, product_price, product_bid_flag, product_base_bid, product_adv_time,product_bid_end_time,product_sold_flag,current_bid)"+
				"VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'no', ?)";
		
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.prepareStatement(insertQuery);
			stmt.setString(1, product_name);
			stmt.setString(2, product_category);
			stmt.setString(3, product_desc);
			stmt.setString(4, product_adv);
			stmt.setString(5, product_seller_info);
			stmt.setInt(6, product_quantity);
			stmt.setFloat(7, product_price);
			stmt.setString(8, product_bid_flag);
			stmt.setFloat(9, product_base_bid);
			stmt.setString(10, product_adv_time);
			stmt.setString(11, product_bid_end_time);
			stmt.setFloat(12, current_bid);
			stmt.execute();			
				
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}
	
}
