FROM node:12.16-alpine as builder

# hadolint ignore=DL3018
RUN apk --no-cache add python make g++
COPY ./package* ./
RUN npm ci

# FROM ethereum/client-go:alltools-v1.9.12 as builder-client-go

FROM node:12.16-alpine

ENV USER=node
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

ENV PATH=/home/"$USER"/node_modules/.bin:"${PATH}"

# hadolint ignore=DL3018
RUN apk --no-cache add bash tzdata

COPY --from=builder node_modules /home/"$USER"/node_modules
COPY --from=builder ./package-lock.json /home/"$USER"/package-lock.json
COPY --from=builder ./package.json /home/"$USER"/package.json

# COPY --from=builder-client-go /usr/local/bin/geth /usr/local/bin/geth

COPY scripts/entrypoint.sh /home/"$USER"/scripts/entrypoint.sh

COPY app /home/"$USER"/app

RUN chown -R "$USER":"$USER" /home/"$USER"
WORKDIR /home/"$USER"
USER "$USER"

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
