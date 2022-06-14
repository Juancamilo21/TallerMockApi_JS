const url = 'https://62a25806cd2e8da9b006d852.mockapi.io/version1/cirugias'

// Obtenemos losvalores del DOM 
const botonCancelar = document.getElementById('cancelar')
const formulario = document.querySelector('form')
const nombre = document.getElementById('nombre')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
let proceso = false

// funcion que se encarga de mostrar los datos en las vistas
let resultado = ''
const mostrarCirugias = (datosCirugias) => {
    datosCirugias.forEach(cirugias => {
        resultado = resultado + `
            <tr>
                <td>${cirugias.id}</td>
                <td>${cirugias.nombre}</td>
                <td>${cirugias.descripcion}</td>
                <td>${cirugias.precio}</td>
                <td class="text-center">
                    <a class="btnActualizar btn btn-primary">Actualizar</a>
                    <a class="btnEliminar btn btn-danger">Eliminar</a>
                </td>
            </tr>
        `
    });
    document.getElementById('datos').innerHTML = resultado
}

// Uso de la funcion fetch y las promise para usar la url de la Api y tomarla como json
fetch(url)
.then(response => response.json())
.then(data => mostrarCirugias(data))
.catch(error => console.log(error))

const acciones = (elemento, evento, selector, manipular) => {
    elemento.addEventListener(evento, e => {
        if(e.target.closest(selector)) {
            manipular(e)
        }
    })
}

// funcion eliminar por el id
const eliminar = (id) => {
    fetch(url+'/'+id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => location.reload())
    mensaje("Se ha eliminado exitosamente")
}

// se realiza la accion de eliminar
acciones(document, 'click', '.btnEliminar', e => {
    const row = e.target.parentNode.parentNode
    const id = row.children[0].innerHTML
    eliminar(id)
})

/* al presionar el boton actualizar se toman los valores de las filas de la tabla
y se agregan al formulario
*/
let idFormulario = 0
acciones(document, 'click', '.btnActualizar', e => {
    const row = e.target.parentNode.parentNode
    idFormulario = row.children[0].innerHTML
    const nombreForm = row.children[1].innerHTML
    const descripcionForm = row.children[2].innerHTML
    const precioForm = row.children[3].innerHTML
    nombre.value = nombreForm
    descripcion.value = descripcionForm
    precio.value = precioForm
    proceso = true
    mensaje("Para actualizarlo vaya al formulario")
})

// el boton cancelar limpia el formulario
botonCancelar.addEventListener('click', () => {
    limpiarFormulario()
    proceso = false
})

// funcion que se encarga de guardar los datos en la Api y agregarlos a la tabla
const agregar = (cirugia) => {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(cirugia)
    })
    .then(response => response.json())
    .then(data => {
        mostrarCirugias(data)
    })
}

// funcion que se encarga de actualizar los datos en la Api
const actualizar = (cirugia) => {
    fetch(url+'/'+idFormulario, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(cirugia)
    })
    .then(response => response.json())
    .then(() => location.reload())
}

// este evento define lo que se hará al momento de presionar el boton realizar del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    let cirugia = { // objeto que toma los valores del formulario
        nombre: nombre.value,
        descripcion: descripcion.value,
        precio: precio.value
    }
    if(!proceso) { // si proceso es false se crea y agrega una nueva cirugia
        agregar(cirugia)
        mensaje("Se ha agregado y guardado exitosamente")
        location.reload()
    }else { // si es verdadero se actualiza
        actualizar(cirugia)
        mensaje("Se ha actualizado exitosamente")
    }
    limpiarFormulario()
})

let limpiarFormulario = () => {
    nombre.value = ''
    descripcion.value = ''
    precio.value = ''
}
let mensaje = (texto) => alert(texto)