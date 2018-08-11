const express = require('express');
const router = express.Router();
const db = require('../database/model.js')
const mongoose = require('mongoose')
const crypto = require('crypto');

var User = mongoose.model('UserSchema', db.UserSchema)

router.get('/', (req, res) => {
		console.log("test")
		res.send('test');
		});
router.post('/signup', (req, res) => {
		console.log(req.body);
		User.find({user_id: req.body.user_id}, (err, user) => {
				if(user[0]){
					console.log("test");
					res.send({'status':'aleady joined'});
				}else{
				console.log(user)
				User.collection.insert({user_id: req.body.user_id, user_pass: crypto.createHash('sha512').update(req.body.user_pass).digest('base64'), email : req.body.email, user_coin: 0}, (err, user) => {
						if(!err){
						console.log(user);
						res.send({'status':true});
						}else{	
						res.send({'status':false, 'err':"register on db error"});
						}
						});
				}
				});
		});

router.post('/login', (req, res) => {
		console.log(req.body);
		User.find({ user_id: req.body.user_id, user_pass: crypto.createHash('sha512').update(req.body.user_pass).digest('base64') }, (err, user) => {
				
				user = user[0];
				if(err){
					res.send({'status':false, 'err':"user find err"});
				}else if (user){
				var sha = crypto.createHash('sha256');
				sha.update(Math.random().toString());
				hash = String(sha.digest('hex'));
				session_id = user._id + hash;
				
				sha = crypto.createHash('sha256');
				sha.update(session_id);
				session_id = String(sha.digest('hex'));
				User.update({_id:user._id},{$set: {session:session_id}},function(err, result) {
					if(!err){
						res.send( {'status': true, 'session': session_id} );
					}else{
						res.send({'status':false, 'err':"session update err"});
					}
				});
				}
				});
});

router.post('/coin', (req, res) => {
		user_session = req.headers.session;
		if (user_session === undefined){
		res.send({'status':false, 'err': "can't user find"});
		}else{
		User.find({ session: user_session }, (err, user) => {
				user = user[0];
				res.send({'status':true, 'user_id': user.user_id, 'coin': user.user_coin});
				}); 
		}
});

module.exports = router;
