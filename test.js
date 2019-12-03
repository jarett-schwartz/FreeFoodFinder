const accountSid = 'AC9939d6843109b4ac135fe26666f55ba1';
const authToken = 'e4d884b7a9c1eeb4ab7319daa18b0079';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Poop?',
     from: '+17146563421',
     to: '+15073161579'
   })
  .then(message => console.log(message.sid));
