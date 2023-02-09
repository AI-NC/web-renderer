/**
 * React Renderer - renderer.tsx
 * 
 * This React app contains AI-NC's web based .golf renderer.
 * It can be run as a demo application with using 'npm run start'
 * 
 * Copyright (c) 2023 AI-NC
 */

import { Component, ReactNode } from "react";
import * as WasmType from "@ai-nc/renderer-core";

declare global {
  // Currently the renderer 
  interface Window { renderer_event_listner: (event: String, data?: any) => void }
}

type RendererProps = { buffer: Uint8Array };
type RendererState = { buffer?: Uint8Array, renderer?: WasmType.GolfRenderer };

/**
 * Hello this is docs for the renderer component
 */
export class AINCRenderer extends Component<RendererProps, RendererState> {
  state: RendererState = {}
  constructor(props: RendererProps) {
    super(props);
    this.state = { buffer: props.buffer }
  }

  async componentDidMount() {
    window.renderer_event_listner = (event: String, data?: any) => {
      console.log("event: " + event);
      console.log("data: " + data);
    };

    if (this.state.renderer) return;
    let wasm = await import("@ai-nc/renderer-core").catch((e) => {
      console.error("Error importing renderer");
      throw e;
    });
    await wasm.default();
    console.log(this.state.buffer)
    if (this.state.buffer) this.setState({ renderer: new wasm.GolfRenderer(this.state.buffer, true), buffer: this.state.buffer });

    // setTimeout(() => {
    //   console.log(this.state.buffer)
    //   if(this.state.renderer && this.state.buffer) this.state.renderer.load(this.state.buffer)
    // }, 3000)
    // setTimeout(() => {
    //   console.log(this.state.buffer)
    //   if(this.state.renderer && this.state.buffer) this.state.renderer.load(this.state.buffer)
    // }, 5000)
  }

  componentWillUnmount(): void {
    if (this.state.renderer) this.state.renderer.close();
    window.renderer_event_listner = (event: String, data?: any) => { };
  }

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
