var passportLocalMongoose = require("passport-local-mongoose"),
	mongoose              = require("mongoose");


var UserSchema = new mongoose.Schema({
	username : String ,
	password : String ,
	email : String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);