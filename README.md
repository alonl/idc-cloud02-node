idc-cloud02-node
================
Live on Beanstalk:
http://default-environment-j6kfddk2ip.elasticbeanstalk.com/


Installation
----------------
run 'npm install'


Usage
----------------
* copy 'config/default.json' to 'config/production.json' and add your details.
* export environment variable NODE_ENV=production
* run 'node app.js'


Client-side (AngularJS & Bootstrap)
----------------
All client-side files reside in 'public' directory. It's a single page application.
AngularJS implements the MVC model in the client side. A view is attached to its controller by the route.

* index.html                              -   The frame of the main page. Has a 'view' inside, that can be switched, but currently we have only one view.
                                            Also contains the third-party 'dependencies' (scripts).
* layout.html                             -   The 'view' of the 'students'.
* resources/bootstrap                     -   Bootstrap library
* resources/js/lib/angular                -   AngularJS library
* resources/css                           -   CSS
* resources/images                        -   Images (favicon)
* resources/js/app.js                     -   The Angular app configurations. Also contains the router, which binds view & controller.
* resources/js/directives.js              -   AngularJS custom directives
* resources/js/filters.js                 -   AngularJS custom filters
* resources/js/services.js                -   AngularJS custom services
* resources/js/controllers/StudentCtrl.js -   The 'students' controller (client side).
                                            Contains the business logic behind the view, and AJAX calls functions to the server.


Server-side (NodeJS & Express)
----------------

* app.js      -   The main file, entry point of the server. Contains the following:
** Third-party libraries dependencies (the 'require' part)
** DB connections config
** The app objects and layers (controller, service, DAO)
** API (REST API) - routes each request to its controller's function
* application/StudentController.js    -   The presentation layer. Handles the user requests.
* business/StudentService.js          -   The business layer. Does the business logic.
* persistence/StudentDao.js           -   The repository layer. Access the DB.
* persistence/StudentCache.js         -   Repository later to access Redis.
* config/default.js                   -   Configuration file
* config/production.js                -   REMOVED FROM SOURCE CONTROL - same as default.js but with real values
* package.json                        -   Contains the app info and dependencies for the NPM (package manager)


Notes
----------------
* The source code solution for each question in the exercise is tagged: q1, q2 and q3.
* Q1 - mysql replicas - I followed this stackoverflow answer: http://stackoverflow.com/questions/11835271/has-anyone-figured-out-how-to-scale-amazon-rds-read-replicas
  (Used the application-layer solution).
* BONUS - I've added an option to Edit and Delete an entry (It is not deleted from the cache, though).
* BONUS - Did Q1 bonus (cache header)