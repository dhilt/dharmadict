Dharma Dictionary
==============

### Prerequisites
* install [Git](http://git-scm.com/)
* install [node.js](http://nodejs.org/) with npm (Node Package Manager)

### Scripts
* `npm run dev-server` -- run development server on 5000 port
* `npm run prod-server` -- run production server on 3000 port
* `npm run build` -- build client side sources for the production
* `npm start` -- run both development and production servers concurrently

### Development
* install nodejs dependencies `npm install`  (`sudo npm install` for mac)
* install nodejs dependencies for api-server (see "Production" section)
* run the app within the local memory via webpack `npm run dev-server`
* run the app in the prod mode to make /api requests work `npm run prod-server`
* or run both servers concurrently `npm start`
* go to http://localhost:5000/
* build client side for the prod via webpack `npm run build`

### Production
* `cd ./prod`
* install nodejs dependencies `npm install`  (`sudo npm install` for mac)
* run the app `node server.js`
* go to http://localhost:3000/

### Database

#### Installation

* wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.2.deb
* sudo dpkg -i elasticsearch-5.5.2.deb
* sudo update-rc.d elasticsearch defaults

#### Configuration

Need to set some options

* sudo nano /etc/elasticsearch/elasticsearch.yml

```
script.inline: on
script.engine.groovy.inline.aggs: on
path.repo: ["/path_to_backups"]
```

#### Run

* sudo service elasticsearch start
* sudo service elasticsearch stop
* sudo service elasticsearch status

#### Making a snapshot (export data)

Following https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-snapshots.html

1. Register a snapshot repository

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

Then "my_backup" folder should appear in "/path_to_backups" folder. If not (permission issue?), create it manually.

2. Check if the repository has been created properly

```
curl -XGET 'http://localhost:9200/_snapshot/my_backup'
```

3. Make a snapshot for "dharmadict" index

```
curl -XPUT 'http://localhost:9200/_snapshot/my_backup/snap1' {
    "indices": "dharmadict",
    "ignore_unavailable": true,
    "include_global_state": false
}
```

This will create "/path_to_backups/my_backup/snap1" folder and fill it with elastic snapshot stuff.

4. Check if the snapshot has been created properly

```
curl -XGET 'http://localhost:9200/_snapshot/my_backup/snap1'
```

#### Restoring the snapshot (import data)

1. Before restore we need to block "dharmadict" index

```
curl -XPOST 'localhost:9200/dharmadict/_close?pretty'
```

2. Now, a snapshot can be restored using the following command:

```
curl -XPOST 'localhost:9200/_snapshot/my_backup/snap1/_restore?pretty' -H 'Content-Type: application/json' -d'
{
  "indices": "dharmadict",
  "ignore_unavailable": true
}
```
