const url = 'https://62a25806cd2e8da9b006d852.mockapi.io/version1/cirugias'

const botonCancelar = document.getElementById('cancelar')
const formulario = document.querySelector('form')
const nombre = document.getElementById('nombre')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
let proceso = false

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

const eliminar = (id) => {
    fetch(url+'/'+id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => location.reload())
    mensaje("Se ha eliminado exitosamente")
}

acciones(document, 'click', '.btnEliminar', e => {
    const row = e.target.parentNode.parentNode
    const id = row.children[0].innerHTML
    eliminar(id)
})

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

botonCancelar.addEventListener('click', () => {
    limpiarFormulario()
    proceso = false
})

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
    location.reload()
}

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

formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    let cirugia = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        precio: precio.value
    }
    if(!proceso) {
        agregar(cirugia)
        mensaje("Se ha agregado y guardado exitosamente")
    }else {
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