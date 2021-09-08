const { render } = require('ejs');
const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secret = 'DAW-ProyFinal-Rastreo'
const key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);;
const iv = crypto.randomBytes(16);

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
                    var cipher = crypto.createCipheriv(algorithm, key, iv);  
                    var encrypted_id = cipher.update(pedido._id.toString(), 'utf8', 'hex') + cipher.final('hex');
                    res.redirect('/rastreo/' + encrypted_id);
                }
            });
            
        }
    
    });
router.get('/admin', async (req, res) => {
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var decrypted = decipher.update(req.params.idPedido, 'hex', 'utf8') + decipher.final('utf8');
    let pedido = await Pedido.findById(cryptr.decrypt(decrypted));
    res.render('admin', { pedidos });
})
router.post('/actualizar-estatus', async (req, res) => {
    var cambios = req.body;
    console.log(cambios)
    cambios.forEach(async (row) => {
        try {
            var pedido = await Pedido.findOne({
                num_pedido: { $regex: `^${row.num_pedido}$`, '$options': 'i' },
                apellido: { $regex: `^${row.apellido}$`, '$options': 'i' }
            });
            pedido.estatus_paso = row.estatus;
            try {
                await pedido.save();
            } catch {
                console.log('failed save');
                res.send(false);
                return
            }
        } catch (err) {
            console.log('failed find');
            res.send(false);
            return console.log(err);
        }
    });
    
    res.send(true);
})
router.post('/admin',
    body('num_pedido', 'El numero de pedido debe tener 5 digitos').isAlphanumeric().isLength(5).notEmpty(),
    body('nombre').isAlpha(),
    body('apellido').isAlpha().notEmpty(),
    body('email').isEmail().normalizeEmail().notEmpty(),
    body('talla').isNumeric(),
    async (req, res) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            // TODO: There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`.
            console.log(errors.array());
            res.send(false);
        } else {
            
            // Data from form is valid.
            let pedido = req.body;
            var nuevoPedido = new Pedido({
                num_pedido: pedido.num_pedido,
                nombre: pedido.nombre,
                apellido: pedido.apellido,
                email: pedido.email,
                buzon: pedido.buzon,
                estatus_paso: 0,
                marca: pedido.marca,
                modelo: pedido.modelo,
                talla: pedido.talla,
                comentario_cliente: pedido.comentario_cliente,
                comentario_resolador: pedido.comentario_resolador,
                material_suela: pedido.material_suela,
                servicio: {
                    cambio_de_liga: (pedido.servicioextra == 'cambio_de_liga'),
                    parche: (pedido.servicioextra == 'parche')
                }
            });
        
            nuevoPedido.save(async (err, document) => {
                if (err) {
                    res.send(false);
                    return console.log(err);
                }
                console.log("Saved: " + document);

                // recargar pagina con pedidos actualizados
                var pedidos = await Pedido.find();
                res.send( true );
            });
        }
    })
module.exports = router;
