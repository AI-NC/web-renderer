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

type RendererProps = {
  /**
   * The function to receive updates from the renderer with
   * @param event A string determining the event type see the wiki for options
   * @param data The data attached to the event
   * @returns 
   */
  update_function: (event: String, data?: any) => void
  /**
   * Should the renderer print debug messages
   */
  debug?: boolean
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
  }

  /**
   * Load a model into the renderer. Unloading the current model if any.
   * 
   * @param model - A `Uint8Array` containing the bytes of the model to be loaded
   */
  load(model: Uint8Array) {
    if (!this.state.renderer) {
      console.warn(`Tried to load model before WASM had loaded`);
      return;
    }
    this.state.renderer.load(model)
  }

  /**
   * Strongly Highlight a set of faces and edges by their IDs.
   * 
   * @param ids - The ids of the faces to highlight. To find ids listen to user select events
   */
  focus(ids: [String]) {
    if (!this.state.renderer) {
      console.warn(`Tried to highlight before WASM had loaded`);
      return;
    }
    this.state.renderer.focus(ids)
  }

  /**
   * Weakly Highlight a set of faces and edges by their IDs.
   * 
   * @param ids - The ids of the faces to highlight. To find ids listen to user select events
   */
  identify(ids: [String]) {
    if (!this.state.renderer) {
      console.warn(`Tried to highlight before WASM had loaded`);
      return;
    }
    this.state.renderer.identify(ids)
  }

  async componentDidMount() {
    // Here we asynchronously load the renderer.
    //
    // This takes a little while. It could be worth experimenting with loading in the wasm file in the background then
    // passing it already initialized to this component as a prop.
    await RendererCore.default();

    let renderer = new RendererCore.GolfRenderer(this.props.update_function, this.props.debug);
    this.setState({ renderer });
  }

  /**
   * THIS IS VERY IMPORTANT if renderer.close() is not called before the canvas DOM element is removed, you will not
   * be able to re-launch the renderer without refreshing the page.
  */
  componentWillUnmount(): void {
    if (this.state.renderer) this.state.renderer.close();
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
