# AI-NC React Web Renderer

This NPM package contains a prebuilt react component that contains AI-NC's Web Assembly .golf renderer.

**For information on how to access and deploy the renderer see the repository level readme, It is also recommended you look over the README for @ai-nc/renderer-core**

There are 2 options for running this project.

Using `npm start` will launch a demo application that allows a local step file to be rendered in the browser.

Using `npm build` will compile the renderer component into a separate types and javascript file that are then used to create the `@ai-nc/renderer-react` package for embedding into other web pages.

## Importing the renderer

The renderer is imported from the `renderer-react` package:

```typescript
import { AINCRenderer } from "@ai-nc/renderer-react";
```

It can then be imbedded in HTML just like any other react component

```html
return (
  <div style={{ width: "100vw", height: "100vh" }}>
    <AINCRenderer buffer={golf_file_as_bytes}></AINCRenderer>
  </div>
);
```

## Renderer Props

Currently the renderer has one prop buffer. This must be a .golf file as a Uint8Array when the renderer is loaded into the DOM tree. For details on the .golf file see the readme in `renderer-core`.

**`More config and functionality is being added the props`**

**COPYRIGHT NOTICE**

*2023 AI-NC
All rights reserved.*

This NPM package is protected by copyright and AI-NC retains all proprietary rights in and to this package. The package is licensed to you, not sold, and you may use it only in accordance with the terms and conditions of the license agreement.

The code and content of this package are the property of AI-NC and are protected by international copyright laws. Unauthorized use, reproduction, or distribution of this package or any portion of it may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.

By downloading and using this package, you agree to abide by the terms and conditions of the license agreement, and to use the package only as permitted by applicable laws.

AI-NC,
700 Swanston St, Carlton VIC 3053, Australia, george@ai-nc.com

Copyright © 2023 AI-NC. All rights reserved.
