# AI-NC Web Renderer Core

This NPM package contains the Wasm and JS/TS Bindings for AI-NC's Web .golf renderer

**For information on how to access and deploy the renderer see the repository level readme**

# Usage

## Importing the wasm package

Unlike a normal js library, to run Wasm the package must be asynchronously downloaded and initialized at run time. This is done by calling the RendererCore.default().

```typescript
import * as RendererCore from "@ai-nc/renderer-core";

await RendererCore.default(); // This command will download the .wasm and prepare it to be run
```

This function must complete **BEFORE** any other types or functions from RendererCore are used. However it must only be done once per page refresh, this means RendererCore.default() could be called at the root App level, then renderers could be created at will without having to worry about loading times. It is not recommended to block the loading of the page by awaiting this call as it takes a second to load.

## Initializing the Renderer

To use the renderer a canvas must be created in the DOM tree **BEFORE** the renderer object is created. This renderer must have the id `renderer-canvas`. Currently only one renderer and canvas can exist at a time.

```html
<div style="width: 100%; height: 100%">
  <canvas id="renderer-canvas"></canvas>
</div>
```
The canvas and renderer will fill the size of the div containing it. It is also highly recommended to disable the context menu for this canvas, as it will break right click panning. This can be done by adding the attributes:

```javascript
// In react
onContextMenu={(e) => e.preventDefault()}
// In Vue
@contextmenu="$event.preventDefault()"
```

Finally before starting the renderer a function must be mounted to the window to allow the renderer to send messages and data to the surrounding application. This function must be mounted directly to the window and called `renderer_event_listener`:

```typescript
window.renderer_event_listener = (event: String, data?: any) => {
  /// Do something with the event!
};
```

The details of these events and the accompanying data are listed below in the events section.

## Opening and Closing the Renderer

Once the canvas is loaded and the event listener is mounted to the window, the renderer can now be loaded. This is done by creating a new `RendererCore.GolfRenderer` Object. This object should then be saved as it is used to send commands from the surrounding application to the renderer. See the commands section for more details on controlling the renderer

```typescript
let renderer = new RendererCore.GolfRenderer(golf, print_debug_info);
```

Up to two arguments can be supplied to the renderer. `print_debug_info` logs a variety of useful info to the console, and it is highly recommended to enable this option during development, then disable it for production builds.

`golf` is a Uint8Array containing the raw bytes of a model to be rendered as soon as the renderer is loaded. For details on the structure of this array see the load command below.

**BEFORE** the canvas is removed from the DOM tree the renderer must be closed, or it will not be able to re-open without refreshing the page. This can be done with the close command.

```typescript
renderer.close();
```

for more details on commands see the section below.

## Commands

Commands can be sent to the renderer from the surrounding application using the `GolfRenderer` object.
```typescript
let renderer = new RendererCore.GolfRenderer();

renderer.load(golf_file_bytes);
renderer.identify([12,34,68]);

renderer.close();
```
The currently supported commands are:

### `load(golf: Uint8Array): void`

Load a .golf file from raw bytes. This command will unload the previously loaded model.

The file must be passed in as a Uint8Array containing the raw bytes of the model. Depending on the package being used for API requests this may require an option to be set to prevent JS turning the body into a string. For example for Axios the config option 'responseType' must be set to 'arraybuffer'.

.golf files can be created by sending step files to the AI-NC API. They can then be saved for better performance and reduced upload/download.

### `focus(ids: Uint32Array): void`

Focus the provided faces and edges.

Focus is a stronger highlight than identify.It applies greater opacity to other faces, and overwrites all other focus and identify commands.

Sending a focus event with an empty vector will clear all focus and identify events.

The ID of faces and edges are emitted by 'on_select' events when a user interacts with the model.
**NOTE: This event has be temporarily disabled**

### `identify(ids: Uint32Array): void`

Highlight the provided faces and edges.

Identify is a weaker highlight than focus. It applies a lower opacity to other faces, and only overwrites other identify commands.

Sending an Identify event with an empty vector will clear all identify events.

The ID of faces and edges are emitted by 'on_select' events when a user interacts with the model.
**NOTE: This event has be temporarily disabled**

### `close(): void`

The close function MUST be called when the canvas element the renderer is drawing to is unloaded. Otherwise the renderer will panic and cannot be relaunched without refreshing the window.

## Events

Events are emitted by the renderer using the `renderer_event_listener` mounted to the window. The event argument specifies the event that was emitted, and the data argument contains any accompanying data. The current list of events the renderer emits is:

### `on_load`

This event is emitted by the renderer when a .golf has finished loading and is now rendered in the canvas. It contains no data.

### `on_select`

**on_select is temporarily disabled**

This event is emitted whenever a user selects or deselects a face or edge. It contains both the face that was clicked, as well as all the currently selected faces and edges. Its data is a stringified JSON that follows the schema:

```json
"target": id,
"selected": [all_currently selected ids]
```

Where:
* target is an optional `Number` that is not present if the user clicked off the model to deselect
* selected is a `Number[]` containing the IDs of all currently selected edges and faces

### `Info`

Reports an info message from the render. The data is a string of the message.

Most info messages are probably just useful in development.

### `Warning`

Reports a waning from the render. The data is a string of the warning.

Most warning messages are probably just useful in development.

### `Error`

Reports an error from the render. The data is a string of the error.

Errors mean that the given file cannot be shown, and should probably be communicated to a user in.

**COPYRIGHT NOTICE**

*2023 AI-NC
All rights reserved.*

This NPM package is protected by copyright and AI-NC retains all proprietary rights in and to this package. The package is licensed to you, not sold, and you may use it only in accordance with the terms and conditions of the license agreement.

The code and content of this package are the property of AI-NC and are protected by international copyright laws. Unauthorized use, reproduction, or distribution of this package or any portion of it may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.

By downloading and using this package, you agree to abide by the terms and conditions of the license agreement, and to use the package only as permitted by applicable laws.

AI-NC, 700 Swanston St, Carlton VIC 3053, Australia, george@ai-nc.com

Copyright © 2023 AI-NC. All rights reserved.
