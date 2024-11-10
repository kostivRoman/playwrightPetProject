# syntax = hl.nodeart.app/naw/rnn/numerus/numerus/dockerfile:master

ARG CACHE_PREFIX='cat-cat-cat-land'

FROM scratch AS declare-scratch-stage

FROM hl.nodeart.app/naw/rnn/numerus/numerus/node-helper-20:master AS declare-node-helper-stage

FROM mcr.microsoft.com/playwright:v1.47.1-noble AS declare-playwright-stage

FROM declare-node-helper-stage AS set-npm-flags
ENV NPM_FLAGS='--prefer-offline --no-fund --no-audit --silent'

FROM set-npm-flags AS install-dependencies
ARG CACHE_PREFIX
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm,id=${CACHE_PREFIX}-npm_cache,sharing=locked \
    --mount=type=cache,target=/tmp,id=${CACHE_PREFIX}-npm_releases,sharing=locked \
    npm ci ${NPM_FLAGS}

### EXECUTE-PLAYWRIGHT-TESTS

FROM declare-playwright-stage AS bootstrap-playwright-env
ARG CACHE_PREFIX
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=app,target=app \
    --mount=type=bind,source=testData,target=testData \
    --mount=type=bind,source=tests,target=tests \
    --mount=type=bind,source=playwright.config.ts,target=playwright.config.ts \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=cache,target=/root/.cache,id=${CACHE_PREFIX}-playwright_cache,sharing=locked \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies,readwrite \
    npx playwright install

FROM bootstrap-playwright-env AS execute-playwright-tests
ARG CACHE_PREFIX INVALIDATE_CACHE_EVERY_TIME
ENV CI='true'
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=app,target=app \
    --mount=type=bind,source=testData,target=testData \
    --mount=type=bind,source=tests,target=tests \
    --mount=type=bind,source=playwright.config.ts,target=playwright.config.ts \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=cache,target=/root/.cache,id=${CACHE_PREFIX}-playwright_cache,sharing=locked \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies,readwrite \
    npm run test || true

FROM declare-scratch-stage AS export-playwright-report
ARG INVALIDATE_CACHE_EVERY_TIME
COPY --from=execute-playwright-tests /playwright-report/index.html playwright.html

## CUSTOM TASKS

### LINT-SOURCE-CODE

FROM declare-node-helper-stage AS lint-source-code
ARG CACHE_PREFIX
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=app,target=app \
    --mount=type=bind,source=testData,target=testData \
    --mount=type=bind,source=tests,target=tests \
    --mount=type=bind,source=playwright.config.ts,target=playwright.config.ts \
    --mount=type=bind,source=.eslintrc.cjs,target=.eslintrc.cjs \
    --mount=type=bind,source=.eslintignore,target=.eslintignore \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies,readwrite \
    --mount=type=cache,target=node_modules/.cache/eslint,id=${CACHE_PREFIX}-eslint_cache,sharing=locked \
    --mount=type=cache,target=node_modules/.cache/prettier,id=${CACHE_PREFIX}-prettier_cache,sharing=locked \
    touch /tmp/eslint-exit-code; npm run lint:report || echo $? > /tmp/eslint-exit-code

FROM declare-scratch-stage AS export-eslint-linting-report
ARG INVALIDATE_CACHE_EVERY_TIME
COPY --from=lint-source-code /opt/app/reports/eslint.html eslint.html

FROM declare-node-helper-stage AS detect-eslint-failure
RUN --mount=type=bind,source=eslint.html,target=/tmp/eslint.html,from=export-eslint-linting-report \
    --mount=type=bind,source=/tmp/eslint-exit-code,target=/tmp/eslint-exit-code,from=lint-source-code \
    exit $(cat /tmp/eslint-exit-code)

### AUDIT-DEPENDENCIES

FROM declare-node-helper-stage AS audit-dependencies
ARG INVALIDATE_CACHE_EVERY_HOUR
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies \
    npm run audit:report

FROM declare-scratch-stage AS export-dependencies-audit
ARG INVALIDATE_CACHE_EVERY_TIME
COPY --from=audit-dependencies /opt/app/reports/audit.html audit.html

### CHECK-LICENSES

FROM declare-node-helper-stage AS check-licenses
WORKDIR /opt/app/reports
ARG INVALIDATE_CACHE_EVERY_DAY
WORKDIR /opt/app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies \
    npm run check:licenses

FROM declare-scratch-stage AS export-licenses
ARG INVALIDATE_CACHE_EVERY_TIME
COPY --from=check-licenses /opt/app/reports/licenses.json licenses.json

### PRETTIER

FROM declare-node-helper-stage AS verify-code-format
ARG CACHE_PREFIX
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=app,target=app \
    --mount=type=bind,source=testData,target=testData \
    --mount=type=bind,source=tests,target=tests \
    --mount=type=bind,source=playwright.config.ts,target=playwright.config.ts \
    --mount=type=bind,source=.editorconfig,target=.editorconfig \
    --mount=type=bind,source=.prettierrc,target=.prettierrc \
    --mount=type=bind,source=.eslintignore,target=.eslintignore \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies,readwrite \
    --mount=type=cache,target=node_modules/.cache/prettier,id=${CACHE_PREFIX}-prettier_cache,sharing=locked \
    npm run format:check

### REFRESH-LOCK-FILE

FROM set-npm-flags AS generate-lock-file
ARG CACHE_PREFIX
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=cache,target=/root/.npm,id=${CACHE_PREFIX}-npm_cache,sharing=locked \
    --mount=type=cache,target=/tmp,id=${CACHE_PREFIX}-npm_releases,sharing=locked \
    npm i --package-lock-only ${NPM_FLAGS}

FROM declare-scratch-stage AS export-lock-file
ARG INVALIDATE_CACHE_EVERY_TIME
COPY --from=generate-lock-file /opt/app/package-lock.json package-lock.json

### SORT-PACKAGE-FILE

FROM set-npm-flags AS sort-package-file
ARG CACHE_PREFIX
COPY package.json package.json
RUN --mount=type=cache,target=/root/.npm,id=${CACHE_PREFIX}-npm_cache,sharing=locked \
    --mount=type=cache,target=/tmp,id=${CACHE_PREFIX}-npm_releases,sharing=locked \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies \
    npm run sort:package:json

FROM declare-scratch-stage AS export-package-file
ARG INVALIDATE_CACHE_EVERY_TIME
COPY --from=sort-package-file /opt/app/package.json package.json

### CHECK-PACKAGE-FILE

FROM set-npm-flags AS check-package-file
ARG CACHE_PREFIX
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=cache,target=/root/.npm,id=${CACHE_PREFIX}-npm_cache,sharing=locked \
    --mount=type=cache,target=/tmp,id=${CACHE_PREFIX}-npm_releases,sharing=locked \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=install-dependencies \
    npm run check:package:json
