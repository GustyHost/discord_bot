const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');
// so here, this is an example of a simple command. at the top, you see whats needed
module.exports = {
  // down here the the command itself. you can use the 'deleted' boolean to disable it, 'name' is the command's name, and 'description' is its description
  deleted: true,
  name: 'ban',
  description: 'Bans a member!!!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  // you may fiddle with options, which are the boxes after the command
  options: [
    {
      name: 'target-user',
      description: 'The user to ban.',
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: 'reason',
      description: 'The reason for banning.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  //this is where you can define what permission you need to run it; it makes it nice and simple
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  callback: (client, interaction) => {
    // Finally, this is where you actually send back data to Discord. You can add text or anything.
    interaction.reply('ban..');
  },
};
