import React, { useState, useEffect } from 'react';
import Formulario from './Components/Formulario';
import ListadoImagenes from './Components/ListadoImagenes';

function App() {

	const [busqueda, guardarBusqueda] = useState('');
	const [imagenes, guardarImagenes] = useState([]);
	const [paginaactual, guardarPaginaactual] = useState(1);
	const [totalpaginas, guardarTotalpaginas] = useState(1);

	useEffect(() => {
		if(busqueda === '') return;
		const consultarAPI = async () => {
			const imagenesPorPagina = 30;
			const key = '15834741-cd8e8e112a3cfaafc91171177';
			const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;
			const respuesta = await fetch(url);
			const resultado = await respuesta.json();
			console.log(resultado)
			guardarImagenes(resultado.hits);
			//Calcular total paginas
			const calcularTotalPaginas = Math.ceil(resultado.totalHits/imagenesPorPagina);
			guardarTotalpaginas(calcularTotalPaginas);

			//Mover la pantalla hacia arriba
			const jumbotron = document.querySelector('.jumbotron');
			jumbotron.scrollIntoView({behavior: 'smooth'})
		}
		consultarAPI();
	}, [busqueda, paginaactual]);

	//Definir la pagina anterior
	const paginaAnterior = () => {
		const nuevaPaginaActual = paginaactual - 1;
		if(nuevaPaginaActual === 0) return;
		guardarPaginaactual(nuevaPaginaActual);
	}
	const paginaSiguiente = () => {
		const nuevaPaginaActual = paginaactual + 1;
		if(nuevaPaginaActual > totalpaginas) return;
		guardarPaginaactual(nuevaPaginaActual);
	}
	return (
		<div className="container">
			<div className="jumbotron">
				<p className="lead text-center">Buscador de Imágenes</p>
				<Formulario
					guardarBusqueda={guardarBusqueda}
				/>
			</div>
				<div className="row justify-content-center">
					<ListadoImagenes
						imagenes={imagenes}
					/>
					{(paginaactual === 1) 
					? 
						null
					:
						<button
							type="button"
							className="btn btn-info mr-1"
							onClick={paginaAnterior}
						>
							&laquo;Anterior
						</button>
					}
					{(paginaactual === totalpaginas || totalpaginas === 1) 
					? 
						null 
					: 
						<button
							type="button"
							className="btn btn-info mr-1"
							onClick={paginaSiguiente}
						>
							Siguiente&raquo;
						</button>
					}
				</div>
		</div>
	);
}

export default App;
