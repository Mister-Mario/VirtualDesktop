"use strict";
class Fondo{
    constructor(pais, capital, latitud, longitud){
        this.pais = pais;
        this.capital = capital;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    getFotos(){
            var flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
            $.getJSON(flickrAPI, 
                    {
                        "api_key" : "13b7f84390b24dc231d40c55c409272b",
                        "lat": fondo.latitud,
                        "lon": fondo.longitud,
                        "format": "json",
                        "nojsoncallback" : "1"
                    })
                .done(function(data) {
                    //La llamada a la api da 250 archivos
                    var photo = data.photos.photo[Math.floor(Math.random() * 251)];
                    var srcUrl = "https://live.staticflickr.com/";
                    srcUrl += photo.server + "/";
                    srcUrl += photo.id + "_" + photo.secret + "_b.jpg";
                    $("main").css("background", "no-repeat url(" + srcUrl + ") center/cover fixed");
            });
        
    }
}

var fondo = new Fondo("Túnez", "Túnez", "36.81550692588577", "10.183760414468203");