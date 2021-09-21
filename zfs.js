
const fs = require('fs');


function zfs_read( file ) {
	return fs.readFileSync(file).toString().split("\n");
}

function zfs_write( file , data , done ) {
	return fs.writeFileSync(file, data + "\n", (e) => { done(e); });
}

function zfs_append( file, data , done ) {
	return fs.appendFileSync('streamers_watchlist.json', author.id + ":" + args[0]  + "\n", (e) => { done(e); });
}

function zfs_remove( file, entry, done ) {
	var entry_list = fs.readFileSync(file).toString().split("\n");
    let cleaned = [];
    entry_list.forEach( item => {
    	if (item != entry) cleaned.push(item);
    });

    return fs.writeFileSync(file, cleaned.join('\n'), (e) => { done(e); });
}


module.exports.zfs_read   = zfs_read;
module.exports.zfs_write  = zfs_write;
module.exports.zfs_append = zfs_append;
module.exports.zfs_remove = zfs_remove;

