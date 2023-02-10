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

import { Component, ReactNode } from "react";
import { AINCRenderer } from "./renderer";
import axios from "axios"

const API_ADDRESS = "https://masher-zkwr5vkj.fermyon.app";
// FIX: Even this temp key should be loaded from .env
const AINC_API_KEY = "AAAAC3NzaC1lZDI1NTE5AAAAIHrph8LVhxgZI3rOyWr4r/mDBz1eONRM5qRt/ZC1cZNn";


export default class App extends Component {
  state: {
    /** A buffer to hold a file read from the computer. */
    buffer?: ArrayBuffer,
    /** The file after processing into a .golf file
     * 
     * **NOTE: This will be a buffered file, not a string, with future releases**
     */
    golf?: Uint8Array
  } = {};

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
   * 
   */
  async process_file(buffer: ArrayBuffer) {
    this.setState({ buffer })

    console.log(buffer)
    let response = await axios.post(API_ADDRESS, buffer, { responseType: 'arraybuffer', headers: { "Authorization": AINC_API_KEY } });
    console.log(response);
    this.setState({ golf: new Uint8Array(response.data) })
  }

  render(): ReactNode {
    if (!this.state.buffer && !this.state.golf) {
      return (
        <div>
          <input type="file" onChange={(e) => this.readFile(e)} accept=".stp, .step, .tg" />
        </div>
      );
    } else if (!this.state.golf) {
      // If the buffer is full, return a loading screen until the model has been processed
      return (<div>
        <h1>Very cool loading screen</h1>
      </div>
      )
    } else {
      return (
        <div style={{ width: "100vw", height: "100vh" }}>
          <AINCRenderer buffer={this.state.golf}></AINCRenderer>
        </div>
      );
    }
  }
}