import * as THREE from 'three'
import gsap from 'gsap'
import { degToRad, floorPowerOfTwo, radToDeg } from 'three/src/math/MathUtils';


//Font
import typefaceFont from 'three/examples/fonts/neusa-next-medium.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { InstancedMesh } from 'three';
import { _forEachName } from 'gsap/gsap-core';
import { TimelineMax } from 'gsap/gsap-core';



//Variables 

let lI = document.getElementById("jobs-input").selectedIndex 
console.log(lI)

//console.log(lI)               //last Jobs selcted
let lV = document.getElementById("jobs-input").children[lI].className
console.log(lV)

const easeOut = "elastic.out(1, 1)"
const easeIn = "elastic.in(1, 1)"


let lT //Last Target
let isWiggling = false
let isWigglingCounter = 0
let wCM = 30
const fontLoader = new FontLoader()


let fontData


let mouseX
let mouseY

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color()

//Lights

const ambientLight = new THREE.AmbientLight('white', .85);

const directionalLight = new THREE.DirectionalLight('white', 1)
directionalLight.position.x = -1
directionalLight.position.z = 2
directionalLight.position.y = 3

// Schatten Optimierung
// Schatte Map Größe
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024*1
directionalLight.shadow.mapSize.height = 1024*1

//Bereich in dem der Schatten Berechnet wird
const directionalLightShadowSize = 2.25
directionalLight.shadow.camera.right = directionalLightShadowSize
directionalLight.shadow.camera.left = - directionalLightShadowSize
directionalLight.shadow.camera.top = directionalLightShadowSize
directionalLight.shadow.camera.bottom = - directionalLightShadowSize

directionalLight.shadow.camera.near = 1.
directionalLight.shadow.camera.far = 8


//Schatten Smoothing
directionalLight.shadow.radius = 5
directionalLight.shadow.blurSamples = 25


