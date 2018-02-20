import React, { Component } from 'react'
import './App.css'

import { Shaders, Node, GLSL } from "gl-react"
import { Surface } from "gl-react-dom"

const shaders = Shaders.create({
  fluid: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float blue;
void main() {
    gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
}`
  }
})

class Fluid extends React.Component {
  render() {
    const { blue } = this.props
    return <Node
      shader={shaders.fluid}
      uniforms={{ blue }}
    />;
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
      <Surface width={300} height={300}>
        <Fluid blue={0.5} />
      </Surface>
      </div>
    )
  }
}

export default App
