const apiKey = 'a553647b84069d8125c72727afcbde74';
const language = 'es';
var page = 1;

var url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;

//BOTON SIGUIENTE
function sigPag(){
  page++;
  url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;
  getCartelera(url);
  document.getElementById('sec-messages').innerHTML = "";
  window.scrollTo({top: 0, behavior: 'smooth'}); //para que suba lentamente al inicio
}

//BOTON SIGUIENTE
function antPag(){
  if (page > 1){
    page--;
    url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;
    getCartelera(url);
  } else {
    getCartelera();
  }
  document.getElementById('sec-messages').innerHTML = "";
  window.scrollTo({top: 0, behavior: 'smooth'});
}



//CARTELERA
async function getCartelera() {
  try {
    //Retrasa la obtencion de la cartelera por un segundo para mostrar el mensaje de cargando cartelera
    await new Promise(resolve => setTimeout(resolve, 1000));

    document.getElementById('contenedorPeliculas').innerHTML = "";
    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    //Recorre los resultados y genera el contenido de la cartelera
    results.forEach(movie => {
      const { poster_path, title, id, original_title, original_language, release_date } = movie;

      //Hace el div de cada pelicula
      const movieCard = `
        <div class="movie-card">
          <img class="poster" src="https://image.tmdb.org/t/p/w500/${poster_path}">
          <h3 class="titulo">${title}</h3>
          <p><b>Código:</b> ${id}<br>
          <b>Título original:</b> ${original_title}<br>
          <b>Idioma original:</b> ${original_language}<br>
          <b>Año:</b> ${release_date}<br>
          <button class="button medium radius" onclick="agregarFavBot(${id})">Agregar a Favoritos</button>
        </div>
      `;
      
      //Agrega los div de cada pelicula en el HTML
      document.getElementById('contenedorPeliculas').innerHTML += movieCard;
    });
    ocultarCargando();
  } catch (error) {
    ocultarCargando();
    console.log('Error:', error);
  }
}

//VALIDACION PELICULA
async function validarExistenciaPelicula(codigoPelicula) {
  const url = `https://api.themoviedb.org/3/movie/${codigoPelicula}?api_key=${apiKey}&language=${language}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const pelicula = await response.json();
      return pelicula;
    } else {
      throw new Error("Error al obtener la película");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}


//AGREGAR FAVORITOS POR CODIGO
async function agregarFavCod() {
  const codigoPelicula = Number(document.getElementById('codigoPel').value);

  if (isNaN(codigoPelicula) || codigoPelicula == "") {
    document.getElementById('sec-messages').innerHTML = `<p id="error" class="">Error: La Película seleccionada no se encuentra en la API o se produjo un error al consultar</p>`;
  } else {
    //Obtiene los datos del local
    const favoritos = JSON.parse(localStorage.getItem("FAVORITOS")) || [];

    //valida si la pelicula se encuentra en el local
    if (favoritos.includes(codigoPelicula)) {
      document.getElementById('sec-messages').innerHTML = `<p id="warning" class="">La Película ingresada ya se encuentra almacenada</p>`;
    } else {
      //Valida si existe la pelicula
      const pelicula = await validarExistenciaPelicula(codigoPelicula);

      if (pelicula) {
        //Agrega el código al local
        favoritos.push(codigoPelicula);

        //Guarda los favoritos actualizados en el almacenamiento
        localStorage.setItem("FAVORITOS", JSON.stringify(favoritos));

        document.getElementById('sec-messages').innerHTML = `<p id="success" class="">Película agregada con éxito</p>`;
      } else {
        document.getElementById('sec-messages').innerHTML = `<p id="error" class="">Error: La Película seleccionada no se encuentra en la API o se produjo un error al consultar</p>`;
      }
    }
  }
}

//AGREGAR FAVORITOS POR BOTON
async function agregarFavBot(event) {
  //Toma el codigo de la pelicula asociado al boton
  const codigoPelicula = Number(event);

  const favoritos = JSON.parse(localStorage.getItem("FAVORITOS")) || [];

  if (favoritos.includes(codigoPelicula)) {
    document.getElementById('sec-messages').innerHTML = `<p id="warning" class="">La Película ingresada ya se encuentra almacenada</p>`;
  } else {
    //Valida si existe la pelicula
    const pelicula = await validarExistenciaPelicula(codigoPelicula);

    if (pelicula) {
      favoritos.push(codigoPelicula);

      //Guarda los favoritos actualizados en el almacenamiento
      localStorage.setItem("FAVORITOS", JSON.stringify(favoritos));

      document.getElementById('sec-messages').innerHTML = `<p id="success" class="">Película agregada con éxito</p>`;
    } else {
      document.getElementById('sec-messages').innerHTML = `<p id="error" class="">Error: La Película seleccionada no se encuentra en la API o se produjo un error al consultar</p>`;
    }
  }
}

/*----------------------------------------------------------------------------------------*/
mostrarCargando();
getCartelera();