<?php
    class Carrusel {

        protected $nombrePais;
        protected $nombreCapital;

        public function __construct($nombreCapital, $nombrePais) {
            $this->nombreCapital = $nombreCapital;
            $this->nombrePais = $nombrePais;
        }

        public function getFotos() {
            $api_key = '13b7f84390b24dc231d40c55c409272b';
            $tag = $this->nombreCapital;
            $perPage = 10;
            // Fotos públicas recientes
            $url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search';
            $url.= '&api_key='.$api_key;
            $url.= '&tags='.$tag;
            $url.= '&per_page='.$perPage;
            $url.= '&format=json';
            $url.= '&nojsoncallback=1';

            $respuesta = file_get_contents($url);
            $json = json_decode($respuesta);
            if($json==null) {
                echo "<h3>Error en el archivo JSON recibido</h3>";
            }
            else {
                $section = "<section data-type = 'carrusel'> ";
                $section .= "<h3>Carrusel de Imágenes</h3>";
                $photos = $json->photos->photo;
                for($i=0;$i<$perPage;$i++) {
                    $titulo = $photos[$i]->title;
                    $srcUrl = "https://live.staticflickr.com/";
                    $srcUrl .= $photos[$i]->server . "/";
                    $srcUrl .= $photos[$i]->id . "_" . $photos[$i]->secret . "_b.jpg";   

                    $section .= "<img data-type = 'img carrusel' alt='".$titulo."' src='".$srcUrl."' />";
                
                }
                $section .= "<button data-action = 'next' onclick = 'mapa.nextSlide()'> > </button>";
                $section .= "<button data-action = 'prev' onclick = 'mapa.prevSlide()'> < </button>";
                $section .= "</section>";
            }

            return $section;
        }
    }
    
    class Moneda {
        protected $monedaInicio;
        protected $monedaFinal;
        public function __construct($monedaInicio, $monedaFinal) {
            $this->monedaInicio = $monedaInicio;
            $this->monedaFinal = $monedaFinal;
        }

        public function getIntercambio() {
            $url = "https://api.currencyapi.com/v3/latest?apikey=cur_live_g2qo9BhvEniRRTWMsqHKx4iOODAiZvf2pNtN9S1Z";
            $url .= "&currencies=" . $this->monedaFinal . "&base_currency=" . $this->monedaInicio;
            $respuesta = file_get_contents($url);
            $json = json_decode($respuesta, true);
            if($json==null) {
                echo "<h3>Error en el archivo JSON recibido</h3>";
            }
            else {
                $section = "<section data-type = 'cambio moneda'> ";
                $section .= "<h3>Cambio moneda</h3>";
                $section .= "<p> 1 ". $this->monedaInicio ." son " . $json['data'][$this->monedaFinal]['value'] . " " . $json['data'][$this->monedaFinal]['code'];
                $section .= "</section>";

                echo $section;
            }
        }
    }

    $moneda = new Moneda('EUR', 'TND');
    $carrusel = new Carrusel("Tunez", "Tunez");
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Viajes</title>
    <meta name ="author" content ="Mario Junquera Rojas" />
    <meta name ="keywords" content ="aquí cada documento debe tener la lista
    de las palabras clave del mismo separadas por comas" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link rel="icon" href="multimedia/favicon.ico" />
    <script 
    src="https://code.jquery.com/jquery-3.7.1.min.js" 
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
    crossorigin="anonymous">
    </script>
    <script src="js/viaje.js"></script>

</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1>Escritorio Virtual - Viajes</h1>
        <nav>
            <a href = "index.html" accesskey="I" tabindex="1"> Inicio</a>
            <a href = "sobremi.html" accesskey="S" tabindex="2"> Sobre Mi</a>
            <a href = "noticias.html" accesskey="N" tabindex="3"> Noticias</a>
            <a href = "agenda.html" accesskey="A" tabindex="4"> Agenda</a>
            <a href = "meteorologia.html" accesskey="M" tabindex="5"> Meteorología</a>
            <a href = "viajes.php" accesskey="V" tabindex="6"> Viajes</a>
            <a href = "juegos.html" accesskey="J" tabindex="7"> Juegos</a>
        </nav>
    </header>
    <h2>Viajes</h2>
    <main>
        <?php echo $carrusel->getFotos(); ?>
        <?php $moneda->getIntercambio(); ?>
        <section data-type ="mapa estatico">
            <h3>Mapa estático</h3>
            <button onclick="mapa.getMapaEstaticoGoogle()">Cargar mapa estático</button>
        </section>
        <section id = "mapa" data-type ="mapa dinamico">
            <h3>Mapa dinámico</h3>
            <button onclick="mapa.getMapaDinamico()">Cargar mapa dinámico</button>
        </section>
        <section data-type = "carga ficheros">
            <h3>Carga ficheros</h3>
        </section>
        <section data-type = "rutas xml">
            <h3>Rutas por Túnez</h3>
        </section>
        <section data-type = "rutas svg">
            <h3>Altimetría de las rutas por Túnez</h3>
        </section>
    </main> 
    <script>
        var mapa = new Viajes();
    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAU1nr3dm2IoWH0_jdly0i0V2my3ir5UGw" ></script>
</body>
</html>