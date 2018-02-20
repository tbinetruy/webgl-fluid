import React, { Component } from 'react'
import './App.css'
import Fluid from './Fluid.jsx'

import { Shaders, Node, GLSL } from "gl-react"
import { Surface } from "gl-react-dom"

class App extends Component {
  constructor(props) {
      super(props)

  }

  render() {
    return (
        <Fluid />
    )
  }
}

export default App
