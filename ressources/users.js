var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('userDB')
var crypto = require('crypto');


var default_user = {
	'username': 'default_user',
	'password': '12345'
}

var findOne = function(params, callback){
	if(params && params.username){
		db.get('SELECT * FROM users WHERE username=?', [params.username], function(err, row){
			if(err){
				console.log(err)
				!!callback && callback(null)
			}
			else{
				if(!!row && row.username == params.username){
					var user = {}
					user.__proto__ = row
					user.validPassword = function(pwd){
						return this.password == crypto.createHash('sha1').update(pwd).digest('hex')
					}
					!!callback && callback(null, user)
				}
				else{
					!!callback && callback(null)
				}
			}
		})
	}
	else{
		!!callback && callback("Bad parameters")
	}
		
}
exports.findOne = findOne

var initUserTable = function(callback){
	db.exec("DROP TABLE IF EXISTS users")
	.exec("CREATE TABLE IF NOT EXISTS users (username Varchar(255), password Varchar(255))")
	.exec("INSERT INTO users (username, password) VALUES ('noxionx', '"+crypto.createHash('sha1').update('warcraft3').digest('hex')+"')")
	.exec("INSERT INTO users (username, password) VALUES ('spacexion', '"+crypto.createHash('sha1').update('azerty13011992').digest('hex')+"')")
	.exec("INSERT INTO users (username, password) VALUES ('lixoteamionx', '"+crypto.createHash('sha1').update('pikachu35400').digest('hex')+"')")
}
exports.initUserTable = initUserTable

initUserTable()
