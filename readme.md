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
* run the app within the local memory via webpack `npm run dev-server`
* run the app in the prod mode to make /api requests work `npm run prod-server`
* or run both servers concurrently `npm start`
* go to http://localhost:5000/
* build client side for the prod via webpack `npm run build`

Production:
* `cd ./prod`
* install nodejs dependencies `npm install`  (`sudo npm install` for mac)
* run the app 'node server.js'
* go to http://localhost:3000/
