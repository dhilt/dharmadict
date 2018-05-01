const passwordHash = require('password-hash');

const param = process.argv && process.argv[2];

if (param) {
  console.log(passwordHash.generate(param));
} else {
  console.log('No parameter! To generate hash fo "myString" you need to execute "npm run generate-hash myString"');
}
