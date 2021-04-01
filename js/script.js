import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import { ColladaLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/ColladaLoader.js'
import { GUI } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'
import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js'
import { KMZLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/KMZLoader.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'
import models from '../data/models.js'

let container, stats, controls, mixers = []
let camera, scene, renderer
let gendCar, landscape
let movementX = 0, rotationY = 0

const clock = new THREE.Clock()

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

    // Modèles de départ

    loadLandscape()
    loadSelectedGendCar()

    // Lumières

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 0).normalize()
    // directionalLight.castShadow = true
    scene.add(directionalLight)

    // Renderer

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    // renderer.antialias = true
    container.appendChild(renderer.domElement)

    // Composants

    stats = new Stats()
    container.appendChild(stats.dom)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.maxPolarAngle = Math.PI/2-0.02
    controls.minDistance = 5
    controls.maxDistance = 50
    controls.enablePan = false
    controls.target.set(0,1,0)
    controls.update()

    // Helpers

    // const gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030)
    // scene.add(gridHelper)

    // const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    // GUI

    // const gui = new GUI()
    // const orbitFolder = gui.addFolder('Orbit')
    // orbitFolder.add(controls,'minDistance',0,100,5)
    // orbitFolder.add(controls,'maxDistance',0,100,10)

    // Ajouter à la fenêtre

    window.addEventListener('resize', onWindowResize)
}

function loadModel(type,name,options) {
    const model = name ? models[type].find(model => model.name === name) : models[type][0]
    if (model !== undefined) {
        if (model.options === undefined) {
            model.options = {}
        }
        if (type === 'gendCar') {
            model.options.name = 'gendCar'
        } else if (type === 'landscape') {
            model.options.name = 'landscape'
        } else {
            model.options.name = model.name
        }
        loadGeneral(model.path,{...model.options, ...options})
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
    } else if (ext === 'fbx') {
        loader = new FBXLoader()
    } else if (ext === 'glb') {
        loader = new GLTFLoader()
    } else {
        console.error('Type non reconnu')
        return
    }

    loader.load(path, function (general) {
        const model = general.scene ? general.scene : general

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
        // landFolder.add(model.position,'x',-10,10,0.5) // -4.5
        // landFolder.add(model.position,'y',-10,10,0.5) // 0
        // landFolder.add(model.position,'z',-10,10,0.5) // 8

        if (options && options.scale) {
            model.scale.set(options.scale,options.scale,options.scale)
        }

        if (options && options.animation) {
            const mixer = new THREE.AnimationMixer(model)
            let animations
            if (loader instanceof GLTFLoader) {
                animations = general.animations
            } else {
                animations = model.animations
            }
            const action = mixer.clipAction(animations[options.selectedAnimation ? options.selectedAnimation : 0])
            action.play()
            mixers.push(mixer)
        }

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
            const modelElement = new THREE.Object3D()
            if (landscape.elements instanceof Array) {
                landscape.elements.find(element => element.name === options.name).model = modelElement
            }
            const rotElement = new THREE.Object3D()
            rotElement.add(model)
            modelElement.add(rotElement)
            if (options) {
                if (options.rot) {
                    rotElement.rotation.y += options.rot
                }
                if (options.rot2) {
                    rotElement.rotation.y += options.rot2
                }
                if (options.tx) {
                    modelElement.translateX(options.tx)
                }
                if (options.ty) {
                    modelElement.translateY(options.ty)
                }
                if (options.tz) {
                    modelElement.translateZ(options.tz)
                }
            }
            // console.log(modelElement)
            scene.add(modelElement)
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
    const delta = clock.getDelta()
    const factorfps = 60*delta
    let factormov = 0.5
    let factorrot = 0.05
    // movementX = factormov/4

    if (gendCar.model !== undefined && landscape.model !== undefined) {
        const gendCarRotY = gendCar.options.rot ? gendCar.model.rotation.y - gendCar.options.rot : gendCar.model.rotation.y
        const depX = movementX*Math.cos(gendCarRotY)*factormov*factorfps
        const depZ = -movementX*Math.sin(gendCarRotY)*factormov*factorfps

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
            gendCar.model.rotation.y -= rotationY*factorrot
        } else if (movementX < 0) {
            gendCar.model.rotation.y -= -rotationY*factorrot
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

        if (landscape.elements instanceof Array) {
            landscape.elements.forEach(element => {
                let speed = 0
                const mergedOptions = {
                    ...models.elements.find(el => el.name === element.name).options,
                    ...element.options
                }

                if (mergedOptions !== undefined && mergedOptions.move) {
                    speed = mergedOptions.move.forward
                }

                if (speed !== 0 && element.model !== undefined) {
                        const elementRotY = mergedOptions.rot ? element.model.children[0].rotation.y - mergedOptions.rot : element.model.children[0].rotation.y
                        const elementDepX = Math.cos(elementRotY)*speed*factorfps
                        const elementDepZ = -Math.sin(elementRotY)*speed*factorfps
                        element.model.position.x-=elementDepX
                        element.model.position.z-=elementDepZ
                }
            })
        }
        
        controls.update()
    }

    mixers.forEach(mixer => {
        mixer.update(delta)
    })

    renderer.render(scene, camera)
}

function handleKeyDown(e){
    // console.log(e.keyCode)

    if (e.keyCode == 40) {
        movementX = -1
    }
    if (e.keyCode == 38) {
        movementX = 1
    }

    if (e.keyCode == 39) {
        rotationY = 1
    }
    if (e.keyCode == 37) {
        rotationY = -1
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
        if (landscape.elements instanceof Array) {
            landscape.elements.forEach(element => {
                scene.remove(element.model)
            })
        }
    }
    landscape = loadModel('landscape',name)
    if (landscape.elements instanceof Array) {
        landscape.elements.forEach(loadElement)
    }
    landscape.isLoading = true
}

function loadElement(element) {
    const _element = loadModel('elements',element.name,element.options)
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
