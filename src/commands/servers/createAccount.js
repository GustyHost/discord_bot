require('dotenv').config();
var generator = require('generate-password');
const { SlashCommandBuilder, ApplicationCommandOptionType } = require('discord.js');
const mysql = require('mysql2/promise');
const axios = require('axios');
const pool = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.ACCOUNT_DATABASE
});

const PTERO_API_URL = process.env.PTERO_API_URL;
const PTERO_API_KEY = process.env.PTERO_TOKEN;

module.exports = {
name: 'register',
description: 'Register a user for the server',
options: [
  {
    name: 'email',
    description: 'Your email for the account',
    required: true,
    type: ApplicationCommandOptionType.String,
  },
  {
    name: 'firstname',
    description: 'Your first name',
    type: ApplicationCommandOptionType.String,
  },
  {
    name: 'lastname',
    description: 'Your last name',
    type: ApplicationCommandOptionType.String,
  },
],

async callback(client, interaction) {
const discordId = interaction.user.id;
const username = interaction.user.username;
try {
  const [rows] = await pool.query('SELECT * FROM users WHERE discord_id = ?', [discordId]);

  if (rows.length > 0) {
    await interaction.reply(`User with Discord ID ${discordId} already exists!`);
    return;
  }

  var password = generator.generate({
    length: 15,
    symbols: true,
    numbers: true,
    lowercase: true,
    uppercase: true,
    exclude: true
  });

  if (username.length < 1 || username.length > 32) {
    await interaction.reply('Username must be between 1 and 32 characters.');
    return;
  }

  if (password.length < 8 || password.length > 191) {
    await interaction.reply('An example occured while generating the password.');
    return;
  }

  const email = `${username}@exampled.com`;

  try {
    const response = await axios.post(`${PTERO_API_URL}`, {
      username: username,
      email: email, 
      first_name: username,
      last_name: 'DiscordUser', 
      password: password
    }, {
      headers: {
        'Authorization': `Bearer ${PTERO_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const pterodactylUserId = response.data.attributes.id; 

    await pool.query('INSERT INTO users (discord_id, username, pterodactyl_id) VALUES (?, ?, ?)', [discordId, username, pterodactylUserId]);
    const success = new EmbedBuilder()
    .setTitle('Success!')
    .setColor('Green')
    .addFields(
      {
        value: 'Hello! This is the GustyHost Discord bot, here to automate things, making everyones experience here better.',
        inline: true,
      }
      
    );
    await interaction.reply(`User ${username} created successfully! A temporary password has been generated. Please set a new password through the Pterodactyl panel for security reasons.`);
  } catch (error) {
    console.error('Error response:', {
      data: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });

    if (error.response && error.response.data && error.response.data.errors) {
      error.response.data.errors.forEach((err) => {
        console.error('Error detail:', err);
      });
      await interaction.reply(`Invalid data provided: ${JSON.stringify(error.response.data.errors)}`);
    } else if (error.response && error.response.status === 429) {
      await interaction.reply('Rate limit reached. Please try again later.');
    } else {
      await interaction.reply('There was an error creating the user. Please try again later.');
    }
  }
} catch (error) {
  console.error(error);
  await interaction.reply('There was an error with the database query. Please try again later.');
}
},
};