/*
Este es un jemplo de una API REST utilizando una llamada con fetch, el cual sirve para otener
info sobre el tipo de api, (pokemon) y obtener su estructura a partir de crear una funcion callback con una promesa
*/

const pokeApiURL = "https://pokeapi.co/api/v2/";

//vamos a crear una funcion para obtrener todos los datos de la pokedex, para esto tenemos que imaginar el orden y la obtencion de los datos

const pokedex = () => {
    //primero necesitamos obtener todas las estadisticas del pokemon, asi que necesitamos crear un diccionario para obtener cada uno de los elementos front para despues vaciar los datos

    const pokemonStatsElements ={
        hp : document.getElementById("pokemonStatHP"),
        attack : document.getElementById("pokemonStatAttack"),
        defense : document.getElementById("pokemonStatDefense"),
        speed : document.getElementById("pokemonStatSpeed"),
    };

    //NECESITAMOS UN AUXILIAR QUE NOS PERMITA USAR LA CLASE DEL TIPO DE POKEMON
    let currentClassType = null;
    //tiene que cambiar los elementos de la imagen para ello tenemos que crear un template que se  encargue de encadenar los datos
    const pokemonImageTemplate = "<img class='pokedisplay' src='{imgSrc}' alt='pokedisplay' />";

    //necesitamos un obj que se encargue de guardar las rutas de las imagenes que vamos a cambiar dependiendo de si es una busqueda, si lo encontro o no al pokemon

    const images ={
        imgPokemonNotFound : "../img/404.png",
        imgLoading : "../img/loading.gif",
    };

    // necesitamos una variable que guarde todos los contenedores de la pokedex
    const containers = {
        imageContainer : document.getElementById("pokedisplay-container"),
        pokemonTypeContainer : document.getElementById("pokemonTypes"),
        pokemonNameElements : document.getElementById("pokemonNameResult"),
        pokemonAbilitiesElement: document.getElementById("pokemonAbilities"),
        pokemonMovesElement : document.getElementById("pokemonMoves"),
        pokemonIdElement : document.getElementById("pokemonID"),
    };
    //necesitamos un objeto de tipo array que guarde los botones con tipo de referencia
    const buttons = {
        all : Array.from(document.querySelectorAll("btn")),
        search : document.getElementById("btnSearch"),
        next : document.getElementById("btnUp"),
        previous : document.getElementById("btnDown"),
    };

    //para buscar un pokemon necesitamos una variable que guarde el nombre del pokemon
    const pokemonInput = document.getElementById("pokemonName");
    //La agrupacion de los elementos en este obj debe ser una estructura que nos permita crear funciones mas pequeñas que sin importar el orden puedan obtrener cada uno de los datos solicitados
    const processPokemonType = (pokemonData) => {
        //primero necesitamos obtener rl tipo de pokemon, el nombre, y la clase par que se modifique en el html, ya que tenemos eso, tendremos que btener stats , moves, abilities

        let pokemonType = "";
        //utiliza UNA BUSQUEDA DE LA CLASE DE POKEMON, ESO SE REFIERE AL TIPO DE POKEMON
        const firstClass = pokemonData.types[0].type.name;

        pokemonData.types.forEach((pokemonTypeData) => {
            //necesio obtener la etiqueta de cada campo
            pokemonType += `<span class="pokemon-type ${pokemonTypeData.type.name}">${pokemonTypeData.type.name}</span>`;
        });
        //paa poder quitar y cambiar el contenedor dependiendo del tipo tengo que saber a cual pertenece
        if (currentClassType) {
            containers.pokemonMovesElement.classList.remove(currentClassType);
            containers.pokemonAbilitiesElement.classList.remove(currentClassType);
            //ahora tengo que agregar lo nuevo
        }
        containers.pokemonMovesElement.classList.add(firstClass);
        containers.pokemonAbilitiesElement.classList.add(firstClass);
        //debo de agregar las etiquetas creadas dentro del foreach
        containers.pokemonTypeContainer.innerHTML = pokemonType;
        //ahora necesitamos obtener las estadisticas del pokemon
        const processPokemonStats = (pokemonData) => {
            pokemonData.stats?.forEach((pokemonStatData) => {
                //vamos a evaluar si encuentra el nombre de la estadistica para colocarlo en su contendor respectivo
                switch (pokemonStatData.stat.name) {
                    case "hp":
                        pokemonStatsElements.hp.innerHTML = pokemonStatData.base_stat;
                        pokemonStatsElements.hp.style = `background: linear-gradient (0deg, rgba(0,118,255,1) ${pokemonStatData.base_stat}%, rgba(0,0,0,0.1) ${pokemonStatData.base_stat}%`;
                        break;
                    case "attack":
                        pokemonStatsElements.attack.innerHTML = pokemonStatData.base_stat;
                        pokemonStatsElements.attack.style = `background: linear-gradient (0deg, rgba(0,118,255,1) ${pokemonStatData.base_stat}%, rgba(0,0,0,0.1) ${pokemonStatData.base_stat}%`;
                        break;
                    case "defense":
                        pokemonStatsElements.defense.innerHTML = pokemonStatData.base_stat;
                        pokemonStatsElements.defense.style = `background: linear-gradient (0deg, rgba(0,118,255,1) ${pokemonStatData.base_stat}%, rgba(0,0,0,0.1) ${pokemonStatData.base_stat}%`;
                        break;
                    case "special-attack":
                        pokemonStatsElements.specialAttack.innerHTML = pokemonStatData.base_stat;
                        pokemonStatsElements.specialAttack.style = `background: linear-gradient (0deg, rgba(0,118,255,1) ${pokemonStatData.base_stat}%, rgba(0,0,0,0.1) ${pokemonStatData.base_stat}%`;
                        break;
                    case "special-defense":
                        pokemonStatsElements.specialDefense.innerHTML = pokemonStatData.base_stat;
                        pokemonStatsElements.specialDefense.style = `background: linear-gradient (0deg, rgba(0,118,255,1) ${pokemonStatData.base_stat}%, rgba(0,0,0,0.1) ${pokemonStatData.base_stat}%`;
                        break;      
                    case "speed":
                        pokemonStatsElements.speed.innerHTML = pokemonStatData.base_stat;
                        pokemonStatsElements.speed.style = `background: linear-gradient (0deg, rgba(0,118,255,1) ${pokemonStatData.base_stat}%, rgba(0,0,0,0.1) ${pokemonStatData.base_stat}%`;
                        break;
                
                }
            });
        };

        // necesitamos una funcion para poder mapear las habilidades del pokemon y mostrarlas en su componente respectivo
        const processPokemonAbilities = (pokemonData) => {
            let pokemonAbilitiesContent = "";
            pokemonData.abilities?.forEach((pokemonAbilityData) => {
                pokemonAbilities += `<li>${pokemonAbilityData.ability.name}</li>`;
            });
            containers.pokemonAbilitiesElement.innerHTML = pokemonAbilitiesContent;
        };
        //necesitamos una funcion para mapear los movimientos del pokemon y poder mostrarlas en su componente respectivo
        const processPokemonMoves = (pokemonData) => {
            let pokemonMovesContent = "";
            pokemonData.moves?.forEach((pokemonMoveData) => {
                pokemonMovesContent += `<li>${pokemonMoveData.move.name}</li>`;
            });
            containers.pokemonMovesElement.innerHTML = pokemonMovesContent;
        };

        //necesito poner la imagen del cargando y que tambien se deshabiliten los botones mientras carga

        const setLoading = () => {
            containers.imageContainer.innerHTML = pokemonImageTemplate.replace("{imgSrc}", images.imgLoading);
            buttons.all.forEach((button) => {
                button.disabled = true;
            });
        };

        //necesito otra funcion que los habilite
        const setLoadingComplete = () => {
            buttons.all.forEach(button => checkDisable(button))};

            //vamos a crear una promesa, para poder obtener cada uno de los elementos de la pokédex, pero sin importar el orden, significa que cuando se realice la petición, va a ser tu asyncrona eso significa que va a atender sin importar el orden de la transferencia de los paquetes los datos del request los va a procesar y después armar para ello utilizaremos una función de tipo fetch la cual como argumento principal van a estar la URL de la api y después una serie de then para procesar los datos
        const getPokemonData = async (pokemonName) => fetch(`${pokeApiURL}pokemon/${pokemonName}`, {
            //cualquier peticion fetch pordefault es del tipo GET, pero si queremos hacer otro tipo de peticiones tenemoos que especificarlo en el segundo argumento
            //Pero cuando sea de una BD entonces ya podremos modificar el tipo de metodo post, put, delete etc.
            //Despues del metodo es necesario el tipo de encabezado, las cabeceras son necesarias para que el servidor entiienda que el tipo de datos le estamos enviando y que tipo de datos esperamos recibir
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            //si por ejemplo tiene elementos del formulario dentro del body aqui deben de incluir
            //body: JSON.stringfy({}),
        })
        .then((res) => res.jhson()) //aqui estamos convirtiendo la respuesta en un objeto JSON
        .catch((error) => ({requestFailed: true})); //en caso de que falle la petición vamos a regresar un objeto con una propiedad que nos indique que la petición falló

        //necesitamos validar si necesesitamos habilitar o deshabilitar los botones
        const checkDisable = (button) => {
            //para cuando exista un id negativo
            button.disabled = button.id === "btnDown" && containers.pokemonIdElement.value <= 1;
        };

        //la funcion que se encargue de ir armando los datods de la pokedex, enton ces necesitamos validar ya sea el ID o el nombre del pokemon+
        const setPokemonData = async (pokemonName) => {
            //poner la imagen de busqueda y deshabilitar los botones
            setLoading();
            //debo de armar la consulta para determionar el orden de los datos
            const pokemonData = await getPokemonData(typeof pokemonName === "string" ? pokemonName.toLowerCase().trim() : pokemonName);
            //validar si la peticion fallo
            if(pokemonData.requestFailed){
                containers.imageContainer.innerHTML = pokemonImageTemplate.replace("{imgSrc}", images.imgPokemonNotFound);

            }else{
                //ponemos todos los elementos
                containers.imageContainer.innerHTML = pokemonImageTemplate.replace("{imgSrc}", pokemonData.sprites.front_default);
            }


        

}
};