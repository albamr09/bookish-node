FROM alpine:latest
MAINTAINER albamr09

# Install dependencies
RUN apk add --no-cache nodejs npm

# Add common user
RUN adduser -D user
#RUN useradd --create-home --shell /bin/bash user

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
EXPOSE ${PORT}
##command to run within the container
#CMD ['node', 'app.js']
