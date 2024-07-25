const { ipcRenderer } = require('electron');

const statusElement = document.getElementById('status');
const toggleButton = document.getElementById('toggleConnection');

let isConnected = false;

toggleButton.addEventListener('click', () => {
  if (isConnected) {
    ipcRenderer.send('disconnect-vpn');
  } else {
    ipcRenderer.send('connect-vpn');
  }
});

ipcRenderer.on('connection-status', (event, connected) => {
  isConnected = connected;
  statusElement.textContent = isConnected ? 'Connected' : 'Disconnected';
  toggleButton.textContent = isConnected ? 'Disconnect' : 'Connect';
});
