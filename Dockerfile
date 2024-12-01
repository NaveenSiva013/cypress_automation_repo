FROM cypress/included:13.2.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
RUN install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/
RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-dev.list'
RUN rm microsoft.gpg
RUN apt-get update && apt-get install -y microsoft-edge-stable
RUN mkdir /cypress-docker
WORKDIR /cypress-docker
COPY . .
RUN npm install
RUN chmod +x cucumber-json-formatter
ENV PATH="$PATH:$PWD"

ENTRYPOINT ["npm", "run"]