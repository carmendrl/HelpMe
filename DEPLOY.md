#  Deploying the HelpMe web application to heroku

##  Initial set up
Follow the instructions in [this page](https://www.codewithjason.com/deploy-rails-application-angular-cli-webpack-front-end/
) to set up the appropriate folder structure and Heroku configuration for the app.  The biggest thing to do here is to set up the appropriate build packs for Heroku
```
$ heroku buildpacks:add https://github.com/jasonswett/heroku-buildpack-nodejs
$ heroku buildpacks:add heroku/ruby
```
This also involves modifying `package.json` in these ways:

* Add a **preinstall** step to install node-gyp
```
"preinstall": "npm install -g node-gyp",
```

* Add a **postinstall** step that tells Heroku to build the angular application:
```
"heroku-postbuild": "ng build",
```
* Make the `public` directory within the rails app to point to the `client/dist` directory which is the Angular app (this is actually done as part of the repository set up)
```
ln -s client/dist public
```

##  Deploy the code to Heroku
Be sure to have associated the local version of the Git repository by executing the command:
```
heroku login
heroku git:remote -a hopehelpme
```

Then, test that the code compiles correctly:
```
cd client
ng build
```

Assuming everything works correctly, push the code to Heroku using the command
```
git push heroku master
```

##  Migrating the database
In a terminal window, change directories into the root directory of the web application, and then run the following command
```
heroku run rails db:migrate
```
