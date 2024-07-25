const vpnManager = require('../src/vpnManager');

test('VPN connection', async () => {
  await expect(vpnManager.connect()).resolves.not.toThrow();
});
