//@flow
import React from "react";
import { Uniform, Shaders, Node, GLSL, NearestCopy } from "gl-react";
import { Surface } from "gl-react-dom";
import timeLoop from './timeLoop.jsx'
import png from './foo.png'
import svg from './logo.svg'

const adv = GLSL`precision highp float;
      uniform float deltaT;
      uniform sampler2D t;
      varying vec2 uv;

      void main() {
        vec2 u = texture2D(t, uv).xy;

        vec2 pastCoord = fract(uv - (deltaT * u));
        gl_FragColor = texture2D(t, pastCoord);
      }
`

const advInit = GLSL`precision highp float;
      uniform sampler2D inputTexture;
      varying vec2 uv;

      void main() {
        gl_FragColor = texture2D(inputTexture, uv);
      }
`
const shaders = Shaders.create({
  adv: {
      frag: adv,
      // vert: NSVertShader,
  },
  init: {
      frag: advInit,
      // vert: NSVertShader,
  },
});

// Alternative syntax using React stateless function component
const WIDTH = 400

const createTexture = () => {
  const canvas = document.querySelector(`canvas`)
  const gl = canvas.getContext("webgl");

  const tex = gl.createTexture(400, 400)

  return tex
}


const Gradients = ({ time, initialized }) => {
    return (
    <NearestCopy>
        { time < 0.5 ?
            <Node
                shader={shaders.init}
                backbuffering
                sync
                uniforms={{
                    inputTexture: png, //glCreateTexture(WIDTH, WIDTH),
                }}
            />
            :
            <Node
                shader={shaders.adv}
                backbuffering
                sync
                uniforms={{
                    deltaT: 0.005,
                    t: Uniform.Backbuffer,
                }}
            />
        }
    </NearestCopy>
)}


const GradientsLoop = timeLoop(Gradients);

const { clientWidth, clientHeight }= document.documentElement

export default () =>
  <Surface width={clientWidth} height={clientHeight}>
    <GradientsLoop />
  </Surface>;
