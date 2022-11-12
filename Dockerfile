FROM node:19-alpine

# Move to correct dir
WORKDIR /api

# Create correct dirs
RUN mkdir /api && mkdir /api/data

# Register Environment Variables
ENV NODE_ENV production

# Copy Existing Files
COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY .yarn ./.yarn
COPY src ./src

# Install dependencies
RUN yarn install --immutable

# Build the application
RUN yarn build

# Run NodeJS script
CMD ["yarn", "run", "start"]
