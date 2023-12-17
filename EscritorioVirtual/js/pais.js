"use strict";
        class Pais {
            constructor (nombrePais, nombreCapital, cantidadPoblacion){
                this.nombrePais = nombrePais;
                this.nombreCapital=nombreCapital;
                this.cantidadPoblacion = cantidadPoblacion;
            }
            setFormaGobierno(formaGobierno){
                this.formaGobierno = formaGobierno;
            }
            setCoordenadasCaptial(coordenadasCapital){
                this.coordenadasCapital = coordenadasCapital;
            }
            setReligionMayoritaria(religionMayoritaria){
                this.religionMayoritaria = religionMayoritaria;
            }
            getNombrePais(){
                return this.nombrePais;
            }
            getNombreCapital(){
                return this.nombreCapital;
            }
            getCantidadPoblacion(){
                return this.cantidadPoblacion;
            }
            getFormaGobierno(){
                return this.formaGobierno;
            }
            getCoordenadasCapital(){
                return this.coordenadasCapital;
            }
            getReligionMayoritaria(){
                return this.religionMayoritaria;
            }
            getInformacionSecundaria(){
                return "<ul><li>Población: "
                + this.getCantidadPoblacion() + "</li><li>Forma gobierno: " 
                + this.getFormaGobierno() + "</li><li>Religión mayoritaria: " 
                + this.getReligionMayoritaria() + "</li></ul>";
            }
            writeCoordenadas(){
                document.write("<p>Coordenadas de ");
                document.write(this.getNombreCapital());
                document.write(": "  + this.getCoordenadasCapital());
                document.write("</p>");
            }

            getPrevision(){
                var splitted = this.coordenadasCapital.split(',');
                var myUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + splitted[0] + "&lon=" + splitted[1] + "&appid=7baae707be19b600831960512de55c04&units=metric&lang=es";
                
                $.ajax({
                            dataType: "json",
                            url : myUrl,
                            method : 'GET',
                            success: function(datos){
                                var lista = datos.list;
                                var weather;
                                // 5 dias con 8 periodos en cada día
                                $("main").append("<section data-type=pronostico></section>")
                                for(let i = 0; i < 40; i+= 8){
                                    weather = lista[i];
                                    var fecha = weather.dt_txt;
                                    var temp_min = weather.main.temp_min;
                                    var temp_max = weather.main.temp_max;
                                    var humedad = weather.main.humidity;
                                    var icon = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
                                    var rain = weather.rain == undefined ? 0 : weather.rain;
                                    
                                    $("section[data-type='pronostico']").append("<section data-i = "+ i +" data-type=tiempo></section>");
                                    $("section[data-i = '" + i +"'][data-type='tiempo']").append("<img src=" + icon + " alt= Icono que representa el pronostico del tiempo/>")
                                        .append("<section data-i = "+ i +" data-type=datos></section>");
                                    $("section[data-i = '" + i +"'][data-type='datos']").append("<p>" + fecha +"</p>")
                                        .append("<p>🔥Temperatura máxima: " + temp_max +"</p>")
                                        .append("<p>❄ Temepatura mínima: " + temp_min +"</p>")
                                        .append("<p>☂ Lluvia: " + rain +"</p>")
                                        .append("<p>💧 Humedad: " + humedad +"%</p>");
                                }
                                
                            }     
                        });
            
        }
        }

        var pais = new Pais("Túnez", "Túnez", "12,26 millones");
        pais.setFormaGobierno("Republica");
        pais.setCoordenadasCaptial("36.81550692588577,10.183760414468203,4.0");
        pais.setReligionMayoritaria("Islam");