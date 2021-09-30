require('dotenv').config()
// process.env.DISCORD_TOKEN
const Discord = require("discord.js");
const axios = require('axios');
var fs = require('fs')


const client = new Discord.Client();

const Reggie = require('./command-reggie.js');
const RemindMe = require('./command-remindme.js');
const Streamers = require('./command-streamers.js');

const bot = new Discord.Client();
const token = process.env.DISCORD_TOKEN


bot.on('ready', () => {
    const prefix = '!'
    bot.user.setActivity("!timmy - for help", {type:2});
    bot.on('message', async (msg) => {
        //if our message doesnt start with our defined prefix, dont go any further into function
        if (!msg.content.startsWith(prefix)) {
            return
        }

        //slices off prefix from our message, then trims extra whitespace, then returns our array of words from the message
        const args = msg.content.slice(prefix.length).trim().split(' ')

        //splits off the first word from the array, which will be our command
        const command = args.shift().toLowerCase()
        
        if (command === "reggie") {
            msg.channel.send( Reggie.process(args) );
            msg.delete();

        } else if (command === "remindme") {
            new RemindMe().process( msg, args);
            msg.delete();
        }
        else if (command === "sr") {
        	new Streamers().process( msg, args );
        }
        else if (command == "timmy") {
            msg.channel.send('```!reggie TEXT for cool text effects\n!remindme help for more information\n!sr help for more details```');
        }



    })

    new Streamers().faster_tick(bot, process.env.TWITCH_SECRET, process.env.TWITCH_CLIENT); // send once
    setInterval( new RemindMe().interval, 30000, bot );
    setInterval( new Streamers().interval, 3600000 , bot, process.env.TWITCH_SECRET, process.env.TWITCH_CLIENT );
    setInterval( new Streamers().faster_tick, 900000  , bot, process.env.TWITCH_SECRET, process.env.TWITCH_CLIENT );


})

bot.login(token)
