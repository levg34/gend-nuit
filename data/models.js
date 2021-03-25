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
            name: 'Travaux',
            path: './model/travaux/model.dae',
            options: {}
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
            name: 'Autoroute avec pont',
            path: './model/autoroute-pont/model.dae',
            options: {
                x: -40,
                z: 19,
                y: -10
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
                boundsX: {
                    min: 0,
                    max: -370,
                },
                // changeX: {
                //     min: -380
                // },
                // changeZ: {
                //     min: -18
                // },
                boundsZ: {
                    min: -6,
                    max: 5.5
                }
            }
        },
        {
            name: 'Départementale',
            path: './model/departementale/model.dae',
            options: {
                y:2,
            },
            values: {
                boundsX: {
                    min: 0,
                    max: -330
                },
                changeX: {
                    min: -193,
                    max: -187
                },
                boundsZ: {
                    min: -22,
                    max: 25
                }
            }
        },
        {
            name: 'Autoroute A9 - Le Boulou',
            path: './model/autoroute-boulou.kmz',
            options: {
                // y:2,
            }
        },
    ]
}
