# Setup runtime
FROM node:11.4

# Copy repo to container
RUN mkdir -p /home/dharmadict
WORKDIR /home/dharmadict
COPY . .

# Helpers
WORKDIR /home
RUN touch setup_migrations_and_run_server.sh
RUN echo "#!/bin/bash\ncd /home/dharmadict && npm install && cd prod && npm install && if [ ! -f /home/database_created ]; then cd /home/dharmadict && sleep 15 && npm run db-migrate && cd /home && touch database_created; fi && cd /home/dharmadict && npm start" > /home/setup_migrations_and_run_server.sh

# Port forwarding
EXPOSE 3000:3000
EXPOSE 5000:5000

# Run server
WORKDIR /home
ENTRYPOINT ["sh", "setup_migrations_and_run_server.sh"]
