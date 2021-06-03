const { Schema, model } = require("mongoose");

const pedidoSchema = new Schema({
    num_pedido: String,
    nombre: String,
    apellido: String,
    email: String,
    buzon: String,
    estatus: String,
    marca: String,
    modelo: String,
    talla: String,
    comentario_cliente: String,
    comentario_resolador: String,
    material_suela: String,
    fecha_registro: {
        type: Date,
        default: Date.now
    },
    servicio: {
        resolado: {
            type: Boolean,
            default: true
        },
        cambio_de_liga: {
            type: Boolean,
            default: false
        },
        parche: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = model('Pedido', pedidoSchema);