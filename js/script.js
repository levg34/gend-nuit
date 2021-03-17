import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import { ColladaLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/ColladaLoader.js'
import { GUI } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'
// import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js'

let container, stats
let camera, scene, renderer, gendCar, light, headlight1, headlight2

let switchBack, frames = 0

init()
animate()

function init() {
    container = document.getElementById('container')

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(8, 10, 8)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()

    // loading manager

    const loadingManager = new THREE.LoadingManager(function () {
        scene.add(gendCar)
    })

    // collada

    // loadCollada(loadingManager,'./model/truc/model.dae',{
    //     name:'gend-car',
    //     y:-15.5,
    //     x:-1.1,
    //     z:+1.3
    // })

    loadCollada(loadingManager,'./model/meganeBizarre-gend/model.dae',{
        name:'gend-car',
        y:-1,
        x:-2.2,
        z:0
    })
    // loadCollada(loadingManager,'./model/megSecMont-gend/model.dae')

    // fbx

    // const loader = new FBXLoader()
    // loader.load( 'model/fbx/Gendarmerie_Dacia_Duster.FBX', function (object) {
    //     object.scale
    //     scene.add(object)
    // })

    // cube

    const cube = createCube(8,0,0,0x44aa88)
    scene.add(cube)
    scene.add(createCube(0,8,0,0xffffff))
    scene.add(createCube(0,0,8,0xff0000))
    scene.add(createCube(0,-8,0,0xf4fa7b))

    // plan 

    const geometry = new THREE.PlaneGeometry(28, 28)
    const material = new THREE.MeshPhongMaterial({color: 'gray',side: THREE.DoubleSide})

    const plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = Math.PI/2
    // plane.translateZ(+0.02)
    plane.receiveShadow = true
    scene.add(plane)

    //

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
    // scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)//0.8)
    directionalLight.position.set(1, 1, 0).normalize()
    // directionalLight.castShadow = true
    // scene.add(directionalLight)

    const sphere = new THREE.SphereGeometry(0.5, 16, 8)

    light = new THREE.PointLight(0xfad6a5, 1, 100)
    light.position.set(8, 8, 8)
    light.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xfad6a5})))
    light.castShadow = true
    scene.add(light)

    const sphere2 = new THREE.SphereGeometry(0.02, 16, 8)
    const colorHeadlight = 0x44b8fc

    headlight1 = new THREE.PointLight(colorHeadlight, 3, 12)
    headlight1.position.set(0.25, 1.54, -0.4)
    headlight1.add( new THREE.Mesh(sphere2, new THREE.MeshBasicMaterial({color: colorHeadlight})))
    headlight1.castShadow = true
    scene.add(headlight1)

    headlight2 = new THREE.PointLight(colorHeadlight)
    headlight2.copy(headlight1)
    headlight2.position.z = 0.36
    headlight2.visible = false
    headlight2.castShadow = true
    scene.add(headlight2)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-4, 0, 0)
    spotLight.angle = Math.PI/6
    spotLight.castShadow = true
    // spotLight.shadow.mapSize.width = 1024
    // spotLight.shadow.mapSize.height = 1024
    // spotLight.shadow.camera.near = 500
    // spotLight.shadow.camera.far = 4000
    // spotLight.shadow.camera.fov = 30
    // scene.add(spotLight)
    
    const spotLightHelper = new THREE.SpotLightHelper(spotLight)
    // scene.add(spotLightHelper)

    //

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    //

    stats = new Stats()
    container.appendChild(stats.dom)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // grid
    const gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030)
    // scene.add(gridHelper)

    // GUI

    const gui = new GUI()
    const pointLightFolder = gui.addFolder('Gyrophares')
    // pointLightFolder.add(headlight1,'visible')
    // pointLightFolder.add(headlight1.position,'x')
    // pointLightFolder.add(headlight1.position,'y')
    // pointLightFolder.add(headlight1.position,'z')
    pointLightFolder.add(headlight1,'intensity',1,10,1)
    // pointLightFolder.add(headlight2.position,'z',0,0.5,0.01)
    pointLightFolder.add(headlight2,'intensity',1,10,1)
    pointLightFolder.add(headlight1,'distance',5,15,1)
    const lightFolder = gui.addFolder('Lampadaire')
    lightFolder.add(light,'visible')
    const spotlightFolder = gui.addFolder('Spotlight')
    // spotlightFolder.add(spotLight,'angle',0,Math.PI,Math.PI/6)

    //

    window.addEventListener('resize', onWindowResize)
}

function loadCollada(loadingManager,path,options) {
    const loader = new ColladaLoader(loadingManager)
    loader.load(path, function (collada) {
        gendCar = collada.scene

        if (options) {
            if (options.name) {
                gendCar.name = options.name
            }
    
            if (options.x) {
                gendCar.translateX(options.x)
            }
            if (options.y) {
                gendCar.translateY(options.y)
            }
            if (options.z) {
                gendCar.translateZ(options.z)
            }
        }

        noWireframe(gendCar)

        makeShadow(gendCar)
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
        // gendCar.rotation.z += delta * 0.5
    }

    if (light !== undefined) {
        if (Math.abs(light.position.x - 8) < 0.05) {
            switchBack = true
        }
        if (Math.abs(light.position.x + 8) < 0.05) {
            switchBack = false
        }
        // if (light.position.x > -8) {
        if (switchBack) {
            light.position.x -= 0.1
        } else {
            light.position.x += 0.1
        }
    }

    if (headlight1 !== undefined && headlight2 !== undefined) {
        if (frames++>12) {
            headlight1.visible = !headlight1.visible
            headlight2.visible = !headlight2.visible
            frames = 0
        }
    }

    renderer.render(scene, camera)
}