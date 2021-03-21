import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import { ColladaLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/ColladaLoader.js'
import { GUI } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'
// import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js'
import models from '../data/models.js'

let container, stats, controls
let camera, scene, renderer
let gendCar
let movementX = 0, movementY = 0, rotation = false

const gendCarSelect = document.getElementById('gendCarSelect')
const button = document.getElementById('button1')
const buttonText = button.innerText

init()
animate()

function init() {
    container = document.getElementById('container')

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(8, 10, 8)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()

    // collada

    loadModel('landscape','Autoroute')
    loadSelectedGendCar('Berlingo')

    // fbx

    // const loader = new FBXLoader()
    // loader.load( 'model/fbx/Gendarmerie_Dacia_Duster.FBX', function (object) {
    //     object.scale
    //     scene.add(object)
    // })

    //

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)//0.8)
    directionalLight.position.set(1, 1, 0).normalize()
    // directionalLight.castShadow = true
    scene.add(directionalLight)

    //

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    // renderer.antialias = true
    container.appendChild(renderer.domElement)

    //

    stats = new Stats()
    container.appendChild(stats.dom)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // helpers
    // const gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030)
    // scene.add(gridHelper)

    // const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    // GUI

    // const gui = new GUI()
    // const landFolder = gui.addFolder('Autoroute')
    // landFolder.add(landscape.position,'x',-1000,1000,10)
    // landFolder.add(landscape.position,'y',-1000,1000,10)
    // landFolder.add(landscape.position,'z',-1000,1000,10)

    //

    window.addEventListener('resize', onWindowResize)
}

function loadModel(type,name) {
    const model = models[type].find(model => model.name === name)
    if (model !== undefined) {
        loadCollada(model.path,model.options)
    } else {
        console.error('Modèle introuvable : '+name)
    }
}

function removeGendCar() {
    if (gendCar !== undefined) {
        scene.remove(gendCar)
    }
}

function loadGendCar(name) {
    removeGendCar()
    if (controls !== undefined && camera !== undefined) {
        camera.position.set(8, 10, 8)
        camera.lookAt(0, 0, 0)
        controls.target.set(0,0,0)
    }
    loadModel('gendCar',name)
}

function loadCollada(path,options) {
    const loader = new ColladaLoader()
    loader.load(path, function (collada) {
        const model = collada.scene

        if (options) {
            if (options.name) {
                model.name = options.name
            }
    
            if (options.x) {
                model.translateX(options.x)
            }
            if (options.y) {
                model.translateY(options.y)
            }
            if (options.z) {
                model.translateZ(options.z)
            }
        }

        noWireframe(model)
        makeShadow(model)

        // const gui = new GUI()
        // const landFolder = gui.addFolder('Voiture')
        // landFolder.add(model.position,'x',-15,15,0.5)
        // landFolder.add(model.position,'y',-15,15,0.5)
        // landFolder.add(model.position,'z',-15,15,0.5)

        if (options.name === 'gend-car') {
            gendCar = new THREE.Object3D()
            gendCar.add(model)
            if (options.rot) {
                gendCar.rotation.y += options.rot
            }
            scene.add(gendCar)
            button.innerText = buttonText
            button.disabled = gendCarSelect.disabled = false
            button.style.cursor = 'pointer'
        } else {
            scene.add(model)
        }
    })
}

function makeShadow(object) {
    object.traverse(o => {
        if (o.isMesh) {
            o.castShadow = true
        }
    })
}

function noWireframe(object) {
    const lines = new Map()
    object.traverse(o => {
        if (o instanceof THREE.LineSegments) {
            const pt = o.parent
            let l = lines.get(pt)
            if (!l) {
                l = []
                lines.set(pt, l)
            }
            l.push(o)
        }
    })
    lines.forEach((ls, k) => ls.forEach(l => k.remove(l)))
}

function createCube(x,y,z,color) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const material = new THREE.MeshPhongMaterial({color})  // greenish blue

    const cube = new THREE.Mesh(geometry, material)
    cube.translateZ(x)
    cube.translateY(z)
    cube.translateX(y)
    cube.translateY(0.5)

    cube.castShadow = true

    return cube
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
    requestAnimationFrame(animate)
    render()
    stats.update()
}

function render() {
    if (gendCar !== undefined) {
        gendCar.position.x-=movementX
        // gendCar.position.z-=movementY

        // if (rotation) {
            gendCar.rotation.y -= movementY/10
        // }

        camera.position.x-=movementX
        // camera.position.z-=movementY

        controls.target.x-=movementX
        // controls.target.z-=movementY
        controls.update()
    }

    renderer.render(scene, camera)
}

let factormov = 0.5
function handleKeyDown(e){
    // console.log(e.keyCode)
    if (e.keyCode == 39) {
        movementY = factormov
    }
    if (e.keyCode == 37) {
        movementY = -factormov
    }
    if (e.keyCode == 40) {
        movementX = -factormov
    }
    if (e.keyCode == 38) {
        movementX = factormov
    }
    if (e.keyCode == 32) {
        // rotation = true
    }
}

function handleKeyUp(e){
    movementX = 0
    movementY = 0
    rotation = false
}

function loadSelectedGendCar(name) {
    button.innerText = 'Patientez...'
    button.disabled = gendCarSelect.disabled = true
    button.style.cursor = 'wait'
    loadGendCar(name ? name : gendCarSelect.value)
}

document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)

models.gendCar.forEach(car => {
    const opt = document.createElement('option')
    opt.value = opt.innerText = car.name
    gendCarSelect.appendChild(opt)
})

button.addEventListener('click',() => {
    loadSelectedGendCar()
})
