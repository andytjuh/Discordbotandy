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
    let afkRole = message.guild.roles.cache.find(role => role.name === "Recruit");
    let afkRoles = message.guild.roles.cache.find(role => role.name === "Guest");
    let General = message.guild.roles.cache.find(role => role.name === "Guest");
    let cmd = messageArray[0];

  const filterArray = messageArray.filter(function(_, i) {
        return i > 1;
    });

    const showAll = filterArray.toString().split(",").join(" ");


    if (cmd !== `${prefix}rsn`) {
        return;
    }
    const roles = message.member.roles.cache;
    
    const ModRole = roles.find(Role => Role.name === "Quest");
    const OwnerRole = roles.find(Role => Role.name === "Generals");
    const CoOwnerRole = roles.find(Role => Role.name === "Captain");

    if(hasRole(ModRole, roles) && hasRole(OwnerRole, roles) && hasRole(CoOwnerRole, roles)) {
        message.channel.send(`You do not have the right permission to do this, ${message.author}`);
        return;
    }

    if(messageArray.length < 3){
        message.channel.send(`Voorbeeld !rsn ${message.author} Je rs naam - Je echte naam.`);
        return;
    }

    const username = messageArray[1];
    const pattern = /(?<=<@!)\d+(?=>)/g;
    const match = username.match(pattern);
    if (!match) {
        message.channel.send(`(Error) Ik kan je naam niet veranderen \n !rsn ${message.author}  Hier je nieuwe naam - je eigen naam \n (Kom je er niet uit stuur een general even een bericht).`);

        return;
    }

    const naam = message.guild.members.cache.find(member => member.id ===   [0]);
    if (!naam || !naam.manageable){
        message.channel.send(`Ik kan je naam niet veranderen ${message.author}, Stuur 1 van de generals een DM.`);
        return;
    }
    

    const guildMember = message.member;
    

    naam.setNickname(showAll);
    Nickname = messageArray[2];
    Username = messageArray[1];
        message.channel.send(`Je Naam is veranderd ${message.author}. Je hebt nu de Rank RECRUIT!.`);
        message.member.roles.add(afkRole).catch(console.error);
        message.member.roles.remove(afkRoles).catch(console.error);




})
bot.login(process.env.token);