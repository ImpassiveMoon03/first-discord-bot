const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const colours = require("./colours.json");
const Err_Unknown = "We ran into and Unknown issue processing your message!"

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () =>{
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("With Node.js", {type: "PLAYING"});
})

bot.on("message", async message => {
  if(message.author.bot); return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);
  const params = args.splice(1,10);
  console.log(message.guild);

//HELP
if(command.toLowerCase() === `${prefix.help}`){
    message.delete();
    const exampleEmbed = {
	color: 0xff69b4,
	title: 'ImpassiveBot Help',
	url: 'https://discord.js.org',
	description: 'HELP',
	fields: [
		{
			name: 'Invite',
			value: 'Get my Invite Code!',
		},
		{
			name: 'Prune (ADMIN only)',
			value: 'Prune a specified amount of messages || /prune <#>',
		},
		{
			name: 'Help',
			value: 'Display this Embed',
		},
	],
	timestamp: new Date(),
};

message.channel.send({ embed: exampleEmbed });
}

//INVITE
  if(command.toLowerCase() == `${prefix}invite`){
    message.delete();
    message.channel.send("https://discordapp.com/api/oauth2/authorize?client_id=678525080762056716&permissions=8&scope=bot is the invite, don't wear it out!")
  }

//NICKNAME
 if(command.toLowerCase() == `${prefix}nickname`){
   message.delete();
   console.log(params);
   message.mentions.members.first().setNickname(params.join(" "));
 }

//SERVERSTATS
if(command.toLowerCase() === `${prefix}serverstats`){
  message.delete();
  const owner = await message.guild.members.fetch(`${message.guild.ownerID}`)

  const guildEmbed = {
	color: colours.PURPLE_TWO,
	title: 'ImpassiveBot Embed',
	description: `GUILD INFO`,
	fields: [
		{
      name: 'Guild Name',
      value: `${message.guild.name}`,
    },
    {
      name: 'Member Count',
      value: message.guild.memberCount,
    },
    {
      name: 'Guild Id',
      value: message.guild.id,
    },
    {
      name: 'Region',
      value: message.guild.region,
    },
    {
      name: 'Verification Level',
      value: message.guild.verificationLevel,
    },
    {
      name: 'Content Filter',
      value: message.guild.explicitContentFilter,
    },
    {
      name: 'AFK Timeout',
      value: message.guild.afkTimeout,
    },
    {
      name: 'Server Owner',
      value: `${owner.user.username}`,
    }
	],
	timestamp: new Date(),
};
message.channel.send({ embed: guildEmbed });
}
//ROLE
if(command.toLowerCase() === `${prefix}role`){
  message.delete();

  //INFO
  if(args[0].toLowerCase() === 'info'){
    let roleId = message.content.split(" ");
    const matched = roleId[2].match(/<@&(\d+)>/);
    console.log(matched[1]);
    const Role = await message.guild.roles.fetch(`${matched[1]}`)

    const roleEmbed = {
	  color: colours.PURPLE,
	  title: 'ImpassiveBot Embed',
	  description: `ROLE INFO FOR `+Role.name,
	  fields: [
	  	{
	  		name: 'Role Id',
	  		value: `${matched[1]}`,
	  	},
	  	{
	  		name: 'Role Name',
	  		value: Role.name,
	  	},
	  	{
	  		name: 'Role Color',
	  		value: `${Role.color}`,
	  	},
      {
        name: 'Role Hoist',
        value: `${Role.hoist}`
      },
      {
        name: `Role Hierarchy Position`,
        value: `${Role.rawPosition}`,
      },
      {
        name: `Role Mentionable`,
        value: `${Role.mentionable}`,
      },
      {
        name: `Role Deleted`,
        value: `${Role.deleted}`
      }
	  ],
	  timestamp: new Date(),
    };

    message.channel.send({ embed: roleEmbed });
    }

  //DELETE

  else if(args[0].toLowerCase() === 'delete'){
    let words = message.content.split(" ");
    let target = words[2];
    let matched = words[2].match(/<@&(\d+)>/);
    const Role = await message.guild.roles.fetch(`${matched[1]}`);

    Role.delete();
    message.channel.send("Role Deleted");
  }

  //ELSE

  else{
    message.channel.send("Incorect Usage");
  }
  
}
//MEMBER
if(command.toLowerCase() === `${prefix}member`){
  message.delete();

  //INFO

  if(args[0].toLowerCase() === 'info'){
  let memberId = message.content.split(" ");
  const matched = memberId[2].match(/<@!(\d+)>/);
  console.log(matched[1]);
  const Member = await message.guild.members.fetch(`${matched[1]}`)

  const memberEmbed = {
	color: colours.YELLOW,
	title: 'ImpassiveBot Embed',
	description: `Member Info For `+Member.user.username,
	fields: [
		{
			name: 'Member Id',
			value: `${matched[1]}`,
		},
		{
			name: 'Member Name',
			value: `${Member.user.username}#${Member.user.discriminator}`,
		},
		{
			name: 'Bot Status',
			value: Member.user.bot,
		},
    {
      name: 'Joined',
      value: `${Member.joinedTimestamp}`
    },
    {
      name: `Nickname`,
      value: `${Member.nickname}`,
    },
    {
      name: `Member Deleted`,
      value: `${Member.deleted}`
    }
	],
	timestamp: new Date(),
};
message.channel.send({embed : memberEmbed})
  }

  //KICK

  else if(args[0].toLowerCase() === 'kick'){
    const user = message.mentions.users.first();

    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick()
          .then(() => {
            message.channel.send(`Successfully kicked ${user.tag}`);
          })
          .catch(err => {
            message.channel.send('I was unable to kick the member');
            console.error(err);
          });
      } else {
        message.channel.send("That user isn't in this guild!");
      }
    } else {
      message.channel.send("You didn't mention the user to kick!");
    }
  }
}

})

bot.login(botconfig.token);