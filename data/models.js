export default {
    gendCar: [
        {
            name: 'Expert',
            path: './model/Expert+gendarmerie.kmz',
            options: {
                x: -2.5,
                y: -1.2
            }
        },
        {
            name: 'Kangoo',
            path: './model/KangooGendarmerie.kmz',
            options:{
                x:-2,
                y:-1,
                z:0,
            }
        },
        {
            name:'Berlingo',
            path:'./model/berlingo-gend/model.dae',
            options:{
                x:-0.3,
                y:7,
                z:0,
                rot:-Math.PI/2
            }
        },
        {
            name: 'Citroën C8',
            path: './model/c8-gend/model.dae',
            options: {
                y: -15.5,
                x: -1.1,
                z: 1.3,
                rot: -Math.PI/2
            }
        },
        {
            name: 'Mégane',
            path: './model/meganeBizarre-gend/model.dae',
            options: {
                y: -1,
                x: -2.2,
                z: 0
            }
        },
        {
            name: 'Mégane secours montagne',
            path: './model/megSecMont-gend/model.dae',
            options: {
                x: -0.5,
                y: -1,
                z: 0
            }
        },
        {
            name: 'Mégane banalisée',
            path: './model/megane-banal/model.dae',
            options: {
                x: -4.5,
                y: -8,
                z: 0,
                rot: -Math.PI/2
            }
        },
        {
            name: 'DS banalisée',
            path: './model/ds-banal/model.dae',
            options: {
                x: 1.5,
                y: -2.5,
                z: 0,
                rot: -Math.PI/2
            }
        },
        {
            name: 'Motard',
            path: './model/motard-gend/model.dae',
            options: {
                y: -3.2,
                x: -3
            }
        }
    ],
    landscape: [
        {
            name: 'Départementale',
            path: './model/departementale/model.dae',
            options: {
                y:2,
            },
            values: {
                bounds:{
                    x: {
                        min: 0,
                        max: -330
                    },
                    z: {
                        min: -5,
                        max: 8
                    }
                },
                change: [
                    {
                        x: {
                            min: -193,
                            max: -187
                        },
                        z: {
                            min: -Infinity,
                            max: -22
                        },
                        dest: 'Autoroute sortie'
                    },
                    {
                        x: {
                            min: -193,
                            max: -187
                        },
                        z: {
                            min: 25,
                            max: Infinity
                        },
                        dest: 'Autoroute avec pont'
                    }
                ]
            },
            elements: [
                {
                    name: 'Girl',
                    // name: 'Silly Dance',
                    options: {
                        tx: -176,
                        tz: -4,
                        rot2: Math.PI
                    }
                },
                {
                    name: 'Peugeot 306',
                    options: {
                        tx: -325,
                        tz: 3.5,
                        rot2: Math.PI,
                        move: {
                            forward: 1/8
                        }
                    }
                },
                {
                    name: '4L',
                    options: {
                        tx: -196,
                        tz: -8,
                        rot2: 1.05
                    }
                }
            ]
        },
        {
            name: 'Autoroute sortie',
            path: './model/autoroute-sortie/model.dae',
            options: {
                y:6,
                x:10
            },
            values: {
                bounds:{
                    x: {
                        min: 0,
                        max: -380,
                    },
                    z: {
                        min: -4,
                        maxS1: 5.5,
                        max: 18
                    }
                },
                change: [
                    {
                        x: {
                            min: -380,
                            max: -270
                        },
                        z: {
                            min: -25,
                            max: -16
                        },
                        dest: 'Départementale'
                    }
                ]
            },
            elements: [
                {
                    name: 'Kangoo',
                    options: {
                        rot2: Math.PI,
                        tx: -371,
                        tz: 13.5,
                        move: {
                            forward: 1/4
                        }
                    }
                }
            ]
        },
        {
            name: 'Travaux',
            path: './model/travaux/model.dae',
            options: {
                x: -9,
                y: 143,
                z: -0.25,
                rot: Math.PI/2
            }
        },
        {
            name: 'Autoroute avec pont',
            path: './model/autoroute-pont/model.dae',
            options: {
                x: -36,
                z: 19,
                y: -10,
                rot: Math.PI/2
            },
            values: {
                bounds:{
                    x: {
                        min: 0,
                        max: -377,
                    },
                    z: {
                        min: -4,
                        maxS1: 9,
                        max: 26
                    }
                }
            },
            elements: [
                {
                    name: '2 motards fixes',
                    options: {
                        tx: -162,
                        tz: -5
                    }
                },
                {
                    name: 'Camion',
                    options: {
                        tx: -290,
                        tz: 22.75,
                        rot2: Math.PI,
                        move: {
                            forward: 1/4
                        }
                    }
                },
                {
                    name: 'Girl',
                    options: {
                        tx: -131.5,
                        ty: 6.4,
                        tz: 25,
                        rot2: -Math.PI/2,
                    }
                },
                {
                    name: 'FPTSR',
                    options: {
                        tx: -148,
                        ty: 6.4,
                        tz: 5,
                        rot2: Math.PI/6
                    }
                },
                {
                    name: 'Kangoo Municipale',
                    options: {
                        tx: -146,
                        ty: 6.4,
                        tz: -8,
                        rot2: 0.1
                    }
                },
                {
                    name: 'VSAV',
                    options: {
                        tx: -40,
                        move: {
                            forward: 1/4
                        }
                    }
                }
            ]
        },
        {
            name: 'Autoroute A9 - Le Boulou',
            path: './model/autoroute-boulou.kmz',
            options: {
                x: 18,
                y: 161,
                z: -0.1,
                rot: Math.PI/2
            },
            values: {
                bounds:{
                    x: {
                        min: 0,
                        max: -370,
                    }
                },
            }
        },
        {
            name: 'Autoroute',
            path: './model/autoroute/model.dae',
            options: {
                x: -350,
                y: 266
            }
        },
        {
            name: 'Pont A11',
            path: './model/pont-a11/model.dae',
            options: {}
        }
    ],
    elements: [   
        {
            name: '2 motards fixes',
            path: './model/motards-gend-fixes/model.dae',
            options: {}
        },
        {
            name:'Blake',
            path: './model/blake.glb',
            options:{
                rot: -Math.PI/2,
                animation: true,
                selectedAnimation: 4
                // move: {forward: ?}
            }
        },
        {
            name: 'Girl',
            path: './model/girl.fbx',
            options:{
                rot: -Math.PI/2,
                scale: 0.0014,
                animation: true,
                move: {
                    forward: 1/100
                }
            }
        },
        {
            name: 'Silly Dance',
            path: './model/Silly Dance.fbx',
            options: {
                scale: 0.0014,
                animation: true,
            }
        },
        {
            name: 'Silly Mixamo',
            path: './model/Sillydancing.fbx',
            options: {
                scale: 0.01,
                animation: true
            }
        },
        {
            name: 'Peugeot 306',
            path: './model/peugeot306.kmz',
            options: {
                y: -2,
                rot: -Math.PI/2
            }
        },
        {
            name: 'Dacia Duster',
            path: './model/dacia/model.dae',
            options: {
                x: -1,
                y: -2.5,
                rot: -Math.PI/2
            }
        },
        {
            name: 'Kangoo',
            path: './model/kangoo/model.dae',
            options: {
                x: -2.5,
                y: -1
            }
        },
        {
            name: 'Renault Megane 2009',
            path: './model/Renault+Megane+2009.kmz',
            options: {
                x: -2.5,
                y: -1
            }
        },
        {
            name: 'LADA Piora',
            path: './model/LADA+Piora.kmz',
            options: {
                x: -2.5,
                y: -1
            }
        },
        {
            name: '4L',
            path: './model/Renault+4+L+(m).kmz',
            options: {
                x: -2.5,
                y: -1,
                rot: Math.PI
            }
        },
        {
            name: 'Camion',
            path: './model/Camion+P+16T.kmz',
            options: {
                x: -3.5,
                y: -1.5,
            }
        },
        {
            name: 'FPTSR',
            path: './model/FPTSR.kmz',
            options: {
                x: -3,
                y: -1.5
            }
        },
        {
            name: 'VSAV',
            path: './model/VSAV.kmz',
            options: {
                x: -3,
                y: -1.2
            }
        },
        {
            name: 'Berlingo Police',
            path: './model/Berlingo+Police.kmz',
            options: {
                x: -2.5,
                y: -1
            }
        },
        {
            name: 'Kangoo Municipale',
            path: './model/KangooMunicipale.kmz',
            options:{
                x:-2,
                y:1,
            }
        }
    ]
}
