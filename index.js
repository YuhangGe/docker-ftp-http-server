const ftpd = require('ftpd');
const fs = require('fs');
const path = require('path');
const options = {
  host: '0.0.0.0',
  port: process.env.FTP_PORT || 21,
  tls: null,
};
let keyFile;
let certFile;
let server;

if (process.env.KEY_FILE && process.env.CERT_FILE) {
  console.log('Running as FTPS server');
  if (process.env.KEY_FILE.charAt(0) !== '/') {
    keyFile = path.join(__dirname, process.env.KEY_FILE);
  }
  if (process.env.CERT_FILE.charAt(0) !== '/') {
    certFile = path.join(__dirname, process.env.CERT_FILE);
  }
  options.tls = {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
    ca: !process.env.CA_FILES ? null : process.env.CA_FILES
      .split(':')
      .map(function(f) {
        return fs.readFileSync(f);
      }),
  };
} else {
  console.log();
  console.log('*** To run as FTPS server,                 ***');
  console.log('***  set "KEY_FILE", "CERT_FILE"           ***');
  console.log('***  and (optionally) "CA_FILES" env vars. ***');
  console.log();
}

server = new ftpd.FtpServer(options.host, {
  getInitialCwd: function() {
    return '/';
  },
  getRoot: function() {
    return path.join(process.cwd(), 'upload');
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  tlsOptions: options.tls,
  allowUnauthorizedTls: true,
  useWriteFile: false,
  useReadFile: false,
  uploadMaxSlurpSize: 7000, // N/A unless 'useWriteFile' is true.
});

server.on('error', function(error) {
  console.log('FTP Server error:', error);
});

server.on('client:connected', function(connection) {
  var username = null;
  connection.on('command:user', function(user, success, failure) {
    if (user === 'hansight') {
      username = user;
      success();
    } else {
      failure();
    }
  });

  connection.on('command:pass', function(pass, success, failure) {
    if (pass === 'hansight.com') {
      success(username);
    } else {
      failure();
    }
  });
});

if (process.env.DEBUG_LEVEL) {
  server.debugging = parseInt(process.env.DEBUG_LEVEL);
}
server.listen(options.port);
console.log('ftpd listening on port ' + options.port);
