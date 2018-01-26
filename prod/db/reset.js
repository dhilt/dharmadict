const client = require('./client.js');

let scripts = [
  '20170908160000_cleanup',
  '20170908161900_create_index',
  '20170908174900_add_terms',
  '20170908184600_add_users',
  '20170908205600_add_translations',
  '20180125205500_add_pages'
];

console.log('DB reset scripts running');

scripts = scripts.map(scriptName => require('./scripts/' + scriptName));

for (let i = 0; i < scripts.length; i++) {
  let script = scripts[i];
  script._run = () => {
    console.log();
    console.log('==== ' + script.title);
    script.run(client)
      .then(result => {
        console.log('++++ ' + script.title + '... Success! ' + (result && result.text ? result.text : ''));
        if (i < scripts.length - 1) {
          scripts[i + 1]._run();
        }
      })
      .catch(error => {
        console.log('---- ' + script.title + '... Fail! ' + (error && error.text ? error.text : ''));
        if (error) {
          console.log(error);
        }
        if (i < scripts.length - 1) {
          scripts[i + 1]._run();
        }
      })
  };
}

scripts[0]._run();
