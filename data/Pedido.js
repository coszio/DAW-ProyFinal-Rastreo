const { Schema, model } = require("mongoose");

const pedidoSchema = new Schema({
    num_pedido: String,
    nombre: String,
    apellido: String,
    email: String,
    buzon: String,
    estatus_paso: {
        type: Number,
        default: 0
    },
    estatus: {
        type: String,
        get: a => {
            switch (this.estatus_paso) {
                case 0: return "Depositado"
                case 1: return "Recibido"
                case 2: return "En reparación"
                case 3: return "Inspeccionado"
                case 4: return "Entregado"
                default: return "Depositado"
            }
        }
    },
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