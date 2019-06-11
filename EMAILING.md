#  Allowing the application to send email messages

##  SendGrid
SendGrid is a service that facilitates sending of email.  Heroku has an add on service that allows you to create a new send grid account using Heroku's command line tools

##  Set up for HelpMe
The instructions for setting up SendGrid integration with a Heroku app can be found [here](https://devcenter.heroku.com/articles/sendgrid).  It also appears that `heroku addons:docs sendgrid` is a shortcut to display that documentation, in case the URL ever gets broken.

### Sendgrid set up
Here are the steps I followed

```
heroku addons:create sendgrid:starter
#  Gets the value of the username and password to be used
heroku config:get SENDGRID_USERNAME
heroku config:get SENDGRID_PASSWORD
```

On a Mac, add the following 2 lines to `~/.bash_profile` to get the environment variables set appropriately, replacing the ###### with the values shown above

```
export SENDGRID_USERNAME=######
export SENDGRID_PASSWORD=######
```

Note that the `heroku config` commands above will be helpful to determine the right username and password for a local development machine if multiple apps utilizing Sendgrid through Rails are being installed on the same machine.

###  Configuration for ActiveMailer

In `config/environments.rb`, add the following lines
```
ActionMailer::Base.smtp_settings = {
  :user_name => ENV['SENDGRID_USERNAME'],
  :password => ENV['SENDGRID_PASSWORD'],
  :domain => 'yourdomain.com',
  :address => 'smtp.sendgrid.net',
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true
}
```

It's not clear to me at the moment how the 
