<?php 
class  Record {

    protected $server;
    protected $user;
    protected $pass;
    protected $dbname;

    public function __construct(){
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "records";
    }

    public function addRecord($nombre, $apellidos, $nivel, $tiempo){
        $tiempofloat = floatval($tiempo);
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        $consultaPre = $db->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?,?,?,?)");
        $consultaPre->bind_param('ssss', $nombre, $apellidos, $nivel, $tiempofloat);   
        $consultaPre->execute();
        $consultaPre->close();
        $db->close();
    }

    public function getTop10($nivel){
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $consultaPre = $db->prepare("SELECT * from registro WHERE nivel = ? ORDER BY tiempo LIMIT 10");
        $consultaPre->bind_param('s', $nivel);
        $consultaPre->execute();
        $resultado = $consultaPre->get_result();
        if($resultado->fetch_assoc() != NULL){
            $lista = "<ol>";
            $resultado->data_seek(0);
            while ($row = $resultado->fetch_assoc()){
                $timeExpent = floatval($row['tiempo']);
                $hours = floor($timeExpent / 60 / 60);
                $minutes = floor(($timeExpent / 60) - ($hours * 60));
                $seconds = floor(($timeExpent) - (($hours * 60 + $minutes) * 60));
                $tiempo = $hours . ":" . $minutes . ":" . $seconds;
    
                $lista .= "<li> Nombre: ". $row['nombre'].
                " Apellidos: ". $row['apellidos'].
                " Nivel: ". $row['nivel'].
                " Tiempo: " . $tiempo ."</li>";
            }
            $consultaPre->close();
            $db->close();
            $lista .= "</ol>";
            $section = "<section data-type=top> <h3>Top 10</h3> ";
            $section .= $lista;
            $section .= "</section>";
            return $section;
        }
        return "<p>Error</p>";
    }
        
}


?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Juegos - Crucigrama</title>
    <meta name ="author" content ="Mario Junquera Rojas" />
    <meta name ="keywords" content ="aquí cada documento debe tener la lista
    de las palabras clave del mismo separadas por comas" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
    <link rel="stylesheet" type="text/css" href="estilo/juegos.css" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo_botonera.css" />
    <link rel="icon" href="multimedia/favicon.ico" />
    <script src="js/crucigrama.js"></script>
    <script 
        src="https://code.jquery.com/jquery-3.7.1.min.js" 
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
        crossorigin="anonymous">
    </script>

</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1>Escritorio Virtual - Juegos - Crucigrama</h1>
        <nav>
            <a href = "index.html" accesskey="I" tabindex="1"> Inicio</a>
            <a href = "sobremi.html" accesskey="S" tabindex="2"> Sobre Mi</a>
            <a href = "noticias.html" accesskey="N" tabindex="3"> Noticias</a>
            <a href = "agenda.html" accesskey="A" tabindex="4"> Agenda</a>
            <a href = "meteorologia.html" accesskey="M" tabindex="5"> Meteorología</a>
            <a href = "viajes.html" accesskey="V" tabindex="6"> Viajes</a>
            <a href = "juegos.html" accesskey="J" tabindex="7"> Juegos</a>
        </nav>
    </header>
    <section>
        <h2>Menu de Juegos</h2>
        <nav id= "Enlace">
            <a href = "memoria.html" accesskey="R" tabindex="8"> Memoria</a>
            <a href = "sudoku.html" accesskey="K" tabindex="9"> Sudoku</a>
            <a href = "crucigrama.php" accesskey="C" tabindex="10"> Crucigrama</a>
            <a href = "api.html" accesskey="P" tabindex="11"> Figuras</a>
        </nav>
    </section>
    <h3>Crucigrama</h3>
    <section data-type="botonera">
            <h4>Botonera</h4>
            <button onclick="crucigrama.introduceElement(1)">1</button>
            <button onclick="crucigrama.introduceElement(2)">2</button>
            <button onclick="crucigrama.introduceElement(3)">3</button>
            <button onclick="crucigrama.introduceElement(4)">4</button>
            <button onclick="crucigrama.introduceElement(5)">5</button>
            <button onclick="crucigrama.introduceElement(6)">6</button>
            <button onclick="crucigrama.introduceElement(7)">7</button>
            <button onclick="crucigrama.introduceElement(8)">8</button>
            <button onclick="crucigrama.introduceElement(9)">9</button>
            <button onclick="crucigrama.introduceElement('*')">*</button>
            <button onclick="crucigrama.introduceElement('+')">+</button>
            <button onclick="crucigrama.introduceElement('-')">-</button>
            <button onclick="crucigrama.introduceElement('/')">/</button>
        </section>
    <main>
        
    </main>
    <?php
    //Aqui se recoje el formulario
    if (count($_POST)>0) 
    {    
        $record = new Record();
        $record->addRecord($_POST["nombre"], $_POST["apellidos"], $_POST["nivel"], $_POST["tiempo"]);
        echo $record->getTop10($_POST["nivel"]);
    }
    ?>
    <script>
    crucigrama.paintMathword();
    $(document).keydown(crucigrama.checkKey.bind(document, crucigrama));
</script>
</body>

</html>