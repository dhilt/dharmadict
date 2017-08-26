Dharma Dictionary
==============

Prerequisites:
* install [Git](http://git-scm.com/)
* install [node.js](http://nodejs.org/) with npm (Node Package Manager)

Scripts:
* `npm run dev-server` -- run development server on 5000 port
* `npm run prod-server` -- run production server on 3000 port
* `npm run build` -- build client side sources for the production
* `npm start` -- run both development and production servers concurrently

Development:
* install nodejs dependencies `npm install`  (`sudo npm install` for mac)
* install nodejs dependencies for api-server (see "Production" section)
* run the app within the local memory via webpack `npm run dev-server`
* run the app in the prod mode to make /api requests work `npm run prod-server`
* or run both servers concurrently `npm start`
* go to http://localhost:5000/
* build client side for the prod via webpack `npm run build`

Production:
* `cd ./prod`
* install nodejs dependencies `npm install`  (`sudo npm install` for mac)
* run the app `node server.js`
* go to http://localhost:3000/



# Instructions for creating snapshot and restore:

### Creating a snapshot
---
1. Need write a string, that will contain the path to snapshot, ```path.repo: ["/github/.../backups"]``` in file '/etc/elasticsearch/elasticsearch.yml'. This file possible open with next command:
```
sudo nano /etc/elasticsearch/elasticsearch.yml
```
2. If the first step was made, then in next command we can write relative path 'my_backup':
```
curl -XPUT 'http://localhost:9200/_snapshot/my_backup' -H 'Content-Type: application/json' -d'
{
    "type": "fs",
    "settings": {
        "location": "my_backup",
        "compress": true
    }
}'
```
In the folder "/github/.../backups" will appear a new folder "my_backup".
3. With the next command, you can verify that the repository was created:
```
curl -XGET 'http://localhost:9200/_snapshot/my_backup'
```
4. A snapshot with the name "shanp1" in the repository "my_backup" can be created by executing the following command:
```
curl -XPUT 'http://localhost:9200/_snapshot/my_backup/shanp1' {
    "indices": "dharmadict",
    "ignore_unavailable": true,
    "include_global_state": false
}
```


### Restore
---
1. Before restoring we need block index "dharmadict" in database:
```
curl -XPOST 'localhost:9200/dharmadict/_close?pretty'
```
2. Now, a snapshot can be restored using the following command:
```
curl -XPOST 'localhost:9200/_snapshot/my_backup/shanp1/_restore?pretty' -H 'Content-Type: application/json' -d'
{
  "indices": "dharmadict",
  "ignore_unavailable": true
}
'
```