scene.add(ambientLight, directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

directionalLightCameraHelper.visible = false


/**
 * Sizes
 */
const sizes = {
    width: 600,
    height: 600
}


/**
 * Camera//////////////////////////////////////////////////////////////////////////////////////////
 */
//const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 13)
const camera = new THREE.OrthographicCamera(-2, 2, 2, -2)
camera.position.z = 3
camera.position.x = 1
camera.position.y = 1

const cameraHelper = new THREE.CameraHelper(camera)

scene.add(camera, cameraHelper)

cameraHelper.visible = false

/**
 * Renderer//////////////////////////////////////////////////////////////////////////////////////////
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true

})
renderer.setSize(sizes.width, sizes.height, false)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.antialias = true


//Render Shadow
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true


//Materials

//Boden Material
const fMat = new THREE.MeshLambertMaterial({color: "white"})

//Generel
const material = new THREE.MeshStandardMaterial({color: "white"})
let roughness = 1
let metalness = 0
material.roughness = .65
material.metalness = .45

//Adabay Grey
const gMat = new THREE.MeshStandardMaterial({color: "rgb(50, 53, 61)"})
gMat.roughness = roughness
gMat.metalness = metalness

//Adabay Orange Hell
const oDMat = new THREE.MeshStandardMaterial({color: "rgb(241, 117, 58)"})
oDMat.roughness = roughness
oDMat.metalness = metalness

//Adabay Orange Dunkel
const oHMat = new THREE.MeshStandardMaterial({color: "rgb(249, 165, 73)"})
oHMat.roughness = roughness
oHMat.metalness = metalness

//Adabay Blau
const bMat = new THREE.MeshStandardMaterial({color: "rgb(76, 127, 155)"})
bMat.roughness = roughness
bMat.metalness = metalness

//Adabay Creme
const cMat = new THREE.MeshStandardMaterial({color: "rgb(205, 200, 206)"})
cMat.roughness = roughness
cMat.metalness = metalness

//Adabay Red
const rMat = new THREE.MeshStandardMaterial({color: "rgb(233, 48, 66)"})
rMat.roughness = roughness
rMat.metalness = metalness

//Adabay Green
const grMat = new THREE.MeshStandardMaterial({color: "rgb(38, 199, 154)"})
grMat.roughness = roughness
grMat.metalness = metalness


// 3D Objects Loader
const gltfLoader = new GLTFLoader();
let aL = [
    null,   // 0 Tastatur 
    null,   // 1 Donut
    null,   // 2 Teller
    null,   // 3 Bildschirm
    null,   // 4 Umschlag
    null,   // 5 Pflanze
    null,   // 6 Stifte
    null,   // 7 Initativ
    null,   // 8 Design
    null,   // 9 Techi
    null,   // 10 Marketing
    null,   // 11 IT
    null,   // 12 Sales
    null,   // 13 Kontaktbuch
    null,   // 14 Name
    null,   // 15 Mail
    null    // 16 Maus
]


const jobs = [
    ["design", 8],
    ["techi", 9],
    ["marketing", 10],
    ["sales", 12],
    ["it", 11],
    ["initativ", 7] 
]

const inputs = [
    ["email_name", 15],
    ["first_name", 14],
    ["cv_name", 4],
    ["phonenumber_name", 13]
]




let assetLoaded = false;
let assetLoadState = 0;


//Teller
let teller
gltfLoader.load(
    '/models/Donut/Teller.gltf',
    (gltf) =>
    {
        aL[2] = gltf.scene.children[0].geometry
        assetLoadState++;
    }
)

//Tastatur 
loadGlft(0, aL, '/models/Tastatur.gltf')

//Donut 
loadGlft(1, aL, '/models/Donut/Donut.gltf')

//Bildschirm
loadGlft(3, aL, '/models/Bildschirm/Bildschirm.gltf')
    
//Umschlag
loadGlft(4, aL, "/models/Folder.gltf")

//Pflanze
loadGlft(5, aL, "/models/Pflanze.gltf")

//Stifte
loadGlft(6, aL, "/models/Stifte.gltf")

//Puzzel
loadGlft(7, aL, "/models/Puzzel.gltf")

//Design
loadGlft(8, aL, "/models/Design.gltf")

//Techi
loadGlft(9, aL, '/models/Techi.gltf')

//Marketing
loadGlft(10, aL, "/models/Marketing.gltf")

//IT
loadGlft(11, aL, "/models/IT.gltf")

//Sales
loadGlft(12, aL, "/models/Sales.gltf")

//Kontaktbuch
loadGlft(13, aL, "/models/Kontaktbuch.gltf")

//Name
loadGlft(14, aL, "/models/Name.gltf")

//Mail
loadGlft(15, aL, "/models/Mail.gltf")

//Maus
loadGlft(16, aL, "/models/Maus.gltf")



//Text

let tNO
let tNM
let tNW
let tNT = "Name"
let tL = true
const textSize = 0.025
const maxLetters = 10


fontLoader.load(
    'fonts/neusa-next-medium.typeface.json',
    (font) => {
        fontData = font
        tNM = new TextGeometry(
            tNT,
            {
                font: font,
                size: textSize,
                height: 0,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 0,
                name: "text"
            }
        )

       
     
        tNM.center()
        tNO = new THREE.Mesh(tNM, cMat)
        tNO.castShadow = true
        cR(tNO, [0, 90, 0])
        cP(tNO, [.005, 0, -.01])    
    
        tL = false
    }
)





/**
 * Create Assets ///////////////////////////////////////////////////////////////
 */


function createAssets() {
    //const result = await resolveAfter2Seconds()

    /**
     * Base
     */

    //Boden
    const geometryFloor = new THREE.PlaneGeometry(10, 10)
    const floor = new THREE.Mesh(geometryFloor, fMat);

    oConfig(
        floor,
        false,
        true,
        [0, 0, 0],
        [degToRad(-90), 0 , 0],
        1
    )
    
    scene.add(floor)


    //Tastatur
    const gT = new THREE.Group()
    const gTL = []

    oConfigNew(0, gT, gTL, aL, true, true, [0 , 0, 0], [0 , 0, 0], 1)
    gConfig(gT, [0 , 0, .5], [0 , 90, 0], 5)
    scene.add(gT)

    //scene.add(teller)



    //Bildschirm
    const bG = new THREE.Group()
    const bGL = []
    oConfigNew(
        3,
        bG,
        bGL,
        aL,
        true,
        true,
        [
            0, 
            0,
            0
        ],
        [
            0, 
            0, 
            0
        ],
        6
    )

    gConfig(
        bG,
        [
            0, 
            .7, 
            -.6        ],
        [
            0, 
            -90, 
            0
        ],
        1
    )
    //console.log(bG)
    scene.add(bG)

    


    //Umschlag
    const uG = new THREE.Group()
    const uGL = []
    oConfigNew(
        4,
        uG,
        uGL,
        aL,
        true,
        true,
        [
            0,
            0,
            0
        ],
        [
            0,
            0,
            0
        ],
        1
    )

    gConfig(
        uG,
        [
            -1,
            1,
            0
        ],
        [
            45,
            -45,
            -65
        ],
        0
    )

    scene.add(uG)


    //Pflanze

    let gP = new THREE.Group()
    let gPL = []

    oConfigNew(5, gP, gPL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(gP, [-1, 0, -1], [0, 0, 0], 4)
    scene.add(gP)


    //Puzzel

    const gPS = new THREE.Group()
    const gPSL = []
    
    oConfigNew(7, gPS, gPSL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(gPS, [0.12, .8, 0], [0, -90, 0], 0)
    scene.add(gPS)

  

    //Stifte

    const gS = new THREE.Group()
    const gSL = []
    oConfigNew(6, gS, gSL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(gS, [.8, 0, -.5], [0, 0, 0], 5)
    scene.add(gS)
    


    //Farbe///
    const dG = new THREE.Group()
    const dFPa = []
    oConfigNew(8, dG, dFPa, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(
        dG,
        [.1, .75, 0],
        [0, -90, 0],
        0
    )

    scene.add(dG)
    


    //Techi
    const tG = new THREE.Group()
    const tGL = []
    oConfigNew(
        9, 
        tG, 
        tGL, 
        aL, 
        true, 
        false,
        [
            0,
            0,
            0
        ],
        [
            0,
            0,
            0
        ],
        1
    )

    gConfig(
        tG,
        [
            -0.05,
            .69,
            -.45
        ],
        [
            90,
            0,
            0
        ],
        0
    )

    scene.add(tG)

    //Marketing
    const mG = new THREE.Group()
    const mGL = []

    oConfigNew(10, mG, mGL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(
        mG, 
        [.08, .85, 0], 
        [
            90, 
            -90, 
            0
        ],
        0
    )

    scene.add(mG)

    //IT
    const itG = new THREE.Group()
    const itGL = []

    oConfigNew(11, itG, itGL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(
        itG, 
        [0.1, .75, 0], 
        [
            -90, 
            -90, 
            -90
        ],
        0
    )
    scene.add(itG)

    //Sales////////////
    const sG = new THREE.Group()
    const sGL = []

    oConfigNew(12, sG, sGL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(
        sG, 
        [.14, .75, 0], 
        [
            -90, 
            -90, 
            -90
        ],
        0
    )
    scene.add(sG)


    //Kontaktbuch////////////
    const kB = new THREE.Group()
    const kBG = []

    oConfigNew(13, kB, kBG, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(kB, [.17, 2, 0], [ -90, -90, -90 ], 0)
    scene.add(kB)

    //Mail
    const gM = new THREE.Group()
    const gML = []

    //gM.children[1].material = cMat
    oConfigNew(15, gM, gML, aL, true, true, [0, 0, 0], [0, 0, 0], 1.25)
    gConfig(gM, [1.25, 1.25, 0], [0, -90, 0], 0)
    scene.add(gM)
    console.log(gM.children)
    gM.children[1].material = cMat


    //Name

    const gN = new THREE.Group()
    const gNL = []
    oConfigNew(14, gN, gNL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gN.add(tNO)
    gConfig(gN, [-.75, 1.5, 0], [0, -90, 0], 0)
    scene.add(gN)

    
    let nS = gN.children[1]
    cP(nS, [-.009, 0, .009])
    nS.scale.z = 1.5
    nS.scale.y = 1.1
    nS.scale.x = 2
    let nP = gN.children[0]
    cP(nP, [0.001, 0.001, .028])
    // tNO
    

    //Maus 
    
    const gMa = new THREE.Group()
    const gMaL = []

    oConfigNew(16, gMa, gMaL, aL, true, true, [0, 0, 0], [0, 0, 0], 1)
    gConfig(gMa, [1, 0, 0.5], [0, -90, 0], 5)
    scene.add(gMa)

    jobs.every(element  => {
        if(element.includes(lV)) {
            let job = scene.getObjectByName(element[1])
            cS(job, 6)

            return false
        } 
        return true
    })


}

//Loade and Create Functions/////////////////////////////////////////////////////

function checkLoadedAssets(list) {
   
    if (list.every(item => item !== null && item !== undefined && assetLoadState >= list.length)) {
        console.log("loading done!");
        assetLoaded = true;
        lB.visible = false
        lBB.visible = false
        createAssets();
    } else {
        console.log("loading...");
        assetLoaded = false;
    }
}

const lL = 10

let loadingBoxGeometry = new THREE.PlaneGeometry(.1, .1)
let loadingBoxGeometryBack = new THREE.PlaneGeometry(lL/10, .1)
let lB = new THREE.Mesh(loadingBoxGeometry, oDMat);
let lBB =  new THREE.Mesh(loadingBoxGeometryBack, gMat);


lB.position.y = 1
lBB.position.y = 1

scene.add(lB)
scene.add(lBB)


//Load Models
function loadGlft(index, aL, path) {
    aL[index] = []
    //console.log(aL[index])
    gltfLoader.load(
        path,
        (gltf) =>
        {   
            //console.log(gltf.scene.children[0])
            for(let i = 0; i < gltf.scene.children[0].children.length; i++) {
                aL[index].push(gltf.scene.children[0].children[i])
                
            }
            assetLoadState++
        }
       
    )
   

}


//Configs
function oConfig(object, castShadow, receiveShadow, position, rotation, scale) {

    object.castShadow = castShadow
    object.receiveShadow = receiveShadow

    object.position.x = position[0]
    object.position.y = position[1]
    object.position.z = position[2]

    object.rotateX(rotation[0])
    object.rotateY(rotation[1])
    object.rotateZ(rotation[2])

    object.scale.x = scale
    object.scale.y = scale
    object.scale.z = scale

}

//Config Objects and add Group
function oConfigNew(index, group, list, object, castShadow, receiveShadow, position, rotation, scale) {
    group.name = index
    //console.log(group.name)
    for(let i = 0; i < object[index].length; i++) {
        list.push(new THREE.Mesh(object[index][i].geometry, object[index][i].material))
        
        list[i].castShadow = castShadow
        list[i].receiveShadow = receiveShadow

        list[i].position.x = position[0]
        list[i].position.y = position[1]
        list[i].position.z = position[2]

        list[i].rotateX(degToRad(rotation[0]))
        list[i].rotateY(degToRad(rotation[1]))
        list[i].rotateZ(degToRad(rotation[2]))

        list[i].scale.x = scale
        list[i].scale.y = scale
        list[i].scale.z = scale
        
        group.add(list[i])

    }

    

}

//Config Group Values
function gConfig(group, position, rotation, scale) {

    
    group.position.x = position[0]
    group.position.y = position[1]
    group.position.z = position[2]

    group.rotateX(degToRad(rotation[0]))
    group.rotateY(degToRad(rotation[1]))
    group.rotateZ(degToRad(rotation[2]))

    group.scale.x = scale
    group.scale.y = scale
    group.scale.z = scale

}

//New Scale
function cS(ob, scale) {
    ob.scale.x = scale
    ob.scale.y = scale
    ob.scale.z = scale
}

//New Position
function cP(ob, position) {
    ob.position.x = position[0]
    ob.position.y = position[1]
    ob.position.z = position[2]
}

//New Rotate
function cR(ob, rotation) {
    ob.rotateX(degToRad(rotation[0]))
    ob.rotateY(degToRad(rotation[1]))
    ob.rotateZ(degToRad(rotation[2]))
}

function gR(ob) {
    let x = ob.rotation.x
    let y = ob.rotaion.y
    let z = ob.rotation.z
    return [x, y, z]
}


//Animate Scene///////////////////////////////////////////////////////////////

const tick = () =>
{
    if(isWiggling == true) {
        wiggleCool()
    }

    if(assetLoaded === false) {
        lB.scale.x = assetLoadState/(aL.length/lL)
        checkLoadedAssets(aL)

    }

     //Camera
     camera.lookAt( new THREE.Vector3(0,.55,0))
     lB.lookAt(camera.position)
     lBB.lookAt(camera.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    
}

tick()




//Event Listeners ///////////////////////////////////////////////////////////


// select Department
function sD() {
    const sI = document.getElementById("jobs-input").selectedIndex
    const sV = document.getElementById("jobs-input").children[sI].className
    //console.log(sV)
    if(lV !== sV) {
        //console.log("change: '" + lV + "' to '" + sV + "'")
        
        jobs.forEach(element => {
            if(element.includes(lV)){
                const job = scene.getObjectByName(element[1])
                aniOut(job, 0) 
            }

            if(element.includes(sV)){
                const job = scene.getObjectByName(element[1])

                aniIn(job, 6)         
            }

            
        })

        lV = document.getElementById("jobs-input").children[sI].className
    }
    
}

window.addEventListener("change", (input) => {
    //console.log(input.target.id)
    if(input.target.id == "jobs-input") {
        sD()
    }
})


window.addEventListener("focusin", (element) => {
    
    let tN= element.target.name
    let tV= element.target.value
    let o
    if(assetLoaded === true && element.target.name != "image-upload") {
        inputs.forEach(i => {
            if(i[0] === tN) {
                o = scene.getObjectByName(i[1])
    
                if(tV === "" && o.scale.x <= 0 && o != undefined) {
                    aniIn(o, 5)
                }
            }
        });
    }
    

})

window.addEventListener("focusout", (element) => {
    let lTN= element.target.name
    let lTV= element.target.value

    console.log(element.target.name)
    console.log(element.target.value)
    let o
    if(assetLoaded === true && element.target.name != "image-upload") {
        inputs.forEach(i => {
            if(i[0] === lTN) {
                o = scene.getObjectByName(i[1])
            }
        });
    
        if(lTV === "" && o.scale.x > 0 && o != undefined) {
            aniOut(o, 0)
        }
    }
})

window.addEventListener("keyup", (element) => {
    let aE = document.activeElement

    if(assetLoaded === true) {
        if(aE.name === "first_name" && tL == false) {
            tL = true
            newText(aE.value)
        }
    
        inputs.forEach(element => {
            if(element.includes(aE.name) && isWiggling == false) {
                let o = scene.getObjectByName(element[1])
                isWiggling = true
                wiggleObject(o)
            }
        });
    }
}) 
    
window.addEventListener("click", (element) => {
   console.log(document.getElementsByName("image-upload").length)
})



function mapMousePos(rangeX1, rangeX2, rangeY1, rangeY2) {

    const mappedMouseX = THREE.MathUtils // X Postion
    .mapLinear(
        mouseX, // Mit gegebener Wert
        0, // min. Grenzwert des Inputs
        window.innerWidth, // max. Grenzwert des Inputs
        rangeX1, // min. Grenzwert des Outputs
        rangeX2) // max. Grenzwert des Outputs

    const mappedMouseY = THREE.MathUtils // Y Postion
    .mapLinear(
        mouseY, // Mit gegebener Wert
        0, // min. Grenzwert des Inputs
        window.innerHeight, // max. Grenzwert des Inputs
        rangeY1, // min. Grenzwert des Outputs
        rangeY2) // max. Grenzwert des Outputs

    return [mappedMouseX, mappedMouseY] //Output als Array

}


window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
    
    mouseX = event.clientX;
    mouseY = event.clientY;
    //console.log(mouseX)
    //console.log(mouseX, mouseY);

}


function aniOut(g ,s) {
    gsap.to(g.scale,
    {
        duration: 0.2,
        ease: easeIn,
        x: s,
        y: s,
        z: s
    })
}

function aniIn(g ,s) {
    gsap.to(g.scale,
    {
        duration: 0.55,
        ease: easeOut,
        x: s,
        y: s,
        z: s
    }).delay(.15)
    
}

function newText(newText) {
    let gN = scene.getObjectByName(14)
    let tNO = gN.children[2]
    let pP = gN.children[0].position.z + 0
    //console.log(pP)
    gN.remove(tNO)
    let nT

    if(newText === "") {
        nT = "Name"
    } else if( newText.length > maxLetters) {
        nT = newText.slice(0, maxLetters) + "..."
        console.log(nT)
    } else {
        //console.log(newText)
        nT = newText
    }


   
    const tNM = new TextGeometry(
        nT,
       {
            font: fontData,
            size: textSize,
            height: 0,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 0,
            name: "text"
        }
    )
    tNM.center()
    tNO = new THREE.Mesh(tNM, cMat)

    const boundingBox = new THREE.Box3().setFromObject(tNO)
    let boxWidth = boundingBox.getSize(new THREE.Vector3).x + 0
    gN.children[1].scale.z = boxWidth*10 + .8
            
    let nP = gN.children[0]
    cP(nP, [0.001, 0.001, boxWidth/2.5] )
       
    //console.log(box.scale.z)

    tNO.castShadow = true
          
    cR(tNO, [0, 90, 0])
    cP(tNO, [.006, 0, -.008])  
    gN.add(tNO)
            
    tL = false     
    
}

function wiggleObject(object, ap) {

    
    let rX = Math.random()/10-.05
    let rY = Math.random()/10-.05
    let rZ = Math.random()/10-.05

    let x1 = object.rotation.x + rX
    let y1 = object.rotation.y + rY
    let z1 = object.rotation.z + rZ

    let x2 = object.rotation.x - rX
    let y2 = object.rotation.y - rY
    let z2 = object.rotation.z - rY
    gsap.timeline() // Mehrere Animationen können hintereinander geschalten werden

    .from(object.rotation,
    {
        duration: 0.15,
        ease: easeIn,
        x: x1,
        y: y1,
        z: z1
    }) //Start/End Pos

    .to(object.rotation,
    {
        duration: 0.15,
        ease: easeIn,
        x: x2,
        y: y2,
        z: z2
    }) // Zwischen Pos
    
}

function wiggleCool() {
    isWigglingCounter++
    if(isWigglingCounter > wCM) {
        isWiggling = false
        isWigglingCounter = 0
    }

}

//File upload

document.getElementById('cv-input').addEventListener('change', function() {
    const fileName = this.files.length ? this.files[0].name : "Keine Datei ausgewählt";
    document.getElementById('file-name-display').textContent = fileName;
});