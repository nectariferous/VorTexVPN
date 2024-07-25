const express = require('express');
const vpnManager = require('./src/vpnManager');
const webFilter = require('./src/webFilter');
const logger = require('./src/logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// VPN connection status
app.get('/vpn/status', (req, res) => {
  res.json({ connected: vpnManager.isConnected });
});

// Connect to VPN
app.post('/vpn/connect', async (req, res) => {
  try {
    await vpnManager.connect();
    res.json({ success: true, message: 'Connected to VPN' });
  } catch (error) {
    logger.error('Failed to connect to VPN', error);
    res.status(500).json({ success: false, message: 'Failed to connect to VPN' });
  }
});

// Disconnect from VPN
app.post('/vpn/disconnect', async (req, res) => {
  try {
    await vpnManager.disconnect();
    res.json({ success: true, message: 'Disconnected from VPN' });
  } catch (error) {
    logger.error('Failed to disconnect from VPN', error);
    res.status(500).json({ success: false, message: 'Failed to disconnect from VPN' });
  }
});

// Web filter check
app.get('/filter/check', (req, res) => {
  const { domain } = req.query;
  if (!domain) {
    return res.status(400).json({ success: false, message: 'Domain parameter is required' });
  }
  const allowed = webFilter.filter(domain);
  res.json({ allowed });
});

// Start the server
app.listen(port, () => {
  logger.info(`VorTex Cybersecurity server listening at http://localhost:${port}`);
});