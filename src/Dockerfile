FROM dockerfile/nodejs

MAINTAINER Adam Buczynski, me@adambuczynski.com

WORKDIR /home/meanie

# Install Meanie Prerequisites
RUN npm install -g gulp
RUN npm install -g bower

# Install Meanie packages
ADD package.json /home/meanie/package.json
RUN npm install

# Manually trigger bower (should work via npm install)
ADD .bowerrc /home/meanie/.bowerrc
ADD bower.json /home/meanie/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/meanie

# Set environment
ENV NODE_ENV development

# Port 8080 for server
# Port 35729 for livereload
EXPOSE 8080 35729
CMD ["gulp"]
