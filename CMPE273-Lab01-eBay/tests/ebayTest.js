
var assert = require("assert");
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");



describe("Login Test", function(){
	it("should do a successful login", function(done){
		
		
		server
		.post("/signin")
		.send({"username" : "Hellow@gmail.com","password" :"niranjan"})
		.expect("Content-type","/json")
		.expect(200)
		.end(function(err, res){
			res.body.flag.should.equal(true);
			done();	
		});
		
		
		
	});
	
	
});

describe("Register Test", function(){
	
	it("should register a user",function(done){
				
		server
		.post("/register")
		.send({"username" : "lala2@sjsu.edu",
					"password" : "kenneth123",
					"FirstName" : "Kenneth",
					"LastName" : "Go",
					"Telephone" : "6692655555"})
		.expect("Conten-type","json")
		.expect(200)
		.end(function(err,res){
			res.body.message.should.equal("User was successfully registered");
			res.body.flag.should.equal(true);
			done();
		})
	});
});	
	
	
describe("Product Test", function(){
		
		it("should return the correct product",function(done){
					
			server
			.post("/productdetails")
			.send({"product_id" : "45"})
			.expect("Conten-type","json")
			.expect(200)
			.end(function(err,res){
				res.body.product_name.should.equal("Home Life Bed");
				
				done();
			})
		});
	});
	

describe("Check Session Test", function(){
	
	it("Check if its a valid session",function(done){
				
		server
		.post("/getSession")
		.expect("Conten-type","json")
		.expect(200)
		.end(function(err,res){
			res.body.validFlag.should.equal(true);
			res.body.sessionUser.should.equal("Hellow@gmail.com")
			
			done();
		})
	});
});



describe("Check User Details", function(){
	
	it("Check if valid user details are returned",function(done){
				
		server
		.post("/getuserdetails")
		.expect("Conten-type","json")
		.expect(200)
		.end(function(err,res){
			res.body.user_det.first_name.should.equal("Niranjan");
			res.body.user_det.last_name.should.equal("Tungatkar")
			
			done();
		})
	});
});





	
		
	

