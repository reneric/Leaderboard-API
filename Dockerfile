FROM reneric/baserubynode:1.2
MAINTAINER Ren Simmons <rsimmo4@gmail.com>
## Prepare
RUN apt-get update

# Postgres dependencies
RUN apt-get install -y libpq-dev

# Node (rails execjs requires a js runtime)
RUN apt-get install -y nodejs

## Clean apt-get
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN gem install bundler -v 1.8.4 --no-ri --no-rdoc

ENV PORT 3000
EXPOSE 3000

WORKDIR /usr/src/app

# Don't run application as root
USER app

# Install dependencies
ADD Gemfile /usr/src/app/
ADD Gemfile.lock /usr/src/app/
RUN sudo chown -R app /usr/src/app
RUN bundle install

# Add application source
ADD . /usr/src/app

RUN sudo chown -R app /usr/src/app
