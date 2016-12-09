package bidMgmt;

import javax.jws.WebService;
import dbManagement.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@WebService
public class Bidding {

	public void updateBidLog(String product_id, float bidamount, String bidder, String time)
	{
		String query = "Insert into bid_log(bid_id, product_id, bid_amount, bidder, bid_time) values(null, ?, ?, ?, ?)";
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		try {
			stmt = conn.prepareStatement(query);
			stmt.setString(1, product_id);
			stmt.setFloat(2, bidamount);
			stmt.setString(3, bidder);
			stmt.setString(4, time);
			stmt.execute();				
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void updateProductTable(String product_id, String bidder, float bidamount)
	{
		String query = "update product_detail set current_bid = ?, current_bidder = ? where product_id = ?";
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		try {
			stmt = conn.prepareStatement(query);
			stmt.setFloat(1, bidamount);
			stmt.setString(2, bidder);
			stmt.setString(3, product_id);
			
			stmt.execute();				
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void update_bid_transaction(String product_id, String username)
	{
		String query = "update bid_transaction set paid_flag = 'Y' where product_id = ? and username = ?";
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		try {
			stmt = conn.prepareStatement(query);
			stmt.setString(1, product_id);
			stmt.setString(2, username);
			stmt.execute();				
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void update_transaction_detail(String username, String product_id, float bid_amount, String time)
	{
		String transactionQuery = "INSERT INTO transaction_detail (trans_id, trans_type, username,product_id, trans_amount, product_quantity, trans_time) VALUES"+
				"(null, '3', ?, ?, ?, '1', ?)";
		Connection conn = ConnectionMgmt.connect();
		PreparedStatement stmt = null;
		try {
			stmt = conn.prepareStatement(transactionQuery);
			stmt.setString(1, username);
			stmt.setString(2, product_id);
			stmt.setFloat(3, bid_amount);
			stmt.setString(4, time);
			stmt.execute();				
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	
	
}
