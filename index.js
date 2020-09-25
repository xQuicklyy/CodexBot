const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const keepAlive = require('./server.js');

const { Client, Collection } = require("discord.js");
const { token, prefix, cacheTime } = require("./config");

const bot = new Client();
bot.commands = new Collection();
bot.virusData = {};
bot.summedData = {};
bot.lastCacheUpdate = 0;

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function updateData() {
    if (Date.now() - bot.lastCacheUpdate < cacheTime) {
        return;
    }

    const response = await fetch("https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Confirmed%20%3E%200&outFields=Country_Region,Confirmed,Deaths,Recovered&orderByFields=Confirmed%20desc");
    const data = await response.json();
// Fetch the data
    bot.virusData = data.features;
    bot.summedData = data.features.reduce((prev, curr) => {
        return {
            confirmed: prev.confirmed + curr.attributes.Confirmed,
            recovered: prev.recovered + curr.attributes.Recovered,
            deaths: prev.deaths + curr.attributes.Deaths
        }
    }, { confirmed: 0, recovered: 0, deaths: 0 });

    bot.lastCacheUpdate = Date.now();
}

// Events
bot.once("ready", () => {
    console.log("[BOT] Logged in to Discord.");

    // Load commands
    const commandsPath = path.resolve(__dirname, "commands");
    if (!fs.existsSync(commandsPath)) {
        console.error(`[ERROR] "commands" directory does not exist.`);
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        try {
            const cmd = require(path.resolve(commandsPath, file));

            if (bot.commands.has(cmd.name)) {
                console.error(`[ERROR] A command named "${cmd.name}" already exists.`);
                continue;
            }

            bot.commands.set(cmd.name, cmd);

            console.log(`[COMMANDS] Added command "${cmd.name}".`);
        } catch (e) {
            console.error(`[ERROR] Failed to load "${file}": ${e.message}`);
        }
    }

    console.log(`[COMMANDS] Loaded ${bot.commands.size} command(s).`);
});

bot.on("message", async (message) => {
    if(message.author.bot) return;
    console.log(`${message.author.username} :: GuildID (${message.guild.id})  ` + message.content)

    const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) {
        return;
    }

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

    const command = bot.commands.get(args.shift().toLowerCase());
    if (!command) {
        return;
    }

    if (command.requiredArgs && args.length < 1) {
        message.channel.send(`${message.author}, you did not provide any arguments. (Correct usage: \`${prefix}${command.name} ${command.requiredArgs}\`)`);
        return;
    }

    try {
        await updateData();
        command.execute(bot, message, args);
    } catch (e) {
        console.error(`[ERROR] Error while executing command "${command.name}": ${e.stack || e}`);
    }
});
bot.on('guildMemberAdd', async member => {
	
	let wChan = db.fetch(`${member.guild.id}`)
	
	if(wChan == null) return;
	
	if(!wChan) return;
	
let font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK) //We declare a 32px font
  let font64 = await jimp.loadFont(jimp.FONT_SANS_64_WHITE) //We declare a 64px font
  let bfont64 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK)
  let mask = await jimp.read('https://i.imgur.com/552kzaW.png') //We load a mask for the avatar, so we can make it a circle instead of a shape
  let welcome = await jimp.read('http://rovettidesign.com/wp-content/uploads/2011/07/clouds2.jpg') //We load the base image

  jimp.read(member.user.displayAvatarURL).then(avatar => { //We take the user's avatar
    avatar.resize(200, 200) //Resize it
    mask.resize(200, 200) //Resize the mask
    avatar.mask(mask) //Make the avatar circle
    welcome.resize(1000, 300)
	
  welcome.print(font64, 265, 55, `Welcome ${member.user.username}`) //We print the new user's name with the 64px font
  welcome.print(bfont64, 265, 125, `To ${member.guild.name}`)
  welcome.print(font64, 265, 195, `There are now ${member.guild.memberCount} users`)
  welcome.composite(avatar, 40, 55).write('Welcome2.png') //Put the avatar on the image and create the Welcome2.png bot
  try{
  member.guild.channels.get(wChan).send(``, { files: ["Welcome2.png"] }) //Send the image to the channel
  }catch(e){
	  // dont do anything if error occurs
	  // if this occurs bot probably can't send images or messages
  }
  })

	
	
})
keepAlive();
bot.login(token);
bot.on('ready', () => {
  bot.user.setActivity("your every move. Don't fuck up.", { type: 'WATCHING' }); 
});  

let y = process.openStdin()
y.addListener("data", res => {
  let x = res.toString().trim().split(/ +/g)
  bot.channels.cache.get("750474265173950506").send(x.join(" "));
})