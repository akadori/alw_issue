FROM --platform=x86-64 public.ecr.aws/docker/library/node:18.16.0-bullseye-slim as base

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    awscli \
    && rm -rf /var/lib/apt/lists/*

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_SESSION_TOKEN
ENV AWS_DEFAULT_REGION=ap-northeast-1
ENV LAMBDA_INSIGHTS_EXTENSION_ARN=arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:60
ENV LAMBDA_WEB_ADAPTER_EXTENSION_ARN=arn:aws:lambda:ap-northeast-1:753240598075:layer:LambdaAdapterLayerX86:17

RUN mkdir -p /extensions/lambda-insights-extension && \
    mkdir -p /extensions/lambda-web-adapter && \
    curl $(aws lambda get-layer-version-by-arn \
    --arn $LAMBDA_INSIGHTS_EXTENSION_ARN \
    --query 'Content.Location' \
    --output text) --output lambda-insights-extension.zip && \
    unzip lambda-insights-extension.zip -d /extensions/lambda-insights-extension && \
    curl $(aws lambda get-layer-version-by-arn \
    --arn $LAMBDA_WEB_ADAPTER_EXTENSION_ARN \
    --query 'Content.Location' \
    --output text) --output lambda-web-adapter.zip && \
    unzip lambda-web-adapter.zip -d /extensions/lambda-web-adapter

FROM --platform=x86-64 public.ecr.aws/docker/library/node:18.16.0-bullseye-slim
# COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.1-x86_64 /lambda-adapter /opt/extensions/lambda-adapter

COPY --from=base /extensions/lambda-insights-extension/extensions/ /opt/extensions/
COPY --from=base /extensions/lambda-insights-extension/cloudwatch/ /opt/cloudwatch/

ARG AWS_LWA_READINESS_CHECK_PATH
COPY --from=base /extensions/lambda-web-adapter/extensions/ /opt/extensions/

ENV PORT=7000
ENV AWS_LWA_READINESS_CHECK_MIN_UNHEALTHY_STATUS=
WORKDIR "/var/task"
ADD package.json /var/task/package.json
ADD package-lock.json /var/task/package-lock.json
RUN npm install --omit=dev
ADD src/ /var/task
CMD ["node", "index.js"]