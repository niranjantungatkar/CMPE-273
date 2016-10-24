
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , signin = require('./routes/func.signin')
  , register = require('./routes/func.register')
  , session = require('express-session')
  , utilSession = require('./routes/func.session')
  , addProduct = require('./routes/func.addproduct')
  , product = require('./routes/func.product')
  , userinfo = require('./routes/func.userInfo')
  , buyproduct = require('./routes/func.buyproduct')
  , cart = require('./routes/func.cart')
  , checkout = require('./routes/func.checkout')
  , bid = require('./routes/func.bid')
  , logger = require('./routes/util.logger')
  , mongo = require("./routes/util.mongo")
  , passport = require('passport');
  	require('./routes/func.signin')(passport);
  

var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var mongoStore = require("connect-mongo")(session);

var app = express();

//session properties
/*app.use(session({
	cookieName: 'session', 
	secret: 'eBay_client_session',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000
}));*/

//session properties
app.use(session({
	//cookieName: 'session', 
	secret: 'eBay_client_session',
	resave : false,
	saveUninitialized : false,
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({  
		url: mongoSessionConnectURL})
	})
);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//app.post('/signin',signin.checkValidLogin);
app.post('/signin',function(req, res, next) {
	  passport.authenticate('signin', function(err, user) {
		console.log("App js : "+user);
		if(err)
		{	
			res.send({"flag" : false, "username":null});  
		} 
		if(user == false)
		{
			res.send({"flag" : false, "username":null});
		}
		else
		{
			utilSession.setSession(req, user);
			res.send({"flag" : true, "username":user});
		}
	  })(req, res, next);
});
app.post('/register',register.addUser);
app.post('/addproduct',addProduct.insertproduct);
app.post('/products',product.returnProductdetails);
app.post('/bidproducts',product.returnBidProductsdetails);
app.post('/bidproductdetails',product.returnBidProductInfo);
app.post('/userinfo', userinfo.getUserInfo);
app.post('/productdetails', product.getProductDetails);
app.post('/addtocart', buyproduct.addToCart);
app.post('/getcart', buyproduct.getCart);
app.post('/removeproductcart', cart.removeFromCart);
app.post('/checkout', checkout.checkout);
app.post('/setcart', cart.setCart);
app.post('/removeproductcheckoutcart', checkout.removeFromCart);
app.post('/getuserdetails', userinfo.getUserDetails);
app.post('/updatecontact', userinfo.updateContact);
app.post('/updateaddress', userinfo.updateAddress);
app.post('/updatepersonaldetails', userinfo.updatePersonalDet);
app.post('/soldproducts', userinfo.getsoldproducts);
app.post('/boughtproducts', userinfo.getboughtproducts);
app.post('/endsession', utilSession.sessionDestroy);
app.post('/getSession', utilSession.getSession);
app.post('/bid',bid.enterBid);
app.post('/userbids', userinfo.returnUserBidDetails);
app.post('/totaluserbids', userinfo.returnTotalUserBidDetails);
app.post('/bidcheckout', bid.checkout);
app.post('/loguserclick',logger.logclientclicks)

mongo.connect(mongoSessionConnectURL, function(){  
	console.log('Connected to mongo at: ' + mongoSessionConnectURL); 
	http.createServer(app).listen(app.get('port'), function(){  
		console.log('Express server listening on port ' + app.get('port'));  
	});  
});
/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/
