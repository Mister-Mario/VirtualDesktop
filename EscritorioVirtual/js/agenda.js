"use strict";
class Agenda{
    constructor(){
        this.last_api_call = null;
        this.last_api_result = null;
    }

    getCarreras(){
        var agenda2 = this;
        var callAgain = false;
        if(this.last_api_call !== null){
            var now = new Date();
            callAgain = (now - this.last_api_call > 10 * 60 * 1000);
        }
        else
            callAgain = true;

        if(callAgain){
            this.last_api_call = new Date();
            $.ajax({
                    dataType: "xml",
                    url : "https://ergast.com/api/f1/current",
                    method : 'GET',                          
                    }).done(function(data){
                        agenda2.saveData(data);
                        agenda2.paintInformation();
                    });
        }
        else{
            this.paintInformation();
        }
             
    }

    saveData(data){
        this.last_api_result = data;    
    }

    paintInformation(){
        $("main").empty();

        $("main").append("<section data-type = 'carreras'></section>");
        $("Race", this.last_api_result).each((index, race) =>{
            $("section[data-type='carreras']").append("<section data-type = 'carrera' data-i ='" + index + "'></section>");
            $("section[data-i = '"+ index +"'")
                .append("<p>"+  $("RaceName",race).text() +"</p>")
                .append("<p>"+  $("CircuitName",race).text() +"</p>")
                .append("<p> Fecha: "+  $("Date",race)[0].textContent +"</p>")
                .append("<p> Hora: "+  $("Time",race)[0].textContent.split('Z')[0] +"</p>")
                .append("<p>Latitud: "+  $("Location",race).attr("lat") +"</p>")
                .append("<p>Longitud: " +  $("Location",race).attr("long") +"</p>");
})
    }
}


var agenda = new Agenda();