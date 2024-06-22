require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');
const axios = require('axios');

const PTERODACTYL_API_URL = process.env.PTERO_API_URL
const PTERODACTYL_API_KEY = process.env.PTERO_TOKEN

module.exports = (client) => {

const fetchPterodactylStats = async () => {
    try {
      const serversResponse = await axios.get(`${PTERODACTYL_API_URL}/servers`, {
        headers: {
          'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'Application/vnd.pterodactyl.v1+json'
        }
      });
      const clientsResponse = await axios.get(`${PTERODACTYL_API_URL}/clients`, {
        headers: {
          'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'Application/vnd.pterodactyl.v1+json'
        }
      });

      const totalServers = serversResponse.data.meta.pagination.total;
      const totalClients = clientsResponse.data.meta.pagination.total;

      return { totalServers, totalClients };
    } catch (error) {
      console.error('Error fetching data from Pterodactyl API:', error);
      return { totalServers: 0, totalClients: 0 }; // default values if API call fails
    }
  };

  const updateStatus = async () => {
    const { totalServers, totalClients } = await fetchPterodactylStats();
    
    let status = [
      {
        name: `${totalClients} users`,
        type: ActivityType.Watching,
      },
      {
        name: `${totalServers} servers`,
        type: ActivityType.Watching,
      },
      {
        name: 'panel.gustyhost.cloud',
        type: ActivityType.Watching,
        url: 'https://panel.gustyhost.cloud'
      },
      {
        name: 'gustyhost.cloud',
        type: ActivityType.Watching,
        url: 'https://gustyhost.cloud'
      },
    ];
  
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  };

  setInterval(updateStatus, 10000); // update every 10 seconds

  // Initial status update
  updateStatus();
};
