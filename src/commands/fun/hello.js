const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'hello',
  description: 'Hey there GustyHost!',
  managerOnly: true,
  callback: async (client, interaction) => {

    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    const embed = new EmbedBuilder()
    .setTitle('Hello!')
    .setColor('Green')
    .addFields(
      {
        name: 'Welcome to GustyHost.',
        value: 'This is the GustyHost Discord bot, here to automate things, making everyones experience here better.',
        inline: true,
      },
      {
        name: 'Getting ',
        value: 'This is the GustyHost Discord bot, here to automate things, making everyones experience here better.',
        inline: true,
      }
    );

    interaction.editReply({ embeds: [embed] });
  }
};
