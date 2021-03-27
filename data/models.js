export default {
    gendCar: [
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
            name: 'Voiture banalisée',
            path: './model/ds-banal/model.dae',
            options: {
                x: 1.5,
                y: -2.5,
                z: 0,
                rot: -Math.PI/2
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
                change: {
                    x: {
                        min: -193,
                        max: -187
                    },
                // changeZ: {
                //     min: 25,
                //     max: Infinity
                // },
                    z: {
                        min: -Infinity,
                        max: -22
                    },
                    dest: 'Autoroute sortie'
                }
            }
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
                change: {
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
            }
        },
        {
            name: 'Travaux',
            path: './model/travaux/model.dae',
            options: {}
        },
        {
            name: 'Autoroute avec pont',
            path: './model/autoroute-pont/model.dae',
            options: {
                x: -40,
                z: 19,
                y: -10
            }
        },
        {
            name: 'Autoroute A9 - Le Boulou',
            path: './model/autoroute-boulou.kmz',
            options: {
                // y:2,
            }
        },
        {
            name: 'Autoroute',
            path: './model/autoroute/model.dae',
            options: {
                x: -350,
                y: 266
            }
        }
    ]
}
