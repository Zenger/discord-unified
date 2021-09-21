function reggie(args) {
        let _ret = "";
        for (let j = 0; j < args.length; j++) {
            if (args[j].length > 0) {
                let characters = args[j].split("");
                for (let i = 0; i < characters.length; i++) {
                    if (characters[i] === " " || characters[i] === "\n" || characters[i] === "\t") continue;
                    if (characters[i] === ".") { _ret += ":record_button: "; continue; }
                    if (characters[i] === "!") { _ret += ":exclamation: "; continue; }
                    if (characters[i] === "?") { _ret += ":question: "; continue; }
                    if (characters[i] === "0") { _ret += ":zero: "; continue; }
                    if (characters[i] === "1") { _ret += ":one: "; continue }
                    if (characters[i] === "2") { _ret += ":two: "; continue }
                    if (characters[i] === "3") { _ret += ":three: "; continue }
                    if (characters[i] === "4") { _ret += ":four: "; continue }
                    if (characters[i] === "5") { _ret += ":five: "; continue }
                    if (characters[i] === "6") { _ret += ":six: "; continue }
                    if (characters[i] === "7") { _ret += ":seven: "; continue }
                    if (characters[i] === "8") { _ret += ":eight: "; continue }
                    if (characters[i] === "9") { _ret += ":nine: "; continue }
                    if (characters[i] === "#") { _ret += ":hash: "; continue }
                    if (characters[i] === "*") { _ret += ":asterisk: "; continue }
                    if (characters[i] === "'") { _ret +=  ""; continue }
                    _ret += ":regional_indicator_" + characters[i].toLowerCase() + ": ";
                }
                _ret += "  ";
            }
        }

        return _ret;
}


module.exports.process = reggie