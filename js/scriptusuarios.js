const url = 'https://62a25806cd2e8da9b006d852.mockapi.io/version1/users'

const botonCancelar = document.getElementById('cancelar')
const formulario = document.querySelector('form')
const nombres = document.getElementById('nombres')
const apellido = document.getElementById('apellido')
const edad = document.getElementById('edad')
const cedula = document.getElementById('cedula')
const correo = document.getElementById('email')
let proceso = false

let resultado = ''
const mostrarUsuarios = (datosUsuarios) => {
    datosUsuarios.forEach(usuarios => {
        resultado = resultado + `
            <tr>
                <td>${usuarios.id}</td>
                <td>${usuarios.nombres}</td>
                <td>${usuarios.apellidos}</td>
                <td>${usuarios.edad}</td>
                <td>${usuarios.cedula}</td>
                <td>${usuarios.email}</td>
                <td class="text-center">
                    <a class="btnActualizar btn btn-primary">Actualizar</a>
                    <a class="btnEliminar btn btn-danger">Eliminar</a>
                </td>
            </tr>
        `
    })
    document.getElementById('datos').innerHTML = resultado
}

fetch(url)
.then(response => response.json())
.then(data => mostrarUsuarios(data))
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
    mensaje("Se ha Eliminado exitosamente")
}

acciones(document, 'click', '.btnEliminar', e => {
    const row = e.target.parentNode.parentNode
    const id = row.firstElementChild.innerHTML
    eliminar(id)
})

let idFormulario = 0
acciones(document, 'click', '.btnActualizar', e => {
    const row = e.target.parentNode.parentNode
    idFormulario = row.children[0].innerHTML
    const nombreForm = row.children[1].innerHTML
    const apellidoForm = row.children[2].innerHTML
    const edadForm = row.children[3].innerHTML
    const cedulaForm = row.children[4].innerHTML
    const correoForm = row.children[5].innerHTML
    nombres.value = nombreForm
    apellido.value = apellidoForm
    edad.value = edadForm
    cedula.value = cedulaForm
    correo.value = correoForm
    proceso = true
    mensaje("Para actualizarlo vaya al formulario")
})

botonCancelar.addEventListener('click', () => {
    limpiarFormulario()
    proceso = false
})

const agregar = (usuario) => {
   fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(data => {
        mostrarUsuarios(data)
    })
}

const actualizar = (usuario) => {
    fetch(url+'/'+idFormulario, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(() => location.reload())
}

formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    let usuario = {
        nombres: nombres.value,
        apellidos: apellido.value,
        edad: edad.value,
        cedula: cedula.value,
        email: correo.value
    }
    if(!proceso) {
        agregar(usuario)
        mensaje("Se ha agregado y guardado exitosamente")
        location.reload()
    }else {
        actualizar(usuario)
        mensaje("Se ha actualizado exitosamente")
    }
    limpiarFormulario()
})

let limpiarFormulario = () => {
    nombres.value = ''
    apellido.value = ''
    edad.value = ''
    cedula.value = ''
    correo.value = ''
}
let mensaje = (texto) => alert(texto)