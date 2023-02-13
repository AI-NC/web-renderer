/**
 * React Renderer - renderer.tsx
 * 
 * This React app contains AI-NC's web based .golf renderer.
 * It can be run as a demo application with using 'npm run start'
 * 
 * Copyright (c) 2023 AI-NC
 */

import { Component, ReactNode } from "react";
import * as RendererCore from "@ai-nc/renderer-core";

declare global {
  /**
   * We need to attach a listener to the window so the renderer can send events to JS with it
   * 
   * TEMPORARY: This is a bit un-ergonomic and will probably change in later versions
   */
  interface Window { renderer_event_listener: (event: String, data?: any) => void }
}

type RendererProps = {
  /**
   * The model to be rendered. If this prop is filled when the renderer is launched the model will be loaded immediately
   * otherwise it will be loaded when the prop is supplied.
   * 
   * The model passed in must be a Uint8Array containing the raw bytes of the .golf file. Depending on the package
   * being used for API requests this may require an option to be set to prevent JS turning the body into a string.
   * For example for Axios the config option 'responseType' must be set to 'arraybuffer'.
   * 
   * .golf files can be created by sending step files to the AI-NC API. They can then be saved for better performance
   * and reduced upload/download.
   */
  buffer?: Uint8Array
};
type RendererState = {
  /** The wasm object that contains the renderer. Used for issuing commands to the renderer */
  renderer?: RendererCore.GolfRenderer
  /** Has the model currently in the buffer been loaded (used to prevent re-loading model on prop change) */
  model_loaded: boolean;
  /** WIP The id's of the faces currently selected by the user */
  selected_ids: Number[];
};

/**
 * Web based .golf model renderer
 */
export class AINCRenderer extends Component<RendererProps, RendererState> {
  state: RendererState = { model_loaded: false, selected_ids: [] }

  constructor(props: RendererProps) {
    super(props);

    // We must attach a listener to the window. This function will be called by the renderer to send information to the
    // application.
    //
    // This will probably be changed in future releases.
    window.renderer_event_listener = (event: String, data?: any) => {
      switch (event) {
        case "on_load":
          console.log("Model has finished loading")
          break;
        case "on_select":
          console.log("WIP")
          break;
        case "Info":
          console.info(data);
          break;
        case "Warning":
          console.warn(data);
          break;
        case "Error":
          console.error(data);
          break;
      }
    };
  }

  async componentDidMount() {
    // Here we asynchronously load the renderer.
    //
    // This takes a little while. It could be worth experimenting with loading in the wasm file in the background then
    // passing it already initialized to this component as a prop.
    await RendererCore.default();

    // If there is already a model in the buffer, load it in immediately
    if (this.props.buffer) {
      // Start the renderer with the model, and debug mode enabled.
      //
      // NOTE: window.renderer_event_listener MUST be set before the renderer is created.
      let renderer = new RendererCore.GolfRenderer(this.props.buffer, true);
      this.setState({ renderer, model_loaded: true });
    } else {
      // Start the renderer without a model, and debug mode enabled.
      let renderer = new RendererCore.GolfRenderer(undefined, true);
      this.setState({ renderer });
    }
  }

  /**
   * THIS IS VERY IMPORTANT if renderer.close() is not called before the canvas DOM element is removed, you will not
   * be able to re-launch the renderer without refreshing the page.
  */
  componentWillUnmount(): void {
    if (this.state.renderer) this.state.renderer.close();
    window.renderer_event_listener = (event: String, data?: any) => { };
  }

  /**
   * The only thing required in the DOM tree is a canvas with id "renderer-canvas". The renderer will scale to whatever
   * size this canvas is.
   * 
   * It is also highly recommend to include "onContextMenu={(e) => e.preventDefault()}". This prevents right click from
   * opening a menu, so it can be used for controls
   */
  render(): ReactNode {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <canvas
          id="renderer-canvas"
          onContextMenu={(e) => e.preventDefault()}
        ></canvas>
      </div>
    );
  }
}
