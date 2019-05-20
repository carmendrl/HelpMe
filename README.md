# [Helpme App Backend API](http://helpme-backend-api.herokuapp.com/)

## [View API Documentation](APIDOC.md)

# Setting up the Project

* Clone the Repo

        $ git clone https://your_username@bitbucket.org/hopecollegecs/help-me-web.git

##  Setting up the backend

* Install RVM

        $ \curl -sSL https://get.rvm.io | bash -s stable
        $ source ~/.rvm/scripts/rvm
        $ rvm install ruby-2.4.2

* Make sure [Homebrew](https://brew.sh/) is installed
* Install Postgres

        $ brew install postgresql
        $ initdb /usr/local/var/postgres -E utf8
        $ brew services start postgresql

* Install Rails

        $ gem install rails

* Set up the database

        $ bundle install
        $ rake db:setup

### Running Tests

    $ rake

### Running a local Server

    $ rails server

##  Setting up the front end

All of the front-end code is located in the `client` folder; the contents of this folder follow a standard Angular application structure.

*  Install the Angular CLI tools by following the instructions in [the Angular Getting Started Guide](https://angular.io/guide/quickstart).  Just install the prerequisites and the Angular CLI tools.

*  Change into the `client` folder

		$  cd client

*  Install dependencies

		$  npm install

*  Start the angular server

		$  ng serve --proxy-config proxy.conf.json
