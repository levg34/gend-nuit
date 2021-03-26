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

function init() {
    container = document.getElementById('container')
    document.body.style.cursor = 'wait'

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(9, 5, 4.5)
    camera.lookAt(0, 1, 0)

    scene = new THREE.Scene()

    // collada

    loadLandscape('Départementale')
    // loadLandscape('Autoroute sortie')
    // loadLandscape('Autoroute A9 - Le Boulou')
    // loadLandscape('Travaux')
    // loadLandscape('Autoroute')
    // loadLandscape('Autoroute avec pont')
    loadSelectedGendCar('Kangoo')

    // const loader = new KMZLoader()
    // loader.load('./model/KangooGendarmerie.kmz', function (kmz) {
    //     kmz.scene.position.z = -2
    //     kmz.scene.position.x = -18
    //     scene.add(kmz.scene)
    //     // render()
    // })

    // fbx

    // const loader = new FBXLoader()
    // loader.load( 'model/fbx/Gendarmerie_Dacia_Duster.FBX', function (object) {
    //     object.scale
    //     scene.add(object)
    // })

    //

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 0).normalize()
    // directionalLight.castShadow = true
    scene.add(directionalLight)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-2, 1, 0)
    spotLight.target.position.set(-100, 1, 0)
    spotLight.angle = Math.PI/6
    spotLight.castShadow = true
    // scene.add(spotLight)
    // scene.add(spotLight.target)

    // const helper = new THREE.SpotLightHelper(spotLight);
    // scene.add(helper);

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
    // const lightFolder = gui.addFolder('Lights')
    // lightFolder.add(spotLight.position,'x',-5,5,0.5).onChange(() => {
    //     spotLight.target.updateMatrixWorld
    //     helper.update
    // })
    // lightFolder.add(spotLight.position,'y',-5,5,0.5).onChange(() => {
    //     spotLight.target.updateMatrixWorld
    //     helper.update
    // })
    // lightFolder.add(spotLight.position,'z',-5,5,0.5).onChange(() => {
    //     spotLight.target.updateMatrixWorld
    //     helper.update
    // })
    // lightFolder.add(spotLight.target.position,'x',-50,50,0.5)
    // lightFolder.add(spotLight.target.position,'y',-50,50,0.5)
    // lightFolder.add(spotLight.target.position,'z',-50,50,0.5)
    // const landFolder = gui.addFolder('Autoroute')
    // landFolder.add(landscape.position,'x',-1000,1000,10)
    // landFolder.add(landscape.position,'y',-1000,1000,10)
    // landFolder.add(landscape.position,'z',-1000,1000,10)
    // const orbitFolder = gui.addFolder('Orbit')
    // orbitFolder.add(controls,'minDistance',0,100,5)
    // orbitFolder.add(controls,'maxDistance',0,100,10)

    //

    window.addEventListener('resize', onWindowResize)
}

function loadModel(type,name) {
    const model = models[type].find(model => model.name === name)
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
            updateCamera = {
                x:false,
                y:false,
                z:false
            }
        }

        gendCar.model.position.x-=depX
        gendCar.model.position.z-=depZ

        if (movementX > 0) {
            gendCar.model.rotation.y -= rotationY
        } else if (movementX < 0) {
            gendCar.model.rotation.y -= -rotationY
        }

        if (landscape.values) {
            if (landscape.values.boundsX.max !== undefined) {
                if (gendCar.model.position.x < landscape.values.boundsX.max) {
                    gendCar.model.position.x = 0
                    camera.position.x -= landscape.values.boundsX.max 
                    controls.target.x = 0
                    updateCamera.x = false
                }
        
                if (gendCar.model.position.x > 0) {
                    gendCar.model.position.x = landscape.values.boundsX.max
                    camera.position.x -= -landscape.values.boundsX.max
                    controls.target.x = landscape.values.boundsX.max
                    updateCamera.x = false
                }
            }
            if (landscape.values.boundsZ) {
                const xIsOut = landscape.values.changeX  
                               && (landscape.values.changeX.min === undefined || gendCar.model.position.x > landscape.values.changeX.min) 
                               && (landscape.values.changeX.max === undefined || gendCar.model.position.x < landscape.values.changeX.max)
                const zIsOverMax = landscape.values.boundsZ.max !== undefined && gendCar.model.position.z >= landscape.values.boundsZ.max
                const zIsUnderMin = landscape.values.boundsZ.min !== undefined && gendCar.model.position.z <= landscape.values.boundsZ.min

                if (xIsOut && (zIsUnderMin || zIsOverMax) && !landscape.isLoading) {
                    console.log(landscape)
                    loadSelectedGendCar()
                    if (landscape.name === 'Départementale') {
                        loadLandscape('Autoroute sortie')
                    } else if (landscape.name === 'Autoroute sortie') {
                        loadLandscape('Départementale')
                    }
                    return
                }

                if (zIsOverMax) {
                    gendCar.model.position.z = landscape.values.boundsZ.max
                    updateCamera.z = false
                }
                if (zIsUnderMin) {
                    gendCar.model.position.z = landscape.values.boundsZ.min
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

function loadSelectedGendCar(name) {
    button.innerText = 'Patientez...'
    button.disabled = gendCarSelect.disabled = true
    button.style.cursor = document.body.style.cursor = 'wait'
    loadGendCar(name ? name : gendCarSelect.value)
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
