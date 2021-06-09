const { render } = require('ejs');
const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();

var Pedido = require('../data/Pedido')

// DESCOMENTAR Y CORRER UNA VEZ PARA TENER UN PEDIDO EN LA BASE DE DATOS
// var testData = new Pedido({
//     num_pedido: '12345',
//     nombre: 'Luis',
//     apellido: 'Cossio',
//     email: 'luis.cossio@outlook.com',
//     buzon: 'RockCamp',
//     estatus: 'En proceso',
//     marca: 'Scarpa',
//     modelo: 'Instinct',
//     talla: '43',
//     comentario_cliente: 'Que queden bien chidas',
//     comentario_resolador: 'Quedando super bien',
//     material_suela: 'MadRock'
// });
//
// testData.save((err, document) => {
//     if (err) return console.log(err);
//     console.log("Saved: " + document);
// });

router.get('/', async function (req, res) {

    res.render('index');

});

router.get('/rastreo', async(req, res) => {
    res.render('rastreo');
});

router.get('/rastreo/:idPedido', async (req, res) => {
    let pedido = await Pedido.findById(req.params.idPedido);
    res.render('rastreo', { pedido });
})

router.post('/rastreo',
    body('apellido').not().isEmpty().withMessage('Debe tener apellido'),
    body('pedido').not().isEmpty().withMessage('Debe tener numero de pedido'),
    body('pedido').isLength(5).withMessage('Debe tener 5 caracteres'),
    // body('apellido').toUpperCase(),
    // body('pedido').toUpperCase(),
    async (req, res) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            // TODO: There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`.
            console.log(errors.array());
            res.redirect('/');
        } else {
            // Data from form is valid.

            // Buscar sin importar mayusculas o minusculas
            Pedido.findOne({
                num_pedido: { $regex: `^${req.body.pedido}$`, '$options': 'i' },
                apellido: { $regex: `^${req.body.apellido}$`, '$options': 'i' }
            }, '_id', (err, pedido) => {
                if (err) {
                    // No se encuentra en la base de datos
                    console.log(err);
                    res.redirect('/rastreo');
                } else {
                    res.redirect('/rastreo/' + pedido._id);
                }
            });
            
        }
    
    });
router.get('/admin', (req, res) => {
    res.render('admin');
})

router.post('/admin',
    body('num_pedido', 'El numero de pedido debe tener 5 digitos').isAlphanumeric().isLength(5).notEmpty(),
    body('nombre').isAlpha(),
    body('apellido').isAlpha().notEmpty(),
    body('email').isEmail().normalizeEmail().notEmpty(),
    body('talla').isNumeric(),
    (req, res) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            // TODO: There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`.
            console.log(errors.array());
            res.body.errors = errors.array();
            res.render('admin', { errors, success: false });
        } else {
            // Data from form is valid.
 
            let pedido = req.body;
            var nuevoPedido = new Pedido({
                num_pedido: pedido.num_pedido,
                nombre: pedido.nombre,
                apellido: pedido.apellido,
                email: pedido.email,
                buzon: pedido.buzon,
                estatus: 'Depositado',
                marca: pedido.marca,
                modelo: pedido.modelo,
                talla: pedido.talla,
                comentario_cliente: pedido.comentario_cliente,
                comentario_resolador: pedido.comentario_resolador,
                material_suela: pedido.material_suela
            });
        
            nuevoPedido.save((err, document) => {
                if (err) return console.log(err);
                console.log("Saved: " + document);
            });
            res.render('admin', { success: true });
        }
    })
module.exports = router;