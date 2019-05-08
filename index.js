const FtpSvr = require('ftp-srv');
const path = require('path');
const address = require('address');
const HOST = process.env.FTP_HOST || address.ip() || "127.0.0.1";
const PORT = process.env.FTP_PORT || "21";
const ftpServer = new FtpSvr({
	url: `ftp://${HOST}:${PORT}`,
	pasv_url: HOST
});

ftpServer.on('login', (data, resolve, reject) => {
  if (data.username==='hansight' && data.password==='hansight.com') {
    resolve({
      root: path.join(process.cwd(), 'upload'),
      cwd: '/'
    });
  } else {
    reject('no');
  }
});


ftpServer.listen().then(() => {
  console.log('ftp server listening at', HOST + ':' + PORT);
});