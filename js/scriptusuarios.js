const url = 'https://62a25806cd2e8da9b006d852.mockapi.io/version1/users'

// Obtenemos losvalores del DOM 
const botonCancelar = document.getElementById('cancelar')
const formulario = document.querySelector('form')
const nombres = document.getElementById('nombres')
const apellido = document.getElementById('apellido')
const edad = document.getElementById('edad')
const cedula = document.getElementById('cedula')
const correo = document.getElementById('email')
const telefono = document.getElementById('telefono')
let proceso = false

// funcion que se encarga de mostrar los datos en las vistas
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
                <td>${usuarios.telefono}</td>
                <td class="text-center">
                    <a class="btnActualizar btn btn-primary">Actualizar</a>
                    <a class="btnEliminar btn btn-danger">Eliminar</a>
                </td>
            </tr>
        `
    })
    document.getElementById('datos').innerHTML = resultado
}

// Uso de la funcion fetch y las promise para usar la url de la Api y tomarla como json
fetch(url)
.then(response => response.json())
.then(data => mostrarUsuarios(data))
.catch(error => console.log(error))

// funcion que define las acciones de los botones Eliminar y Actualizar
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
    mensaje("Se ha Eliminado exitosamente")
}

// se realiza la accion de eliminar
acciones(document, 'click', '.btnEliminar', e => {
    const row = e.target.parentNode.parentNode
    const id = row.firstElementChild.innerHTML
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
    const apellidoForm = row.children[2].innerHTML
    const edadForm = row.children[3].innerHTML
    const cedulaForm = row.children[4].innerHTML
    const correoForm = row.children[5].innerHTML
    const telefonoForm = row.children[6].innerHTML
    nombres.value = nombreForm
    apellido.value = apellidoForm
    edad.value = edadForm
    cedula.value = cedulaForm
    correo.value = correoForm
    telefono.value = telefonoForm
    proceso = true
    mensaje("Para actualizarlo vaya al formulario")
})

// el boton cancelar limpia el formulario
botonCancelar.addEventListener('click', () => {
    limpiarFormulario()
    proceso = false
})

// funcion que se encarga de guardar los datos en la Api y agregarlos a la tabla
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

// funcion que se encarga de actualizar los datos en la Api
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

// este evento define lo que se hará al momento de presionar el boton realizar del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    let usuario = { // objeto que toma los valores del formulario
        nombres: nombres.value,
        apellidos: apellido.value,
        edad: edad.value,
        cedula: cedula.value,
        email: correo.value,
        telefono: telefono.value
    }
    if(!proceso) { // si proceso es false se crea y agrega un nuevo usuario
        agregar(usuario)
        mensaje("Se ha agregado y guardado exitosamente")
        location.reload()
    }else { // si es verdadero se actualiza
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