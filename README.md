# AI-NC Web Renderer

This package contains AI-NC's online model viewer, written in Rust and compiled into Web Assembly (WASM) using Web Pack.

The renderer is designed to be embedded in a JavaScrypt or TypeScrypt web page, and is provided as a raw WASM package, a prebuilt Vue Component, and a prebuilt React component.

# Access to packages and examples

All three packages are provided using a private NPM registry where the current and previous versions can be downloaded. New updates will be pushed to this registry along with patch notes and feature additions.

Please contact george@ai-nc.com for access to the full AI-NC SDK repository with examples and additional documentation.

In order to download packages from the registry you will need an authorization token, you should have been provided with one, but i am *fairly sure* you can generate one with the github account that was given access to the SDK repository.

## Local development

For local development add a `.npmrc` file at the root level of your project *(same level as the package.json)*, Make sure this file is added to your `.gitignore`

In that file add:
```
@ai-nc:registry=https://npm.pkg.github.com/ai-nc
//npm.pkg.github.com/ai-nc:_authToken=[YOUR_AUTH_TOKEN]
```

Then packages can be added to you `package.json` as a dependency: 

```
"dependencies": {
    "@ai-nc/renderer-core": "^0.1.0",
    "@ai-nc/react-renderer": "^0.1.0",
    ...
},
```

or installed normally:

```
npm install @ai-nc/react-renderer
```

**Ensure your no file containing your authorization token is committed to git**

## Deployment

To allow the use of these packages in a build environment add the following commands to your preBuild phase (these must be executed before `npm install`).

```
npm config set @ai-nc:registry=https://npm.pkg.github.com/ai-nc
npm config set //npm.pkg.github.com/ai-nc:_authToken=[YOUR_AUTH_TOKEN]
```

For example the `amplify.yml` for deployment on AWS Amplify could be:

```
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm config set @ai-nc:registry=https://npm.pkg.github.com/ai-nc
        - npm config set //npm.pkg.github.com/ai-nc:_authToken=[YOUR_AUTH_TOKEN]
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**COPYRIGHT NOTICE**

*2023 AI-NC
All rights reserved.*

This NPM package is protected by copyright and AI-NC retains all proprietary rights in and to this package. The package is licensed to you, not sold, and you may use it only in accordance with the terms and conditions of the license agreement.

The code and content of this package are the property of AI-NC and are protected by international copyright laws. Unauthorized use, reproduction, or distribution of this package or any portion of it may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.

By downloading and using this package, you agree to abide by the terms and conditions of the license agreement, and to use the package only as permitted by applicable laws.

AI-NC,
700 Swanston St, Carlton VIC 3053, Australia, george@ai-nc.com

Copyright © 2023 AI-NC. All rights reserved.
