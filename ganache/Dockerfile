FROM ubuntu:bionic as builder

ENV GANACHE_VERSION 2.1.2

# hadolint ignore=DL3008
RUN apt-get clean \
    && apt-get update \
    && apt-get install --no-install-recommends -y \
    wget \
    git \
    # needed to wget github
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN wget -O- https://api.github.com/repos/trufflesuite/ganache/releases/tags/v"$GANACHE_VERSION" \
    | grep "browser_download_url.*linux-x86_64" \
    | cut -d : -f 2,3 \
    | tr -d '"' \
    | xargs wget --output-document ganache \
    && chmod +x ganache 

FROM ubuntu:bionic 

# hadolint ignore=DL3008
RUN apt-get clean \
    && apt-get update \
    && apt-get install --no-install-recommends -y \
    # additional dependency to open ganache \
    libfuse2 \
    libgtk2.0-0 \
    libnss3 \
    libx11-xcb-dev \
    libasound2 \
    libdbus-glib-1-dev \
    fuse \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder ganache ganache
COPY ./Ganache /root/.config/Ganache

ENTRYPOINT ["./ganache"]
