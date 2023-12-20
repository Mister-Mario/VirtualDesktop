"use strict";

class Api{
    constructor(){
        this.figuresPointer = 0;
        this.figures = ["C", "S", "R", "T"];
        this.checkAPISupport();
        this.setExplanation();
        this.setBotonesPantallasPequeñas();
        this.setPuntos();
        this.createCanvas();
        this.nextFigure();
    }

    checkAPISupport(){
        var p = document.createElement("p");
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
            //El navegador soporta el API File
            p.textContent = "Este navegador soporta el API File";
            document.querySelector("main").append(p);
            var p3 = document.createElement("p");
            p3.textContent = "El formato interno del fichero deberá de ser de una letra entre: C (para circulo), S (para cuadrado), R (para rectangulo), T (para triangulo) separados por ;";
            document.querySelector("main").append(p3);
            var lbl = document.createElement("label");
            lbl.textContent = "Ficheros: ";
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("onchange", "api.readInputFile(this.files);");
            lbl.append(input);
            document.querySelector("main").append(lbl);
        }
        else{
            p.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
            document.querySelector("main").append(p);
        }
       

    }

    readInputFile(files){
        var archivo = files[0];

        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) 
          {
            var lector = new FileReader();
            lector.onload = this.parseArchivo.bind(this, lector);  
            lector.readAsText(archivo);
            }
        else {
            alert("Error : ¡¡¡ Archivo no válido !!!");
            }
    }

    parseArchivo(lector){
        //C circle S square R rectangle T triangle separator ;
        this.figures = lector.result.split(';');
        this.figuresPointer = 0;
        var allCanvas = document.querySelectorAll("canvas");
        for(let i = 0; i < allCanvas.length; i++){
            var canvas = allCanvas[i];
            canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
        }
        document.querySelector
        this.setPuntos();
        this.createCanvas();
        this.nextFigure();
    }

    setExplanation(){
        var p = document.createElement("p");
        p.setAttribute("data-type" , "guia ordenador");
        p.textContent = "Guia del juego: El objetivo es arrastrar la figura rellena al hueco correspondiente"
        document.querySelector("main").append(p);
    }

    setPuntos(){
        var p = document.querySelector("p[data-type = puntuacion]");
        if(!p){
            p = document.createElement("p");
        }
        p.setAttribute("data-type" , "puntuacion");
        p.setAttribute("data-puntos" , -1);
        p.textContent = "Figuras arrastradas: -1";
        document.querySelector("main").append(p);
    }

    createCanvas(){
        var section = document.querySelector("section[data-type = playground]");
        if(!section){
            section = document.createElement("section");
            section.setAttribute("data-type", "playground");
        }
        
        section.innerHTML = "<h3>Juego de figuras</h3>";

        var canvas = document.createElement("canvas");
        canvas.setAttribute("data-figure", "S");
        canvas.setAttribute("data-type", "square");
        canvas.setAttribute("ondragover", "api.allowDrop(event)");
        canvas.setAttribute("ondrop", "api.drop(event)");
        var canvas1 = canvas.getContext('2d');

		canvas1.fillStyle = "blue";
		canvas1.fillRect(50, 50, 100, 100);
        canvas1.clearRect(60, 60, 80, 80);

        section.append(canvas);

        var canvas = document.createElement("canvas");
        canvas.setAttribute("data-figure", "R");
        canvas.setAttribute("data-type", "rectangle");
        canvas.setAttribute("ondragover", "api.allowDrop(event)");
        canvas.setAttribute("ondrop", "api.drop(event)");
        var canvas1 = canvas.getContext('2d');

        canvas1.fillStyle = "red";
		canvas1.fillRect(50, 50, 125, 70);
        canvas1.clearRect(60, 60, 105, 50);
        section.append(canvas);

        var canvas = document.createElement("canvas");
        canvas.setAttribute("data-figure", "T");
        canvas.setAttribute("data-type", "triangle");
        canvas.setAttribute("ondragover", "api.allowDrop(event)");
        canvas.setAttribute("ondrop", "api.drop(event)");
        var canvas1 = canvas.getContext('2d');

		canvas1.beginPath();
		canvas1.strokeStyle = "purple";
		canvas1.moveTo(0, 10);
		canvas1.lineTo(0, 150);
		canvas1.lineTo(100, 150);
		canvas1.closePath();
        canvas1.lineWidth = 10;
		canvas1.stroke();
        section.append(canvas);

        var canvas = document.createElement("canvas");
        canvas.setAttribute("data-figure", "C");
        canvas.setAttribute("data-type", "circle");
        canvas.setAttribute("ondragover", "api.allowDrop(event)");
        canvas.setAttribute("ondrop", "api.drop(event)");
        var canvas1 = canvas.getContext('2d');
        canvas1.beginPath();
        
        canvas1.arc(75, 75, 70, 0, Math.PI * 2, true);
        canvas1.lineWidth = 4;
        canvas1.stroke();
        section.append(canvas);


        var canvas = document.createElement("canvas");
        canvas.setAttribute("data-type", "figure");
        canvas.setAttribute("draggable", "true");
        canvas.setAttribute("ondragstart", "api.drag(event)");
        section.append(canvas);

        document.querySelector("main").append(section);
    }

    nextFigure(){
        var canvas = document.querySelector("[data-type = figure]");
        var canvas1 = canvas.getContext('2d');
        canvas1.clearRect(0, 0, canvas.width, canvas.height);
        var found = false;
        do{
            found = true;
            switch(this.figures[this.figuresPointer]){
                case "C":
                    canvas.setAttribute("data-figure", "C");
                    canvas1.fillStyle = "black";
                    canvas1.beginPath();
                    canvas1.arc(75, 75, 60, 0, Math.PI * 2, true);
                    canvas1.fill();
                    break;
                case "S":
                    canvas.setAttribute("data-figure", "S");
                    canvas1.fillStyle = "blue";
                    canvas1.fillRect(20, 20, 80, 80);
                    break;
                case "R":
                    canvas.setAttribute("data-figure", "R");
                    canvas1.fillStyle = "red";
                    canvas1.fillRect(20, 20, 105, 50);
                    break;
                case "T":
                    canvas.setAttribute("data-figure", "T");
                    canvas1.beginPath();
                    canvas1.fillStyle = "purple";
                    canvas1.moveTo(10, 10);
                    canvas1.lineTo(10, 140);
                    canvas1.lineTo(90, 140);
                    canvas1.closePath();
                    canvas1.fill();
                    break;
                default:
                    found = false;
                    
                    break;
            }
            this.figuresPointer += 1;
        } while(!found && this.figuresPointer < this.figures.length);

        var puntos = document.querySelector("p[data-type = puntuacion]");
        puntos.setAttribute("data-puntos", (parseInt(puntos.getAttribute("data-puntos")) + 1));
        puntos.textContent = "Figuras arrastradas: " + parseInt(puntos.getAttribute("data-puntos")); 

        if(this.figuresPointer > this.figures.length){
            canvas1.clearRect(0, 0, canvas.width, canvas.height);
            window.alert("Felicidaded has completado el juego"); 
        }
         
    }

    drag(event){
        event.dataTransfer.setData("text/plain", document.querySelector("[data-type = figure]").getAttribute("data-figure"));
    }

    allowDrop(event){
        event.preventDefault();
    }

    drop(event){
        event.preventDefault();
        if(event.dataTransfer.getData("text") == event.target.getAttribute("data-figure")){
            this.nextFigure();
        }
        else
            window.alert("Esa no es la figura correspondiente");
    }

    checkBoton(type){
        if(document.querySelector("[data-type=figure]").getAttribute("data-figure") == type){
            this.nextFigure();
        }
        else
            window.alert("Esa no es la figura correspondiente");
    }

    setBotonesPantallasPequeñas(){
        var p = document.createElement("p");
        p.setAttribute("data-type" , "guia pantalla pequeña");
        p.textContent = "Guia del juego: El objetivo es pulsar el boton con el nombre de la figura rellena";
        document.querySelector("main").append(p);

        var section = document.createElement("section");
        section.setAttribute("data-type", "botonera");

        var h2 = document.createElement("h2");
        h2.textContent = "Botonera";
        section.append(h2);

        var btnC = document.createElement("button");
        btnC.setAttribute("onclick", "api.checkBoton('C')");
        btnC.textContent = "Circulo";

        section.append(btnC);

        var btnS = document.createElement("button");
        btnS.setAttribute("onclick", "api.checkBoton('S')");
        btnS.textContent = "Cuadrado";

        section.append(btnS);

        var btnR = document.createElement("button");
        btnR.setAttribute("onclick", "api.checkBoton('R')");
        btnR.textContent = "Rectangulo";

        section.append(btnR);

        var btnT = document.createElement("button");
        btnT.setAttribute("onclick", "api.checkBoton('T')");
        btnT.textContent = "Triangulo";

        section.append(btnT);

        document.querySelector("main").append(section);
    }
}

