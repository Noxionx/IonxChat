var default_user = {
	'username': 'default_user',
	'password': '12345'
}

var findOne = function(params, callback){
	if(params && params.username){
		if(default_user.username == params.username){
			var user = {}
			user.__proto__ = default_user
			user.validPassword = function(pwd){
				return this.password == pwd
			}
			!!callback && callback(null, user)
		}
		else{
			!!callback && callback(null)
		}
	}
	else{
		!!callback && callback("Bad parameters")
	}
}
exports.findOne = findOne