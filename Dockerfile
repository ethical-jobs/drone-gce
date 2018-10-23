FROM node:9-alpine

MAINTAINER "Andrew McLagan" <andrew@ethicaljobs.com.au>

ARG CLOUD_SDK_VERSION=221.0.0

ENV CLOUD_SDK_VERSION=$CLOUD_SDK_VERSION

ENV PATH /google-cloud-sdk/bin:$PATH

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
    # Basic check it works.
    gcloud --version

VOLUME ["/root/.config"]

#
#--------------------------------------------------------------------------
# Install kubectl
#--------------------------------------------------------------------------
#

# Install kubectl, Note: Latest version may be found on: https://aur.archlinux.org/packages/kubectl-bin/
ADD https://storage.googleapis.com/kubernetes-release/release/v1.12.0/bin/linux/amd64/kubectl /usr/local/bin/kubectl

ENV HOME=/config

RUN set -x && \
    apk add --no-cache curl ca-certificates && \
    chmod +x /usr/local/bin/kubectl && \
    # Basic check it works.
    kubectl version --client

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
