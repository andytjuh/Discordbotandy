const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true})
bot.on('ready', async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("Eagle Nebula", {type: "LISTENING"});
})

/**
 * Check if the user has a role
 */
const hasRole = (role, roles) => {
  if (!role) {
    return false;
  }

  if (typeof role.id === 'undefined') {
    return false;
  }

  return roles.has(role);
};

bot.on('message', async message => {
    if(message.author.bot || message.channel.type === "dm") {
        return;
    }

    let Nickname = "";
    let Username = "";
    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];

    if (cmd !== `${prefix}setnickname`) {
        return;
    }
    const roles = message.member.roles.some;
    
    const ModRole = roles.cache(Role => Role.name === "Quests");
    const OwnerRole = roles.cache(Role => Role.name === "Generalss");
    const CoOwnerRole = roles.cache(Role => Role.name === "Captains");

    if(hasRole(ModRole, roles) && hasRole(OwnerRole, roles) && hasRole(CoOwnerRole, roles)) {
        message.channel.send(`You do not have the right permission to do this, ${message.author}`);
        return;
    }

    if(messageArray.length < 3){
        message.channel.send(`You still need to add arguments, ${message.author}`);
        return;
    }

    const username = messageArray[1];
    const pattern = /(?<=<@!)\d+(?=>)/g;
    const match = username.match(pattern);
    if (!match) {
        message.channel.send("Geef een geldige naam");
        return;
    }

    const naam = message.guild.members.cache.find(member => member.id === match[0]);
    if (!naam || !naam.manageable){
        message.channel.send("I can't nickname " + naam.username);
        return;
    }
    

    const guildMember = message.member;
    

    const filterArray = messageArray.filter(function(_, i) {
        return i > 1;
    });

    const showAll = filterArray.toString().split(",").join(" ");

    naam.setNickname(showAll);
    Nickname = messageArray[2];
    Username = messageArray[1];
    message.channel.send(`Je naam is met succes veranderd geef nu de command ?done ${message.author}`);
    guildMember.roles.set("Recruit");

})
bot.login(process.env.token);