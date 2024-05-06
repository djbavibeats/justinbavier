import { OrthographicCamera, OrbitControls, shaderMaterial, useVideoTexture } from '@react-three/drei'
import { Canvas, extend, useThree, useFrame, useLoader } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { CubeTextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import vertex from './assets/shaders/home/vertex.glsl'
import fragment from './assets/shaders/home/fragment.glsl'

const ShaderObjectMaterial = new shaderMaterial(
  {
    uTime: 0.0,
    uResolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
    uDiffuse1: null,
    uDiffuse2: null, 
    uVignette: null,
    uSpecMap: null
  },
  vertex,
  fragment
)
extend({ ShaderObjectMaterial })

// Reload page once user is finished resizing the window
const debounce = (func) => {
  var timer
  return (event) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, 100, event)
  }
}
window.addEventListener('resize', debounce(function(e) { location.reload() }))

const ShaderObject = () => {
  const shaderObject = useRef()
  const [ cubeMap ] = useLoader(CubeTextureLoader, [[
      'assets/textures/cubemap/Cold_Sunset__Cam_2_Left+X.png',
      'assets/textures/cubemap/Cold_Sunset__Cam_3_Right-X.png',
      'assets/textures/cubemap/Cold_Sunset__Cam_4_Up+Y.png',
      'assets/textures/cubemap/Cold_Sunset__Cam_5_Down-Y.png',
      'assets/textures/cubemap/Cold_Sunset__Cam_0_Front+Z.png',
      'assets/textures/cubemap/Cold_Sunset__Cam_1_Back-Z.png'
  ]])

  
  // Reload page is either the fragment or vertex shader files change
  useEffect(() => {
    if (shaderObject.current.material.fragmentShader !== fragment || shaderObject.current.material.vertexShader !== vertex)
      location.reload()
  })

  useFrame((state) => {
    shaderObject.current.material.uTime = state.clock.elapsedTime
    shaderObject.current.rotation.y += 0.009;
    shaderObject.current.rotation.x += 0.005;
  })

  useEffect(() => {
    shaderObject.current.material.uSpecMap = cubeMap
    console.log(shaderObject.current.material)
  }, [ cubeMap ])

  return <mesh position={[ 0.0, 0.0, 0.0 ]}  scale={ 0.25 } ref={ shaderObject }>
    <sphereGeometry args={[ 1.0, 512.0, 512.0 ]} />
    <shaderObjectMaterial />
  </mesh>
}

const Scene = () => {
  useThree((state) => {
    state.camera.position.set(0, 0, 1)
  })

  return (<>
    <ShaderObject />
  </>)
}

const CameraScene = () => {
  useThree((state) => {
    state.camera.position.set(0, 0, 1)
  })

  return (<>
    <ShaderObject />
  </>)
}

export default function App() {
  useEffect(() => {
  }, [])

  return (
    <>
        <div className="text-wrapper">
          <div className="bottom-content-wrapper">
              <p className="justin-bavier">Justin Bavier</p>
              <div className="link-wrapper volt" id="volt">
                  <a href="https://voltcreative.com" target="_blank">Volt Creative</a>
              </div>
              <div className="link-wrapper tpk" id="tpk">
                  <a href="https://open.spotify.com/artist/7z3MQUxX76zkDWG52PkI0C?si=aY7w-0olQpyFd2RgAbowyA" target="_blank">The Pressure Kids</a>
              </div>
          </div>
      </div>
      <Canvas>
        <OrbitControls />
        <Scene />
      </Canvas>
    </>
  )
}