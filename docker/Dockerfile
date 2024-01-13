ARG NODE_VERSION_BASE=${NODE_VERSION_BASE:-21}
ARG IMAGE_OS_TYPE=${IMAGE_OS_TYPE:-bookworm-slim}

FROM node:$NODE_VERSION_BASE-$IMAGE_OS_TYPE

ARG NODE_VERSION_BASE
ARG IMAGE_OS_TYPE
ARG CI_COMMIT_TAG
ARG BUILDSTAMP=${BUILDSTAMP:-"none"}
ARG BUILD_REPO_VERSION=${BUILD_REPO_VERSION}

LABEL vendor="Clarivoy" \
      org.opencontainers.image.authors="Kendal Montgomery <kmontgomery@clarivoy.com>" \
      description="Web Site Resource Performance Analyzer, built from node:${NODE_VERSION_BASE}-${IMAGE_OS_TYPE}" \
      com.clarivoy.image.version="1.0" \
      com.clarivoy.image.build_repo_version="$BUILD_REPO_VERSION" \
      com.clarivoy.image.build_tag="$CI_COMMIT_TAG" \
      com.clarivoy.image.buildstamp="$BUILDSTAMP"

ENV CI_COMMIT_TAG=${CI_COMMIT_TAG}
ENV BUILD_REPO_VERSION=${BUILD_REPO_VERSION}
ENV APP_PATH=/app

COPY ./src ${APP_PATH}/src/

SHELL [ "/bin/bash", "-c" ]

RUN \
  # Install O/S Dependencies needed by project build.
  apt -y update && apt -y install git curl && \
  # Add service user
  groupadd -g 9000 service && \
  useradd -g service -u 9000 service -s /bin/bash -d ${APP_PATH}/src && \
  # Install Node Project Dependencies
  cd ${APP_PATH} && if [[ -f package.json ]]; then npm i; fi && \
  # Remove git and APT Cleanup
  apt -y remove git && apt -y autoremove && \
  rm -rvf /var/lib/apt/lists/*

WORKDIR ${APP_PATH}/src

USER service

ENTRYPOINT [ "/bin/bash" ]

