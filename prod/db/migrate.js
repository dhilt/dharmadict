const client = require('./client.js');

let scripts = [
  /*'20170908160000_cleanup',
  '20170908161900_create_index',
  '20170908174900_add_terms',
  '20170908184600_add_users',
  '20170908205600_add_translations',
  '20180125205500_add_pages',
  '20180202050300_add_users_descriptions',
  '20180501073100_add_tengon.js',
  '20180521121500_add_descriptions_for_akt_and_mk.js',
  '20180521123200_reset_don_translations.js',
  '20180708230000_add_bem.js',
  '20180710110000_add_pages_translation_features_and_parallel_texts.js',*/
  '20180712090000_add_author_and_bio_to_all_pages.js',
  '20180715120000_add_fielddata_for_pages.js'
  // '20180715160000_remove_description_from_users.js' // don't use this migration
];

console.log('DB migration scripts running');

scripts = scripts.map(scriptName => require('./scripts/' + scriptName));

for (let i = 0; i < scripts.length; i++) {
  let script = scripts[i];
  script._run = () => {
    console.log();
    console.log('==== ' + script.title);
    script.run(client)
      .then(() => {
        console.log('Status: done');
        if (i < scripts.length - 1) {
          scripts[i + 1]._run();
        }
      })
      .catch(error => {
        if (error) {
          console.log('Last error: ');
          console.log(error);
          console.log('Status: fail');
        }
        if (i < scripts.length - 1) {
          scripts[i + 1]._run();
        }
      })
  };
}

scripts[0]._run();
