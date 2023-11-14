//Despite adding a proper way to unmount the component in App.tsx, the interval is still running and the data is still being updated.

import React, { Component } from "react";
import DataStreamer, { ServerRespond } from "./DataStreamer";
import Graph from "./Graph";
import "./App.css";

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  // Adding a boolean property to the state that indicates whether the graph is visible or not
  showGraph: boolean;
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  intervalId: number | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      //initial value of the showGraph state
      showGraph: false,
    };
  }

//this is added to handle the unmounting of the component
  componentWillUnmount() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    // let x = 0;
    // const interval = setInterval(()=>{

    if (this.intervalId === null) {
      // Check if an interval is already running
      this.intervalId = window.setInterval(() => {
        DataStreamer.getData((serverResponds: ServerRespond[]) => {
          // Update the state by creating a new array of data that consists of
          // Previous data in the state and the new data from server
          this.setState({
            data: serverResponds,
            showGraph: true,
          });
        });

        //The below commented-out code was in the solution but there was a violation handout, which means the interval wasn't being cleared properly.

        // x++;
        // if (x > 1000) {
        //   //clear interval is used to stop the interval from running more than 1000 times.
        //   clearInterval(interval);
        // }
      }, 100);
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
