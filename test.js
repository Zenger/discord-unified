const RemindMe = require('./command-remindme.js');

class DiscordPoly { 
	reply(msg ) {
		console.log( msg );
	}
	author = 1231231231232;

}

const msg = '!remindme 1 minutes to eat ass';
const args = msg.slice('!').trim().split(' ');


new RemindMe().process( new DiscordPoly, args );


new RemindMe().interval( new DiscordPoly );

setInterval( new RemindMe().interval, 5000, new DiscordPoly );