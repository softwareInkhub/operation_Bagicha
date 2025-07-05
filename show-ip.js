const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
console.log('\x1b[32m');
console.log('───────────────────────────────────────────────');
console.log('  Local:    http://localhost:3000');
console.log('  Network:  http://0.0.0.0:3000');
console.log(`  LAN:      http://${ip}:3000`);
console.log('───────────────────────────────────────────────');
console.log('\x1b[0m'); 