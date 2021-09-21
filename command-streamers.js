require('dotenv').config()
const { zfs_read, zfs_write, zfs_append, zfs_remove } = require('./zfs.js');
const fs = require('fs');
const axios = require('axios');

function get_active_streamers(secret, clientId) {
    
   var sl = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
   let streamer_list = [];

   sl.forEach( entry => {
   	 	let psentry = entry.split("|");
   	 	if (!streamer_list.includes( psentry[1]) && psentry[1] != undefined) streamer_list.push(psentry[1]);
   });

   if (sl.length > 0) {
	   	return new Promise( (resolve, reject) => {
	   		 axios({
			  	method: 'post',
			  	url: 'https://id.twitch.tv/oauth2/token',
			  	params: {
			  		client_id: clientId,
			  		client_secret: secret,
			  		grant_type: "client_credentials",
			  		scope: "channel:read:subscriptions"
			  	}
			  }).then( response => {
				  	axios({
				        method: 'get',
				        url: 'https://api.twitch.tv/helix/streams',
				        headers: {
				        	'Authorization': `Bearer ${response.data.access_token}`,
				        	'Client-Id': `${clientId}`
				        },
				        params: {
				        	user_login: streamer_list
				        }
				  	}).then( response => {
				  		resolve( response);
				  	}).catch(e => {
				  		reject(e);
				  	})
			  }).catch( e => {
			  	reject(e);
			  })
	   	}); 
   }


}


function announce_streamer_list( msg,  secret, clientId) {
	get_active_streamers(secret, clientId).then( response => {
		var streamer_list = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
		 streamer_list.forEach(sub => {
            let s = sub.split("|");
            let user_id = s[0]; let streamer_username = s[1]; let frequency = s[2];

            if (response.data.data.length > 0) {
                response.data.data.forEach(streamer => {
                    if (streamer.user_login == streamer_username && streamer.game_name == "Rust") {
                    	msg.users.cache.get(user_id).send(`"${streamer.user_login}" is live and streaming!`);

                    	if (frequency == 0) {
                    		const check_string_once = user_id + "|" + streamer_username + "|0";
        					const check_string_multi = user_id + "|" + streamer_username + "|1";
                    		var streamer_list = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
			                var cleaned = [];
			                streamer_list.forEach( entry => {
			                	if ( entry != check_string_once && entry != check_string_multi ) cleaned.push(entry);
			                });
			                console.log(cleaned);
			                fs.writeFileSync('./storage/streamers_watchlist.json', cleaned.join('\n'), (e) => { console.log(e); });
                    	}
                    }
                });

            }

        });

	});

}


module.exports = function Streamers() {
	 this.process = async function (discord, args) {
	 	const command = args.shift().toLowerCase()
	 	const msg = discord;

	 	console.log(args);

	 	const streamer_username = args[0] || "";
	 	const author = msg.author;
	 	const check_string_once = author + "|" + streamer_username + "|0";
        const check_string_multi = author + "|" + streamer_username + "|1";
         
            if (command == "help" || command == "h") {
                msg.reply("```!sr list to list streamers you're going to be notified about.\n!sr once - to get one single notification when the streamer is online and you'll no longer recieve any other notification!\n!sr sub - to get hourly notifications when streamer is live and playing RUST.\n!sr usnub - to remove yourself from any alerts.```");
                return;
            }

            
            

            if (command == "once" || command == "o" || command == "sub" || command == "subscribe") {
            	if (streamer_username.length < 2) {
	            	msg.reply('Invalid streamer name given!');
	            	return;
	            }


            	var streamer_list = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
            	if (streamer_list.includes( check_string_once ) || streamer_list.includes( check_string_multi )) {
            		msg.reply('Already subbed to this user.');
            	} else {
            		if (command == "once" || command == "o") {
            			streamer_list.push(check_string_once);
            			fs.appendFileSync('./storage/streamers_watchlist.json', check_string_once + "\n");
            		}
            		else {
            			streamer_list.push(check_string_multi);
            			fs.appendFileSync('./storage/streamers_watchlist.json', check_string_multi+ "\n");
            		}
            		msg.reply(`You'll be notified when ${streamer_username} is live.`);
            	}
            }

            if (command == "unsubscribe" || command == "unsub") {
            	if (streamer_username.length < 2) {
	            	msg.reply('Invalid streamer name given!');
	            	return;
	            }

                var streamer_list = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
                var cleaned = streamer_list.filter(item => item != check_string_once);
                var cleaned = streamer_list.filter(item => item != check_string_multi);
                fs.writeFileSync('./storage/streamers_watchlist.json', cleaned.join('\n'), (e) => { console.log(e); });
                msg.reply(`You'll no longer get updates about ${streamer_username}.`);
                return;
            }


            if (command == "list" || command == "ls") {
            	 var streamer_list = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
            	 let announce = [];
            	 streamer_list.forEach( entry => {
            	 	let check = entry.split("|");
            	 	if (check[0] == author) {
            	 		announce.push(check[1]);
            	 	}
            	 });

            	 if (announce.length > 0 ) {
            	 	msg.reply(`You're currently subscribed to: ` + announce.join(',') + ".");
            	 }
            	 else
            	 {
            	 	msg.reply(`You're not subbed to any streamers currently.`);
            	 }
            }





	 }

	this.interval = async function (discord, secret, clientId) { 
		announce_streamer_list(discord, bearer, clientId );
	}

	this.faster_tick = async function (msg, secret, clientId) { 
	
		get_active_streamers(secret, clientId).then( response => {
		var streamer_list = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
		 streamer_list.forEach(sub => {
            let s = sub.split("|");
            let user_id = s[0]; let streamer_username = s[1]; let frequency = s[2];

            if (response.data.data.length > 0) {
                response.data.data.forEach(streamer => {
                    if (streamer.user_login == streamer_username && streamer.game_name == "Rust") {
                    	
                    	if (frequency == 0) {
                    		 msg.users.fetch( user_id).then( user=> user.send(`"${streamer.user_login}" is live and streaming!`))
                    		
                    		const check_string_once = user_id + "|" + streamer_username + "|0";
        					const check_string_multi = user_id + "|" + streamer_username + "|1";
                    		var streamer_list = fs.readFileSync('./storage/streamers_watchlist.json').toString().split("\n");
			                var cleaned = [];
			                streamer_list.forEach( entry => {
			                	if ( entry != check_string_once && entry != check_string_multi ) cleaned.push(entry);
			                });
			               
			                fs.writeFileSync('./storage/streamers_watchlist.json', cleaned.join('\n'), (e) => { console.log(e); });
                    	}
                    }
                });

            }

        });

	});
	}
}