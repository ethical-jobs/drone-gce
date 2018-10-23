FROM node:9-alpine

MAINTAINER "Andrew McLagan" <andrew@ethicaljobs.com.au>

ARG CLOUD_SDK_VERSION=221.0.0

ENV CLOUD_SDK_VERSION=$CLOUD_SDK_VERSION

ENV PATH /google-cloud-sdk/bin:$PATH

ENV CLOUDSDK_CONTAINER_USE_CLIENT_CERTIFICATE False

#
#--------------------------------------------------------------------------
# Install gcloud sdk
#--------------------------------------------------------------------------
#

RUN apk --no-cache add \
        curl \
        python \
        py-crcmod \
        bash \
        libc6-compat \
        openssh-client \
        git \
        gnupg \
    && curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    tar xzf google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    rm google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz && \
    ln -s /lib /lib64 && \
    gcloud config set core/disable_usage_reporting true && \
    gcloud config set component_manager/disable_update_check true && \
    gcloud config set metrics/environment github_docker_image && \
    gcloud config unset container/use_client_certificate && \
    # Basic check it works.
    gcloud --version

VOLUME ["/root/.config"]

#
#--------------------------------------------------------------------------
# Install kubectl
#--------------------------------------------------------------------------
#

RUN gcloud components update kubectl

#
#--------------------------------------------------------------------------
# Build and run entrypoint
#--------------------------------------------------------------------------
#

RUN mkdir -p /var/drone-gce-plugin

ADD . /var/drone-gce-plugin

WORKDIR /var/drone-gce-plugin

RUN yarn

CMD node /var/drone-gce-plugin/src/index.js
