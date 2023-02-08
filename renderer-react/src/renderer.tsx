import { Component, ReactNode } from "react";
import * as WasmType from "@ai-nc/renderer-core";

declare global {
  interface Window { renderer_event_listner: (event: String, data?: any) => void }
}

type RendererProps = {buffer: ArrayBuffer};
type RendererState = {buffer?: Uint8Array, renderer?: WasmType.GolfRenderer};

/**
 * Hello this is docs for the renderer component
 */
export class AINCRenderer extends Component<RendererProps, RendererState> {
  state: RendererState = {}
  constructor(props: RendererProps) {
    super(props);
    this.state={buffer: new Uint8Array(props.buffer)}
  }

  async componentDidMount() {
    window.renderer_event_listner =  (event: String, data?: any) => {
      console.log("event: " + event);
      console.log("data: " + data);
    };

    if (this.state.renderer) return;
    let wasm = await import("@ai-nc/renderer-core").catch((e) => {
      console.error("Error importing renderer");
      throw e;
    });
    await wasm.default();

    this.setState({ renderer: new wasm.GolfRenderer(), buffer: this.state.buffer });

    setTimeout(() => {
      if(this.state.renderer && this.state.buffer) this.state.renderer.load("wow")
    }, 3000)
  }

  componentWillUnmount(): void {
    if (this.state.renderer) this.state.renderer.close();
    window.renderer_event_listner = (event: String, data?: any) => {};
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
