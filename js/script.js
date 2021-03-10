import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import { ColladaLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/ColladaLoader.js'
// import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js'

let container, stats
let camera, scene, renderer, gendCar, light

let switchBack

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

    const sphere = new THREE.SphereGeometry( 0.5, 16, 8 )

    light = new THREE.PointLight(0xfad6a5, 1, 100)
    light.position.set(8, 8, 8)
    light.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xfad6a5})))
    light.castShadow = true
    scene.add(light)

    const light2 = new THREE.PointLight(0xfad6a5, 1, 100)
    light2.position.set(-8, 8, 8)
    light2.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xfad6a5})))
    // scene.add(light2)

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

    renderer.render(scene, camera)
}