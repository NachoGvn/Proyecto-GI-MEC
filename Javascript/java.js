const items = document.getElementById('items')
const templateCards = document.getElementById('template-cards').content
const fragment = document.createDocumentFragment()
const cards = document.getElementById('cards')
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
let carroCompra = {}


document.addEventListener('DOMContentLoaded', () => {

    fetchData() 
    if(localStorage.getItem('carroCompra')) {
      carroCompra = JSON.parse(localStorage.getItem('carroCompra'))
      pintarCarrito()
 }
})

cards.addEventListener("click", e => {
  addcarrito(e)
})

items.addEventListener('click', e => {
  botonAccion(e)
})




const fetchData = async () => {
    try {
         const res = await fetch('api.json')
         const data = await res.json()
         pintarCard(data)
    }catch (error){
         console.log(error)
    }
}


const pintarCard = data => {
    data.forEach(producto => {
         templateCards.querySelector('h5').textContent = producto.nombre
         templateCards.querySelector('#card-text').textContent = producto.descripcion
         templateCards.querySelector('#price').textContent = producto.precio
         templateCards.querySelector('img').setAttribute("src",producto.url)
         templateCards.querySelector('button').dataset.id = producto.id

         const clone = templateCards.cloneNode(true)
         fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addcarrito = e => {
     
    if (e.target.classList.contains ('btn-outline-secondary')) {
         setCarrito(e.target.parentElement)
         const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
            
            Toast.fire({
              icon: 'success',
              title: 'Producto agregado al carrito'
            })
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
  const produ = {
       id : objeto.querySelector('button').dataset.id,
       title : objeto.querySelector('h5').textContent,
       precio : objeto.querySelector('#price').textContent,
       cantidad : 1
  }
  if (carroCompra.hasOwnProperty(produ.id)) {
       produ.cantidad = carroCompra[produ.id].cantidad + 1
  }
  carroCompra[produ.id] = {...produ}
  pintarCarrito()
  
}

const pintarCarrito = () => {
  items.innerHTML = ''
  Object.values(carroCompra).forEach(produ => {
       templateCarrito.querySelector('th').textContent = produ.id
       templateCarrito.querySelectorAll('td')[0].textContent = produ.title
       templateCarrito.querySelectorAll('td')[1].textContent = produ.cantidad
       templateCarrito.querySelector('.btn-info').dataset.id = produ.id
       templateCarrito.querySelector('.btn-danger').dataset.id = produ.id
       templateCarrito.querySelector('span').textContent = produ.cantidad * produ.precio
       const clone = templateCarrito.cloneNode(true)
       fragment.appendChild(clone)
  })
  items.appendChild(fragment)
  pintarFooter()

  localStorage.setItem('carroCompra', JSON.stringify(carroCompra))
}

const pintarFooter = () => {
  footer.innerHTML = ''
  if(Object.keys(carroCompra).length === 0) {
       footer.innerHTML = ' <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
       return
  }
  const xCantidad = Object.values(carroCompra).reduce((acc, {cantidad}) => acc + cantidad ,0)
  const xPrecio = Object.values(carroCompra).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0 )

  templateFooter.querySelectorAll ('td') [0].textContent = xCantidad
  templateFooter.querySelector ('span').textContent = xPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const botonVaciar = document.getElementById('vaciar-carrito')
  botonVaciar.addEventListener('click', () => {
       carroCompra = {}
       pintarCarrito()

  })

}    
const botonAccion = e => {
  
  if (e.target.classList.contains ('btn-info')) {
       carroCompra[e.target.dataset.id]
       
  const producto = carroCompra[e.target.dataset.id]
  producto.cantidad = carroCompra[e.target.dataset.id].cantidad + 1
  carroCompra[e.target.dataset.id] = {...producto}
  pintarCarrito()
  }

  if (e.target.classList.contains ('btn-danger')) {
       const producto = carroCompra[e.target.dataset.id]
       producto.cantidad --
       if (producto.cantidad === 0){
            delete carroCompra[e.target.dataset.id]
       }
       pintarCarrito()

  }
  e.stopPropagation()
}
