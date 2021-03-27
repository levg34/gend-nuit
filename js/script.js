import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import { ColladaLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/ColladaLoader.js'
import { GUI } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'
import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js'
import { KMZLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/KMZLoader.js'
import models from '../data/models.js'

let container, stats, controls
let camera, scene, renderer
let gendCar, landscape
let movementX = 0, rotationY = 0

const gendCarSelect = document.getElementById('gendCarSelect')
const button = document.getElementById('button1')
const buttonText = button.innerText

init()
animate()

if (localStorage.getItem('debug')) {
    document.getElementById('debug').hidden = false
}

function init() {
    container = document.getElementById('container')
    document.body.style.cursor = 'wait'

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(9, 5, 4.5)
    camera.lookAt(0, 1, 0)

    scene = new THREE.Scene()

    // collada

    loadLandscape()
    // loadLandscape('Autoroute sortie')
    // loadLandscape('Autoroute A9 - Le Boulou')
    // loadLandscape('Travaux')
    // loadLandscape('Autoroute')
    // loadLandscape('Autoroute avec pont')
    loadSelectedGendCar()

    //

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
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
    controls.maxPolarAngle = Math.PI/2-0.02
    controls.minDistance = 5
    controls.maxDistance = 50
    controls.enablePan = false
    controls.target.set(0,1,0)
    controls.update()

    // helpers
    // const gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030)
    // scene.add(gridHelper)

    // const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    // GUI

    // const gui = new GUI()
    // const orbitFolder = gui.addFolder('Orbit')
    // orbitFolder.add(controls,'minDistance',0,100,5)
    // orbitFolder.add(controls,'maxDistance',0,100,10)

    //

    window.addEventListener('resize', onWindowResize)
}

function loadModel(type,name) {
    const model = name ? models[type].find(model => model.name === name) : models[type][0]
    if (model !== undefined) {
        if (model.options === undefined) {
            model.options = {}
        }
        if (type === 'gendCar') {
            model.options.name = 'gendCar'
        }
        if (type === 'landscape') {
            model.options.name = 'landscape'
        }
        loadGeneral(model.path,model.options)
    } else {
        console.error('Modèle introuvable : '+name)
    }
    return model
}

function removeGendCar() {
    if (gendCar !== undefined && gendCar.model !== undefined) {
        scene.remove(gendCar.model)
    }
}

function loadGendCar(name) {
    removeGendCar()
    if (controls !== undefined && camera !== undefined) {
        camera.position.set(9, 5, 4.5)
        camera.lookAt(0, 1, 0)
        controls.target.set(0,1,0)
    }
    gendCar = loadModel('gendCar',name)
    gendCar.isLoading = true
}

function loadGeneral(path,options) {
    let loader
    const ext = path.split('.').pop()

    if (ext === 'dae') {
        loader = new ColladaLoader()
    } else if (ext === 'kmz') {
        loader = new KMZLoader()
    } else if (ext.toLowerString() === 'fbx') {
        loader = new FBXLoader()
    } else {
        console.error('Type non reconnu')
        return
    }

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

        if (loader instanceof ColladaLoader) {
            noWireframe(model)
        }
        makeShadow(model)

        // const gui = new GUI()
        // const landFolder = gui.addFolder('Model')
        // landFolder.add(model.position,'x',-0,10,1) // -40
        // landFolder.add(model.position,'y',-100,100,10) // 19
        // landFolder.add(model.position,'z',-10,0,1) // 10

        if (options && options.name === 'gendCar') {
            gendCar.model = new THREE.Object3D()
            gendCar.model.add(model)
            if (options.rot) {
                gendCar.model.rotation.y += options.rot
            }
            scene.add(gendCar.model)
            gendCar.isLoading = false
            // console.log(gendCar)

            button.innerText = buttonText
            button.disabled = gendCarSelect.disabled = false
            button.style.cursor = gendCarSelect.style.cursor = 'pointer'
            document.body.style.cursor = 'move'
        } else if (options && options.name === 'landscape') {
            landscape.model = new THREE.Object3D()
            landscape.model.add(model)
            if (options.rot) {
                landscape.model.rotation.y += options.rot
            }
            scene.add(landscape.model)
            landscape.isLoading = false
            // console.log(landscape)
        } else {
            scene.add(model)
        }
    })
}

