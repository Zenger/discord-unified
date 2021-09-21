const moment = require('moment');

const { zfs_read, zfs_write, zfs_append, zfs_remove } = require('./zfs.js');

module.exports = function RemindMe() {
    this.process = async function (discord, args) {

        let allowedPeriods = [ 'minute', 'minutes', 'hour', 'hours', 'day', 'days' ];
        let duration = args[0];
        let period   = args[1];
        args.splice( 0, 2 );
        let message = args.join(' ');
       
        
        if (duration == "help") {
            discord.reply(`\`\`\`!remindme <duration(1,2,3)> <${allowedPeriods.join(',')}> <message of reminder>\`\`\``);
            return;
        }
        try {
            
            

            if (duration < 1 && duration > 100) {
                throw 'Duration cant be more than 100';
                return;
            }
            if (!allowedPeriods.includes(period))
            {
                throw `Failed to understand "${period}". Accepted periods are: ${allowedPeriods.join(', ')}`;
                return;
            }
            
            if (message.length < 3) {
                throw `Reminder message too small`;
                return;
            }
            const expiresIn = moment().add(duration, period)
            zfs_write('reminders.json', discord.author + "|" + expiresIn.format() + "|" + message.replace("\n", " ").replace("|", " "));
                    

        } catch( e ) {
            discord.reply(e);
        }
    

        
         discord.reply(`${discord.author} we'll dm you in ${duration} ${period}.`);   
     
    },

    this.interval = async function (discord) {

        let reminders = zfs_read('./storage/reminders.json');
                    //


        reminders.forEach( reminder => {
            if (reminder.length > 0) {
                var parsed  = reminder.split("|");
                var author = parsed[0];
                var expiryUnixTime = parsed[1];
                var message = parsed[2];
                
               if (moment().isAfter( moment(expiryUnixTime) )) {
                    discord.users.cache.get(author).send('Reminder: ' + message);
                    zfs_remove('./storage/reminders.json', reminder);
               }

                
            }
        });
      
        
    }

}
