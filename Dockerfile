FROM node:14

# Add common user
RUN useradd --create-home --shell /bin/bash user

# Create app directory
WORKDIR /home/user/app
# Change permissions
RUN chown -R user:user /home/user/app
RUN chmod -R 755 /home/user/app

USER user 

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
