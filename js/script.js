import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import { ColladaLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/ColladaLoader.js'
import { GUI } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'
// import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js'

let container, stats, controls
let camera, scene, renderer
let gendCar, gendCar2, landscape
let movementX = 0, movementY = 0

init()
animate()

function init() {
    container = document.getElementById('container')

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(8, 10, 8)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()

    // collada

    // loadCollada(loadingManager,'./model/truc/model.dae',{
    //     name:'gend-car',
    //     y:-15.5,
    //     x:-1.1,
    //     z:+1.3
    // })

    // loadCollada(scene,'./model/megSecMont-gend/model.dae',landscape,{})

    loadCollada(scene,'./model/meganeBizarre-gend/model.dae',gendCar,{
        name:'gend-car',
        y:-1,
        x:-2.2,
        z:0
    })

    // loadCollada(scene,'./model/megSecMont-gend/model.dae',gendCar2,{
    //     y:-4
    // })

    // loadCollada(scene,'./model/test/model.dae',gendCar,{})

    loadCollada(scene,'./model/autoroute/model.dae',landscape,{x:-350,y:266})

    // scene.add(createCube(0,0,0,0xffffff))

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
    console.log(controls.target)
    controls.update()

    // grid
    // const gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030)
    // scene.add(gridHelper)

    // GUI

    // const gui = new GUI()
    // const landFolder = gui.addFolder('Autoroute')
    // landFolder.add(landscape.position,'x',-1000,1000,10)
    // landFolder.add(landscape.position,'y',-1000,1000,10)
    // landFolder.add(landscape.position,'z',-1000,1000,10)

    //

    window.addEventListener('resize', onWindowResize)
}

function loadCollada(scene,path,model,options) {
    const loader = new ColladaLoader()
    loader.load(path, function (collada) {
        model = collada.scene

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
        // const landFolder = gui.addFolder('Autoroute')
        // landFolder.add(model.position,'x',-1000,1000,10)
        // landFolder.add(model.position,'y',-1000,1000,10)
        // landFolder.add(model.position,'z',-272,-264,1)
        
        scene.add(model)
        gendCar = scene.getObjectByName('gend-car')
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
        gendCar.position.z-=movementY

        camera.position.x-=movementX
        camera.position.z-=movementY

        controls.target.x-=movementX
        controls.target.z-=movementY
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
}

function handleKeyUp(e){
    movementX = 0
    movementY = 0
}

document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)