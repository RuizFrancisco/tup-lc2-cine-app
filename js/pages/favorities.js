//BORRAR FAVORITO
function quitarPeliculaFavorita(peliculaId) {
  let favoritos = localStorage.getItem("FAVORITOS");

  if (favoritos) {
    favoritos = JSON.parse(favoritos);

    //Encuentra el indice de la película en el local
    const index = favoritos.indexOf(peliculaId);

    if (index !== -1) {
      //Elimina la pelicula del local
      favoritos.splice(index, 1);

      //Actualiza el localStorage con el array de favoritos actualizado
      if (favoritos.length > 0) {
        localStorage.setItem("FAVORITOS", JSON.stringify(favoritos));
      } else {
        localStorage.removeItem("FAVORITOS");
      }
      location.reload();
    }  
  }
}

//PELICULAS FAVORITAS
async function mostrarPeliculasFavoritas() {
  let favoritos = localStorage.getItem("FAVORITOS");

  if (favoritos) {
    favoritos = JSON.parse(favoritos);
    const mensaje = document.getElementById("sec-messages");
    mensaje.style.display = "none";
    mostrarCargando();

    //Retrasa la cartelera un segundo
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (let i = 0; i < favoritos.length; i++) {
      const peliculaId = favoritos[i];
      const apiUrl = `https://api.themoviedb.org/3/movie/${peliculaId}?api_key=a553647b84069d8125c72727afcbde74&language=es&append_to_response=${peliculaId}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extraer los datos relevantes de la respuesta
        const { poster_path, title, id, original_title, original_language, overview } = data;

        const peliculaDiv = document.createElement("div");
        peliculaDiv.classList.add("pelicula"); 

        const img = document.createElement("img");
        img.classList.add("poster");
        img.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
        peliculaDiv.appendChild(img);

        const titulo = document.createElement("h3");
        titulo.classList.add("titulo");
        titulo.textContent = title;
        peliculaDiv.appendChild(titulo);

        const codigo = document.createElement("p");
        codigo.innerHTML = `<b>Código:</b> ${id}`;
        peliculaDiv.appendChild(codigo);

        const tituloOriginal = document.createElement("p");
        tituloOriginal.innerHTML = `<b>Título original:</b> ${original_title}`;
        peliculaDiv.appendChild(tituloOriginal);

        const idiomaOriginal = document.createElement("p");
        idiomaOriginal.innerHTML = `<b>Idioma original:</b> ${original_language}`;
        peliculaDiv.appendChild(idiomaOriginal);

        if(overview){
          const resumen = document.createElement("p");
          resumen.innerHTML = `<b>Resumen:</b> ${overview}`;
          peliculaDiv.appendChild(resumen);
        }

        const botonQuitFav = document.createElement("button");
        botonQuitFav.className = "button medium radius";
        botonQuitFav.textContent = "Quitar de favoritos";
        botonQuitFav.addEventListener("click", function () {
          quitarPeliculaFavorita(id);
        });
        peliculaDiv.appendChild(botonQuitFav);


        //Agrega el div de la pelicula al contenedor de peliculas favoritas
        const contenedorPeliculas = document.getElementById("contenedorPeliculasFavoritas");
        contenedorPeliculas.appendChild(peliculaDiv);
        ocultarCargando();
      } catch (error) {
        ocultarCargando();
        console.log("Error al obtener la información de la película:", error);
      }
    }
  }
} 

mostrarPeliculasFavoritas();
  