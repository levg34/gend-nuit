export default {
    gendCar: [
        {
            name:'Berlingo',
            path:'./model/berlingo-gend/model.dae',
            options:{
                name: 'gend-car',
                x:-0.3,
                y:7,
                z:0,
                rot:-Math.PI/2
            }
        },
        {
            name: 'Citroën C4',
            path: './model/c4-gend/model.dae',
            options: {
                name: 'gend-car',
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
                name: 'gend-car',
                y: -1,
                x: -2.2,
                z: 0
            }
        },
        {
            name: 'Mégane secours montagne',
            path: './model/megSecMont-gend/model.dae',
            options: {
                name: 'gend-car',
                x: -0.5,
                y: -1,
                z: 0
            }
        },
        {
            name: 'Voiture banalisée',
            path: './model/ds-banal/model.dae',
            options: {
                name: 'gend-car',
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
        }
    ]
}
