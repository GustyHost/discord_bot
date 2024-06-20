const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'ping',
  description: 'Replies with the bot ping!',
  callback: async (client, interaction) => {
    

    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    const embed = new EmbedBuilder()
    .setTitle('Pong!')
    .setColor('Random')
    .addFields(
      {
        name: 'Client',
        value: `${ping}ms`,
        inline: true,
      },
      {
        name: 'Websocket',
        value: `${client.ws.ping}ms`,
        inline: true,
      }
    );

    interaction.editReply({ embeds: [embed] });
      
    }

};
