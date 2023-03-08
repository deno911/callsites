# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# update system packages and cleanup cache
ARG DEBIAN_FRONTEND=noninteractive

ENV DENO_INSTALL=/deno \
    PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

# install deno@latest and configure ownership
RUN mkdir -p ${DENO_INSTALL:-"/deno"} \
    && curl -fsSL https://deno.land/install.sh | sh \
    && chown -R ${USER:-vscode} ${DENO_INSTALL:-"/deno"}

