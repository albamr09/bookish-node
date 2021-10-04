FROM node:14
MAINTAINER albamr09

# Add common user
RUN useradd --create-home --shell /bin/bash user

# Create app directory
WORKDIR /home/user/src/
# Change permissions
RUN chown -R user:user /home/user/src/
RUN chmod -R 755 /home/user/src/

USER user 

# Install app dependencies
COPY ./src/package*.json /home/user/src/
# Copy and override src folder
COPY ./src /home/user/src/

RUN npm install

