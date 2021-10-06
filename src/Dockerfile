FROM alpine:latest
MAINTAINER albamr09

# Install dependencies
RUN apk add --no-cache nodejs npm

# Install mongodb
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk update
RUN apk add mongodb
RUN apk add mongodb-tools
RUN mkdir -p /data/db/
RUN chmod -R 777 /data/db


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
COPY --chown=user:user ./package*.json ./

# Install app dependencies
RUN npm install

# Copy and override src folder
COPY . .
