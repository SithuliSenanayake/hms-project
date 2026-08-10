const bcrypt = require('bcrypt');

const plainPassword = 'test123'; // <-- change this to whatever password you want to log in with

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Your hashed password is:');
  console.log(hash);
});