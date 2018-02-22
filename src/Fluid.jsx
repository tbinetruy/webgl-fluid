//@flow
import React from "react";
import { Uniform, Shaders, Node, GLSL, NearestCopy } from "gl-react";
import { Surface } from "gl-react-dom";
import timeLoop from './timeLoop.jsx'
import png from './foo.png'
import svg from './logo.svg'

const adv = GLSL`precision highp float;
      uniform float deltaT;
      uniform sampler2D velocity;
      uniform float rho;            // Density \n\
      uniform float epsilon;        // Distance between grid units \n\
      varying vec2 uv;


      vec2 u(vec2 coord) {
        return texture2D(velocity, fract(coord)).xy;
      }

      void main() {
        vec2 textureCoord = uv;
        vec2 u_adv = texture2D(velocity, fract(uv)).xy;

        vec2 pastCoord = fract(uv - (0.5 * deltaT * u(textureCoord)));
        u_adv = u(pastCoord);

        vec4 pressure = vec4((-2.0 * epsilon * rho / deltaT) * (
          (u(textureCoord + vec2(epsilon, 0)).x -
           u(textureCoord - vec2(epsilon, 0)).x)
          +
          (u(textureCoord + vec2(0, epsilon)).y -
           u(textureCoord - vec2(0, epsilon)).y)
        ), 0.0, 0.0, 1.0);
      }
`

const advInit = GLSL`precision highp float;
      uniform sampler2D inputTexture;
      varying vec2 uv;
    float random (vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
    }
    // i
    void main() {
    gl_FragColor = vec4(vec3(step(0.5, random(uv))), 1.0);
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


const Gradients = ({ time }) => {
    const isInit = time > 0.5

    return (
    <NearestCopy>
            <Node
                shader={ isInit ? shaders.adv : shaders.init }
                backbuffering
                sync
                uniforms={{
                    deltaT: 0.001,
                    velocity: isInit ? Uniform.Backbuffer : png,
                    epsilon: 1/WIDTH,
                    rho: 0.5,
                }}
            />
    </NearestCopy>
)}


const GradientsLoop = timeLoop(Gradients);

const { clientWidth, clientHeight }= document.documentElement

export default () =>
  <Surface width={clientWidth} height={clientHeight}>
    <GradientsLoop />
  </Surface>;
