FROM ethereum/client-go:alltools-v1.9.12 as builder
RUN geth makedag 0 /.ethash
RUN geth makedag 30000 /.ethash

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

COPY --from=builder /.ethash /home/"$USER"/.ethash
COPY --from=builder /usr/local/bin/geth /usr/local/bin/
COPY --from=builder /usr/local/bin/bootnode /usr/local/bin/

COPY scripts/* /home/"$USER"/scripts/

COPY app /home/"$USER"/app

RUN chown -R "$USER":"$USER" /home/"$USER"
WORKDIR /home/"$USER"
USER "$USER"

ENV PATH=/home/"$USER"/scripts:"$PATH"

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
