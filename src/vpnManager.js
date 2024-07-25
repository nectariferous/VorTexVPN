const wg = require('wireguard-tools');
const os = require('os');
const { exec } = require('child_process');
const logger = require('./logger');

class VPNManager {
  constructor() {
    this.isConnected = false;
    this.config = {
      interface: 'wg0',
      address: '10.0.0.2/32',
      privateKey: 'CLIENT_PRIVATE_KEY',
      dns: '1.1.1.1',
      mtu: 1420,
      peers: [{
        publicKey: 'SERVER_PUBLIC_KEY',
        allowedIPs: '0.0.0.0/0',
        endpoint: 'vortex-server.com:51820'
      }]
    };
  }

  async connect() {
    try {
      await wg.up(this.config);
      this.isConnected = true;
      this.setISP();
      logger.info('Connected to VorTex VPN');
    } catch (error) {
      logger.error('Failed to connect to VPN', error);
    }
  }

  async disconnect() {
    try {
      await wg.down(this.config.interface);
      this.isConnected = false;
      logger.info('Disconnected from VorTex VPN');
    } catch (error) {
      logger.error('Failed to disconnect from VPN', error);
    }
  }

  setISP() {
    const command = os.platform() === 'win32'
      ? 'netsh interface ip set dns name="Ethernet" static 1.1.1.1'
      : 'sudo resolvectl dns eth0 1.1.1.1';

    exec(command, (error) => {
      if (error) {
        logger.error('Failed to set DNS', error);
      } else {
        logger.info('DNS set to VorTex Cybersecurity');
      }
    });
  }
}

module.exports = new VPNManager();
