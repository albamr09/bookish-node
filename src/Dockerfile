FROM alpine:latest
MAINTAINER albamr09

# Install dependencies
RUN apk add --no-cache nodejs npm

# Add common user
RUN adduser -D user

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
