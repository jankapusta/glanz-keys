
const LOW_PERMISSION_USER = 'glanz';

module.exports =  (req) => {
  
  if(process.env.ADMIN_OPEN) {
    return 'Admin';
  }

  // NGINX stuff - disabled
  // const base64AuthData = req.headers['authorization'] || req.headers['Authorization'];
  // if(!base64AuthData) {
  //   return '';
  // }
  // const matches = base64AuthData.split('Basic ');
  // let buff = Buffer.from(matches[1], 'base64');  
  // let usernamePwdPair = buff.toString('utf-8');
  // const usernamePwdArray = usernamePwdPair.split(':');
  // const username = usernamePwdArray[0];

  const username = req.auth ? req.auth.user : false;
  return username === LOW_PERMISSION_USER ? false : username;

}