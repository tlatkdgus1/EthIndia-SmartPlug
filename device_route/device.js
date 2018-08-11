const express = require('express');
const router = express.Router();
const db = require('../database/model.js')
const mongoose = require('mongoose');
const crypto = require('crypto');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');

var Device = mongoose.model('DeviceSchema', db.DeviceSchema);
var User = mongoose.model('UserSchema', db.UserSchema);
var Ipfs = mongoose.model('IpfsSchema', db.IpfsSchema);

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

/*
 Smart contract
*/
const source = fs.readFileSync('./ether/contract.json');
var contracts = JSON.parse(source)['contracts'];
contracts = contracts['contract.sol:smartPlugPayment'];
const abi = JSON.parse(contracts['abi']);
const code = '0x' + contracts['bin'];

router.post('/register', (req, res) => {
		console.log(req.body);

		User.find({session: req.headers.session}, (err, user) => {
			if(user[0]){
				user = user[0];
				Device.find({serial_number: req.body.serial_number},( err,device) => {
					if(device[0]){
						res.send({'status': false, 'err': 'already register'});
						return;
					}else{
						Device.collection.insert({user_id: user.user_id, serial_number: req.body.serial_number}, (err, device) =>{
                                     			if(!err){
                                                		console.log(device);
                                                		res.send({'status': true});
                                       			}else{
                                                		res.send({'status': false, 'err': 'device register err'});
                                        		}
                                		});
					}
				});
			}else{
				res.send({'status': false, 'err': "no user"})
			}
		});
	});

router.post('/list', (req, res) => {
		console.log(req.body);
		User.find({session: req.headers.session}, (err, user) => {
			if(user[0]){
				user = user[0];
				Device.find({user_id: user.user_id}, (err, device) =>{
					if(device[0]){
						console.log(device);
						res.send({'status': true, 'device': device});
					}else{
						res.send({'status': true, 'device': null});
					}
				});
			}
		});
});
function calcTime(offset) {

    // create Date object for current location
    d = new Date();
    
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    
    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000*offset));
    
    // return time as a string
    return nd.toLocaleString();

}
String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}
router.post('/set_usage', (req, res) => {
		console.log(req.body);
		User.find({session: req.headers.session}, (err, user) => {
			if(user[0]){
				user = user[0];
				now = calcTime('+5.5') // in india
				date = now.split(',')[0];
				time = now.split(',')[1];
				console.log(date)
				console.log(time);
				tmp = date.split('/');
				_date = tmp[2]+tmp[0].lpad('0', 2)+tmp[1].lpad('0', 2);
				data = req.body.data_usage;
				data = Buffer.from(data, 'utf-8');
		
				ipfs.add(data, function(err, hash) {
					if(err){
						console.log(err);
						res.send({'status':false, 'err':'ipfs add data err'});
					} else{
						hash = hash[0]['hash'];
						Ipfs.collection.insert({user_id: user.user_id, serial_number: req.body.serial_number, ipfs_hash: hash, date: _date}, (err, _ipfs) => {
							if(err){
								
								res.send({'status':false, 'err':'ipfs database err'});
							}else{
								console.log(_ipfs);
								res.send({'status':true});
							}
						});
					}
					
				});
			}	
		});
});

router.post('/get_usage', (req, res) => {
                console.log(req.body);
                User.find({session: req.headers.session}, (err, user) => {
                        if(user[0]){
                                user = user[0];
				Device.find({user_id: user.user_id}, (err, device) =>{
					if(err){
						res.send({'status': false, 'err':'device get err'});
					}else{
						Ipfs.find({user_id: user.user_id, date: req.body.date}, (err, _ipfs) =>{
							if(err){
								res.send({'status':false, 'err': 'ipfs get err'});
							}else{
								console.log(_ipfs[0]);
								ipfs.cat(_ipfs[0]['ipfs_hash'], function(err, result) {
									if(err){
										res.send({'status':false, 'err':'ipfs cat err'});
									}else{
										usage =(result.toString().split("\"usage\"\ :")[1]); 
										usage = usage.split("\n")[0]	
										usage = usage.replace(/(^\s*)|(\s*$)/gi, "");

										console.log(req.body.date+ ": "+usage.toString());
							
										
									}

								})
							}
						});
					}
				});

                        }
                });
});


router.post('/init_usage', (req, res) => {
                console.log(req.body);
                User.find({session: req.headers.session}, (err, user) => {
                        if(user[0]){
                                user = user[0];

                        }
                });
});

module.exports = router;
