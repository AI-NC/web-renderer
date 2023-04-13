/**
 * React Renderer - App.tsx
 * 
 * This app is a demonstration of how to load the renderer, and how to load a local .step file by sending it directly to
 * the AI-NC API for conversion into a .golf file.
 * 
 * NOTE: This processes will change with the full release of the renderer as the .golf file will be changing from a
 * text file to a binary to reduce download sizes.
 * 
 * Copyright (c) 2023 AI-NC
 */

import React, { Component, ReactNode, Ref, createRef } from "react";
import { AINCRenderer } from "./renderer";
import axios from "axios"

const API_ADDRESS = "https://api.ai-nc.com/step";
const API_KEY = "AAAAB3NzaC1yc2EAAAADAQABAAABgQDMoBh52261JtJBD5Th8JXl/2HBsQ91dZhr4wn+7CwHlkpKNylwQs7bvrat0SQEoQ9Tze8bRGdlEAoYK3vzjjuwOZMAV1e6Utenx5Jv6cJAeBy2xxyYT3AfahShBg7ZScukLWwYBmpaLSZ1nJwH7BFBiKv7kCWdcAg+pDo1AwO1svfj+vUD1klPMgeUFHHXct6p1aJf4n+TAWA6zoRUMSUu9y9z03tGvsIAzmHyoOB/nfN5cwYRIL8sDUqryip/Ocgf3MYdUrOTbY9L86WP70cpbXZWKdShXY/ZPFvhOzheIjJqO0w4rt06+GZ3qSRsg8JIkePPunMrYyrW3xlsOP+0Kh8cS1pecPKPuogc3MoBwl+eg2ZAX1k69wYZPBo3RFHY78Sm0JUMCxtOP1z15A4xT04MTB220MO3CGO1sKTOABTnkwEbjfbLlPKepMlnb1XWagNZceDvJCmKks/A8xRVlix7WJ9yldvltHl4IaMZwNI0/6OsvgmUIVc0Uy/4Zk8=";


export default class App extends Component {
  state: {
    /** A buffer to hold a file read from the computer. */
    buffer?: ArrayBuffer,
    /** Is the renderer loaded and ready to recieve commands */
    loaded: boolean,
    /** A ref to the renderer so we can send commands */
    renderer: Ref<AINCRenderer>,
  } = {
      loaded: false,
      renderer: createRef()
    };

  /**
   * ----------------------------------------------------------------------------------------------------------------- *
   * -----------------------------------------------LOADING A MODEL--------------------------------------------------- *
   * ----------------------------------------------------------------------------------------------------------------- *
   */

  /**
   * A function for reading a file from an input event into state.buffer
   * 
   * @param e The input event from a file input element
   * @returns none
   */
  readFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) this.process_file(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * An function that gets a .golf file from the AI-NC API
   * 
   * @param buffer A buffer containing the bytes of the .step file to load
   */
  async process_file(buffer: ArrayBuffer) {
    this.setState({ buffer })

    let response = await axios.post(API_ADDRESS, buffer, { responseType: 'arraybuffer', headers: { "ainc-api-token": API_KEY } });
    this.setState({ golf: new Uint8Array() })

    let renderer = (this.state.renderer as React.RefObject<AINCRenderer>).current
    if (!renderer) {
      console.warn(`Tried to load model before react component was mounted`);
      return;
    }
    renderer.load(new Uint8Array(response.data));
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------- *
   * -----------------------------------------------SENDING A COMMAND------------------------------------------------- *
   * ----------------------------------------------------------------------------------------------------------------- *
   */



  /**
   * ----------------------------------------------------------------------------------------------------------------- *
   * ------------------------------------------------GETTING UPDATES-------------------------------------------------- *
   * ----------------------------------------------------------------------------------------------------------------- *
   */

  /**
   * A function passed to the renderer that is called when the renderer has an update
   */
  update(event: String, data?: any) {
    switch (event) {
      case "renderer_loaded":
        console.log("The renderer has loaded and we are now safe to send commands to it");
        this.setState({ loaded: true });
        break;
      case "model_loaded":
        console.log("Model has finished loading");
        break;
      case "on_select":
        console.log("WIP");
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
      default:
        console.error(`Unrecognised event: ${event}`)
    }
  }

  render(): ReactNode {
    // It is VERY IMPORTANT we define our update function like this, otherwise we will not have access to `this`
    // inside it
    let update_function = (event: String, data?: any) => this.update(event, data);

    return (
      <div style={{ width: "calc(100vw - 50px)", height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
        <div style={{ width: "100%", height: "30%", display: "flex" }}>
          <div style={{padding: "3rem"}}>
            <input type="file" onChange={(e) => this.readFile(e)} accept=".stp, .step, .tg" disabled={!this.state.loaded} />
          </div>

        </div>
        <div style={{ width: "100%", height: "70%" }}>
          <AINCRenderer update_function={update_function} ref={this.state.renderer} debug={true} ></AINCRenderer>
        </div>
      </div>
    );
  }
}