FROM node:6-slim

MAINTAINER "Andrew McLagan" <andrew@ethicaljobs.com.au>

#
#--------------------------------------------------------------------------
# Install gcloud sdk
#--------------------------------------------------------------------------
#

RUN apt-get update && apt-get install -my apt-transport-https

RUN echo "deb https://packages.cloud.google.com/apt cloud-sdk-jessie main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
	curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
	apt-get update && apt-get install -my google-cloud-sdk

RUN apt-get update && apt-get install -my kubectl

#
#--------------------------------------------------------------------------
# Environment
#--------------------------------------------------------------------------
#

ENV CLOUDSDK_CONTAINER_USE_CLIENT_CERTIFICATE True

#
#--------------------------------------------------------------------------
# Build and run entrypoint
#--------------------------------------------------------------------------
#

RUN mkdir -p /var/drone-gce-plugin

ADD . /var/drone-gce-plugin

WORKDIR /var/drone-gce-plugin

RUN npm install

CMD node /var/drone-gce-plugin/src/index.js
