FROM node:latest
MAINTAINER albamr09

# Add common user
RUN useradd --create-home --shell /bin/bash user

# Create app directory
WORKDIR /home/user/src/
# Change permissions
RUN chown -R user:user /home/user/src/
RUN chmod -R 755 /home/user/src/

USER user 

# Copy with user as owner
COPY --chown=user:user ./src/package*.json ./

# Install app dependencies
RUN npm install

# Copy and override src folder
COPY ./src .

##container exposed network port number
#EXPOSE 7500
##command to run within the container
#CMD ['node', 'app.js']
