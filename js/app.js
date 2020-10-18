const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

// Esto es lo mismo que DOMContentLoades
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de Busqueda');

        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');

    if (!existeAlerta) {
        
            const alerta = document.createElement('p');
            alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        
            alerta.innerHTML = `
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">${mensaje}</span>
            `;
        
            formulario.appendChild(alerta);
        
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        
    }
}

async function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    // Cuando se utilizan apikey normalmente lo que se hace es utilizar variables de entorno que contengan estos datos de manera oculta y así
    // no son visibles para cualquiera, pero en este caso práctico solo lo utilizaremos así
    const key = '18689537-5e6b4c4ec61de3684988392bd';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    // Es igual al async await que tenemos más abajo
    // fetch(url)
    //     .then( respuesta => respuesta.json() )
    //     .then( resultado => {
    //         console.log(resultado)
    //         totalPaginas = calcularPaginas(resultado.totalHits);            
    //         mostrarImagenes(resultado.hits)
    //     })


    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits);            
        mostrarImagenes(resultado.hits)
    } catch (error) {
        console.log(error);
    }

}

//Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total) {
    for (let i=1; i<= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    // Recordemos que Math.ceil nos redondea un decimal hacia arriba
    return parseInt( Math.ceil( total / registrosPorPagina ));
}

function mostrarImagenes(imagenes){
    console.log(imagenes);

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y construir el Html
    imagenes.forEach( imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold"> ${likes}<span class="font-light"> Me gusta</span></p>
                        <p class="font-bold"> ${views}<span class="font-light"> Veces Vista</span></p>

                        <a 
                            class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferr">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    // Generamos el nuevo Html
    imprimirPaginador();
}


function imprimirPaginador() {    
    iterador = crearPaginador(totalPaginas);

    while(true){
        const { value, done } = iterador.next();

        if(done) return;

        // En caso contrario, genera un boton por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}
