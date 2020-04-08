FROM ethereum/client-go:alltools-v1.9.12 as builder

FROM alpine:3

ENV TZ=Asia/Singapore
ENV USER=docker

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

# hadolint ignore=DL3018
RUN apk --no-cache add bash tzdata

RUN adduser \
    --disabled-password \
    --shell "/bin/bash" \
    "$USER"

RUN addgroup "$USER" "$USER"

COPY --from=builder /usr/local/bin/bootnode /usr/local/bin/
COPY boot.key /home/"$USER"/boot.key
COPY scripts/entrypoint.sh /home/"$USER"/scripts/entrypoint.sh

RUN chown -R "$USER":"$USER" /home/"$USER"
WORKDIR /home/"$USER"
USER "$USER"

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
