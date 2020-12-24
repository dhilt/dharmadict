Dharma Dictionary
==============

## Prerequisites
* install [Git](http://git-scm.com/)
* install [Node.js](http://nodejs.org/)
* install [Docker](https://www.docker.com/)

## Production Server via Docker

Docker setup encapsulates all necessary server side infrastructure, including Elasticsearch DB setup & migrations. The following commands provide all-included setup:

* `docker-compose build` to make an image
* `docker-compose up` to create and run the end container

Commands should be run in the project root folder. And this folder should be a Docker shared resource. Also, Elasticsearch DB requires > 2Gb RAM, a Docker memory limit setting should satisfy this requirement (4Gb seem to be enough).

If this is done without errors, the result should be available on http://localhost:3000/.

## Production Server "as is"

As an alternative, the production server can be installed and run "as is", without Docker. This is the way the production server runs in the remote environment. And this can be used for the server application development. The following instructions should be accomplished once:

* install and run Elasticsearch DB (see below, "Database Setup")
* `npm install` - install client app dependencies
* `npm run build` - build client app
* `cd ./prod` - go to server folder
* `npm install` - install nodejs dependencies
* `cd ../` - go to the project root folder
* `npm run db-migrate` - reset the database

Now the server can work locally:

* `cd ./prod` - go to server folder
* run the app `node server.js`
* go to http://localhost:3000/

## Client App Development

The following should be accomplished once:

* `npm install` - install client app dependencies

Production server must be accessible on 3000 port. If it works, the client application can be run via

* `npm run dev-server` - run the client app in the development mode on 5000 port
* go to http://localhost:5000/

If the production server is expected to be run "as is" (without Docker), the following command allows to join both processes in a single one:

* `npm start` -- run both development (5000) and production (3000) servers concurrently (instead of `npm run dev-server` and `node server.js` in the "prod" folder)

After the development is done, the production version of the client app should be built via `npm run build`.

_______

## Database Setup

### Java

* sudo apt-get update
* sudo apt-get install openjdk-7-jre
* java -version

OR

* sudo add-apt-repository -y ppa:webupd8team/java
* sudo apt-get update
* sudo apt-get -y install oracle-java8-installer
* java -version

### Elasticsearch

* wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.2.deb
* sudo dpkg -i elasticsearch-5.5.2.deb
* sudo update-rc.d elasticsearch defaults

### Configuration

Need to set some options

* sudo nano /etc/elasticsearch/elasticsearch.yml

```
script.inline: on
script.engine.groovy.inline.aggs: on
path.repo: ["/path_to_backups"]
```

### Run

* sudo service elasticsearch start
* sudo service elasticsearch stop
* sudo service elasticsearch status

### Making a snapshot (export data)

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

Then "my_backup" folder should appear in "/path_to_backups" folder (/path_to_backups/my_backup). If not (permission issue?), create it manually.

2. Check if the repository has been created properly

```
curl -XGET 'http://localhost:9200/_snapshot/my_backup'
```

3. Make a snapshot of "dharmadict" index

```
curl -XPUT 'http://localhost:9200/_snapshot/my_backup/snap1' {
    "indices": "dharmadict",
    "ignore_unavailable": true,
    "include_global_state": false
}
```

This will create "/path_to_backups/my_backup/snap1" folder and fill it up with elastic snapshot data.

4. Check if the snapshot has been created properly

```
curl -XGET 'http://localhost:9200/_snapshot/my_backup/snap1'
```

### Restoring the snapshot (import data)

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
