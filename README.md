# [Helpme App Backend API](http://helpmeapp-backend-api.herokuapp.com/)

## [View API Documentation](APIDOC.md)

## Setting up the Project

* Install RVM

        $ \curl -sSL https://get.rvm.io | bash -s stable
        $ source ~/.rvm/scripts/rvm
        $ rvm install ruby-2.4.2

* Install Postgres

        $ brew install postgresql
        $ initdb /usr/local/var/postgres -E utf8
        $ brew services start postgresql

* Install Rails

        $ gem install rails

* Clone the Repo

        $ git clone https://your_username@bitbucket.org/hopecollegecs/backend-api.git

* Set up the database

        $ bundle install
        $ rake db:setup

## Running Tests

    $ rake

## Running a local Server

    $ rails server