function makeShadow(object) {
    object.traverse(o => {
        if (o.isMesh) {
            o.castShadow = true
            o.receiveShadow = true
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
    if (gendCar.model !== undefined && landscape.model !== undefined) {
        const gendCarRotY = gendCar.options.rot ? gendCar.model.rotation.y - gendCar.options.rot : gendCar.model.rotation.y
        const depX = movementX*Math.cos(gendCarRotY)
        const depZ = -movementX*Math.sin(gendCarRotY)

        document.getElementById('debug').innerHTML = `gendCar.model.position.x : ${gendCar.model.position.x}<br>
                                                      gendCar.model.position.y : ${gendCar.model.position.y}<br>
                                                      gendCar.model.position.z : ${gendCar.model.position.z}<br>
                                                      gendCar.model.rotation.y : ${gendCarRotY}<br>
                                                      camera.position.x : ${camera.position.x}<br>
                                                      camera.position.y : ${camera.position.y}<br>
                                                      camera.position.z : ${camera.position.z}<br>`

        let updateCamera = {
            x: true,
            y: true,
            z: true
        }

        if (gendCar.isLoading) {
            return
        }

        gendCar.model.position.x-=depX
        gendCar.model.position.z-=depZ

        if (movementX > 0) {
            gendCar.model.rotation.y -= rotationY
        } else if (movementX < 0) {
            gendCar.model.rotation.y -= -rotationY
        }

        if (landscape.values && landscape.values.bounds) {
            if (landscape.values.bounds.x.max !== undefined) {
                if (gendCar.model.position.x < landscape.values.bounds.x.max) {
                    gendCar.model.position.x = 0
                    camera.position.x -= landscape.values.bounds.x.max 
                    controls.target.x = 0
                    updateCamera.x = false
                }
        
                if (gendCar.model.position.x > 0) {
                    gendCar.model.position.x = landscape.values.bounds.x.max
                    camera.position.x -= -landscape.values.bounds.x.max
                    controls.target.x = landscape.values.bounds.x.max
                    updateCamera.x = false
                }
            }
            if (landscape.values.bounds.z) {
                const boundsZ = landscape.values.bounds.z
                const zIsOverMax = boundsZ.max !== undefined && gendCar.model.position.z >= boundsZ.max
                const zIsUnderMin = boundsZ.min !== undefined && gendCar.model.position.z <= boundsZ.min
                
                const hasChange = landscape.values.change instanceof Array
                let ignoreZmax = false
                let ignoreZmin = false

                if (hasChange) {
                    // const change = landscape.values.change[0]
                    landscape.values.change.forEach(change => {
                        const changeX = change.x
                        const changeZ = change.z
                        const dest = change.dest
                        
                        const xIsOut = changeX
                                    && (changeX.min === undefined || gendCar.model.position.x > changeX.min) 
                                    && (changeX.max === undefined || gendCar.model.position.x < changeX.max)
                        const zIsOut = changeZ
                                    && (changeZ.min === undefined || gendCar.model.position.z > changeZ.min) 
                                    && (changeZ.max === undefined || gendCar.model.position.z < changeZ.max)
    
                        ignoreZmax = ignoreZmax || (xIsOut && Math.min(changeZ.min,changeZ.max) > boundsZ.max)
                        ignoreZmin = ignoreZmin || (xIsOut && Math.max(changeZ.min,changeZ.max) < boundsZ.min)
    
                        if (xIsOut && zIsOut && !landscape.isLoading) {
                            loadSelectedGendCar()
                            loadLandscape(dest)
                            return
                        }
                    })
                }

                if (zIsOverMax && !ignoreZmax) {
                    gendCar.model.position.z = boundsZ.max
                    updateCamera.z = false
                }
                if (zIsUnderMin && !ignoreZmin) {
                    gendCar.model.position.z = boundsZ.min
                    updateCamera.z = false
                }
            }
        }

        if (updateCamera.x) {
            camera.position.x-=depX
            controls.target.x-=depX
        }
        if (updateCamera.z) {
            camera.position.z-=depZ
            controls.target.z-=depZ
        }
        
        controls.update()
    }

    renderer.render(scene, camera)
}

let factormov = 0.5
let factorrot = 0.05
function handleKeyDown(e){
    // console.log(e.keyCode)

    if (e.keyCode == 40) {
        movementX = -factormov
    }
    if (e.keyCode == 38) {
        movementX = factormov
    }

    if (e.keyCode == 39) {
        rotationY = factorrot
    }
    if (e.keyCode == 37) {
        rotationY = -factorrot
    }

    if (e.keyCode == 32) {
        // espace
    }
}

function handleKeyUp(e){
    if (e.keyCode == 40 || e.keyCode == 38) {
        movementX = 0
    }
    if (e.keyCode == 39 || e.keyCode == 37) {
        rotationY = 0
    }
}

function loadSelectedGendCar() {
    button.innerText = 'Patientez...'
    button.disabled = gendCarSelect.disabled = true
    button.style.cursor = document.body.style.cursor = 'wait'
    loadGendCar(gendCarSelect.value)
}

function loadLandscape(name) {
    if (landscape !== undefined && landscape.model !== undefined) {
        scene.remove(landscape.model)
    }
    landscape = loadModel('landscape',name)
    landscape.isLoading = true
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
