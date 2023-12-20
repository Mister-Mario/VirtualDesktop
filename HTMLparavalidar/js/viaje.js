"use strict";

class Viajes{
    constructor(){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }
    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;
        this.mapaDinamico = null;
        this.slides = null;
        this.curSlide = 9;
        this.checkAPISupport();       
    }

    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    getMapaEstaticoGoogle(){
        var ubicacion=document.querySelector("[data-type = 'mapa estatico']");
        
        var apiKey = "&key=AIzaSyAU1nr3dm2IoWH0_jdly0i0V2my3ir5UGw";
        //URL: obligatoriamente https
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        // centro del mapa (obligatorio si no hay marcadores)
        var centro = "center=" + this.latitud + "," + this.longitud;
        var zoom ="&zoom=15";
        var tamaño= "&size=800x600";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        ubicacion.innerHTML = "<h3>Mapa estático</h3><img src='"+this.imagenMapa+"' alt='mapa estático google' />";
    }

    getMapaDinamico(){
        this.initMapaDinamico();
        $("section[data-type = 'mapa dinamico']").prepend("<h3>Mapa dinámico</h3>");
    }

    initMapaDinamico(){  
        var centro = {lat: parseFloat(this.latitud), lng: parseFloat(this.longitud)};
        this.mapaDinamico = new google.maps.Map(document.getElementById('mapa'),{
            zoom: 8,
            center:centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }
    
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                                  'Error: Ha fallado la geolocalización' :
                                  'Error: Su navegador no soporta geolocalización');
            infoWindow.open(mapaGeoposicionado);
    }

    checkAPISupport(){
        var p = document.createElement("p");
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
            //El navegador soporta el API File
            p.textContent = "Este navegador soporta el API File";
            document.querySelector("section[data-type='carga ficheros']").append(p);

            $("section[data-type='carga ficheros']").append("<p><input type = 'file' onchange = 'mapa.readInputFile(this.files)' multiple></p>");
        }
        else{
            p.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
            document.querySelector("section[data-type='carga ficheros']").append(p);
        }
       

    }

    readInputFile(files){
        var tipoXml = /^text\/xml/i;
        var tipoSvg = /^image\/svg/i;
        for(let i = 0; i < files.length; i++){
            var archivo = files[i];
            if (archivo.type.match(tipoXml)) {                
                var lector = new FileReader();
                lector.onload = this.parseArchivoXML.bind(this, lector);  
                lector.readAsText(archivo);
                continue;
            }
            if(archivo.type.match(tipoSvg)){
                var lector = new FileReader();
                lector.onload = this.parseArchivoSVG.bind(this, lector, i);  
                lector.readAsText(archivo);
                continue;
            }
            if(archivo.name.split('.').pop().includes("kml")){
                var lector = new FileReader();
                lector.onload = this.parseArchivoKML.bind(this, lector);  
                lector.readAsText(archivo);
                continue;
            }
            alert("Error : ¡¡¡ Archivo no válido !!!");
        }
    }

    parseArchivoKML(lector){
        if(this.mapaDinamico === null)
            this.getMapaDinamico();
        var map = this.mapaDinamico;
        var coordinates = $("coordinates", lector.result).text().trim().split('\n');
        var lineCoordinates = new Array(coordinates.length);
        for(let i = 0; i < coordinates.length; i++){
            var splitted = coordinates[i].split(',');
            var centro = {lat: parseFloat(splitted[1]), lng: parseFloat(splitted[0])};
            new google.maps.Marker({
                position: centro,
                map,
                title: i + "",
            });
            lineCoordinates[i] = {lat: parseFloat(splitted[1]), lng: parseFloat(splitted[0])};
            
        }

        var flightPath = new google.maps.Polyline({
        path: lineCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        });

        flightPath.setMap(map);

        map.setCenter(centro);
        
    }

    parseArchivoSVG(lector, i) {
        $("section[data-type='rutas svg']").append("<svg data-index = " + i + "></svg>");
        $("polyline", lector.result).appendTo($("svg[data-index = " + i + "]"));
        $("text", lector.result).each((index, text) => {$("svg[data-index = " + i + "]").append(text)});
    }


    parseArchivoXML(lector) {
        $("section[data-type='rutas xml']").empty();
        $("section[data-type='rutas xml']").append("<h3>Rutas por Túnez</h3>");
        $("ruta", lector.result).each((index, ruta) => {
            $("section[data-type='rutas xml']").append("<section data-type='ruta xml' data-i='" + index + "'></section>");
            $("section[data-i='" + index + "']")
                .append("<h4 data-type = nombre>Nombre: " + $("nombre", ruta).first().text() + "</h4>")
                .append("<p>Tipo: " + $("tipo", ruta).text() + "</p>")
                .append("<p>Medio de Transporte: " + $("medioTransporte", ruta).text() + "</p>")
                .append("<p>Duración: " + $("duracion", ruta).text().slice(1) + "</p>")
                .append("<p>Agencia: " + $("agencia", ruta).text() + "</p>")
                .append("<p>Descripción: " + $("descripcion", ruta).text() + "</p>")
                .append("<p>Personas Adecuadas: " + $("personasAdecuadas", ruta).text() + "</p>")
                .append("<p>Lugar de Inicio: " + $("lugarInicio", ruta).text() + "</p>")
                .append("<p>Dirección de Inicio: " + $("direccionInicio", ruta).text() + "</p>")
                .append("<p>Coordenadas: Latitud=" + $("coordenadas", ruta).attr("latitud") +
                        ", Longitud=" + $("coordenadas", ruta).attr("longitud") + ", Altitud=" + $("coordenadas", ruta).attr("altitud") + "</p>")
                .append("<p>Referencias:</p>");

                $("referencia", ruta).each((i, ref) => {
                    var url = $(ref).text();
                    $("section[data-i='" + index + "']").append("<a href='" + url + "' target='_blank'>" + url + "</a><br>");
                });
    
            $("hito", ruta).each((i, hito) => {
                $("section[data-i='" + index + "']")
                    .append("<section data-type=hito></section>");
                $("section[data-i='" + index + "'] section[data-type=hito]:last")
                    .append("<h4>Hito Nombre: " + $("nombre", hito).text() + "</h4>")
                    .append("<p>Descripción: " + $("descripcion", hito).text() + "</p>")
                    .append("<p>Coordenadas: Latitud=" + $("coordenadas", hito).attr("latitud") +
                            ", Longitud=" + $("coordenadas", hito).attr("longitud") + ", Altitud=" + $("coordenadas", hito).attr("altitud") + "</p>")
                    .append("<p>Distancia al Hito Anterior: " + $("distanciaHitoAnterior cantidad", hito).text() + " " +
                            $("distanciaHitoAnterior", hito).attr("unidades") + "</p>")
                    .append("<img src = 'xml/" + $("foto", hito).text() + "' alt = "+ $("foto", hito).text().split("/")[1] +"/>");
            });
    
            $("section[data-i='" + index + "']")
                .append("<p data-type=recomendacion>Recomendación: " + $("recomendacion", ruta).text() + "</p>");
        });
    }

    nextSlide(){
        if(this.slides == null)
            this.slides = document.querySelectorAll("img[data-type = 'img carrusel'");

        if (this.curSlide === (this.slides.length - 1)) {
            this.curSlide = 0;
        } else {
            this.curSlide++;
        }
        //   move slide by -100%
        this.slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }

    prevSlide(){
        if(this.slides == null)
            this.slides = document.querySelectorAll("img[data-type = 'img carrusel'");

        // check if current slide is the first and reset current slide to last
        if (this.curSlide === 0) {
            this.curSlide = (this.slides.length - 1);
        } else {
            this.curSlide--;
        }

        //   move slide by 100%
        this.slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });

    }
}

