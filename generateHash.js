const bcrypt = require('bcrypt');

const newPassword = 'ArrexMaiami';
const hashedPassword = bcrypt.hashSync(newPassword, 10);
console.log(hashedPassword);