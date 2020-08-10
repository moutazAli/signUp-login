var express       = require("express"),
	mongoose      = require("mongoose"),
	mongo         = require("mongodb"),
	bodyParser    = require('body-parser'),
	passport      = require("passport"),
	User          = require("./modules/user.js"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
	
var app = express();

app.use(require("express-session")({
	secret :"secrit to encode here",
	resave : false	,
	saveUninitialized : false 
}));

app.use(express.static('public'));


mongoose.connect("mongodb://localhost/save_more_db",  { useNewUrlParser: true, useUnifiedTopology: true });


passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));

passport.serializeUser(function(User, done) {
  done(null, User);
});

passport.deserializeUser(function(User, done) {
  done(null, User);
});

app.set("view engine","ejs");

app.get("/",function(req,res){
	res.render("home");
});

app.get("/register", function(req,res){
	res.render("./register");
});



app.post("/register", function(req,res){
	console.log("step 1");
	req.body.username ;
	req.body.password ;
	User.register(new User({username : req.body.username}) , req.body.password , function(err,user){
		if(err){
			console.log("ERROR HAPPINED !!!!!!");
			console.log(err);
			return res.render("register");
		}else{
			console.log("authinecate!!!!");
			passport.authenticate("local")(req,res,function(){
			return res.render("secret");
			});
		}
	});
});
//

app.get("/login",function(req,res){
	res.render("login");
})

app.post("/login", passport.authenticate("local" , {
	successRedirect : "/secret" ,
	failureredirect : "/login"
}) ,function(req,res){
	
});

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");
});

app.get("/logOut" , function(req,res){
	req.logOut();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("login");
};

app.listen(3000,process.env.IP,function(){
	console.log("server running....");
});