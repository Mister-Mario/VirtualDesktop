"use strict";

class Noticias{

    constructor(){
        this.checkAPISupport();

    }

    checkAPISupport(){
        document.querySelector("body").append(document.createElement("main"));
        var p = document.createElement("p");
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
            //El navegador soporta el API File
            p.textContent = "Este navegador soporta el API File";
            document.querySelector("main").append(p);
            var p2 = document.createElement("p");
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("onchange", "noticias.readInputFile(this.files);");
            p2.append(input);
            document.querySelector("main").append(p2);
            this.createCreadorDeNoticias();
        }
        else{
            p.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
            document.querySelector("main").append(p);
        }
       

    }

    createCreadorDeNoticias(){
        var section = document.createElement("section");
        section.setAttribute("data-type", "creador de noticias")
        //Crea header 
        var header = document.createElement("h2");
        header.textContent = "Agregar una noticia";
        section.append(header);
        //Crea titulo
        var titulo = document.createElement("p");
        titulo.textContent = "Titulo: ";
        var tituloIn = document.createElement("input");
        tituloIn.setAttribute("data-type", "titulo");
        tituloIn.setAttribute("type", "text");
        titulo.append(tituloIn);
        section.append(titulo);
        //Crea subtitulo
        var subtitulo = document.createElement("p");
        subtitulo.textContent = "Subtitulo: ";
        var subtituloIn = document.createElement("input");
        subtituloIn.setAttribute("data-type", "subtitulo");
        subtituloIn.setAttribute("type", "text");
        subtitulo.append(subtituloIn);
        section.append(subtitulo);
        //Crea contenido
        var contenido = document.createElement("p");
        contenido.textContent = "Contenido: ";
        var contenidoIn = document.createElement("input");
        contenidoIn.setAttribute("data-type", "contenido");
        contenidoIn.setAttribute("type", "text");
        contenido.append(contenidoIn);
        section.append(contenido);
        //Crea autor
        var autor = document.createElement("p");
        autor.textContent = "Autor: ";
        var autorIn = document.createElement("input");
        autorIn.setAttribute("data-type", "autor");
        autorIn.setAttribute("type", "text");
        autor.append(autorIn);
        section.append(autor);
        //Crea boton añadir
        var btn = document.createElement("button");
        btn.setAttribute("onclick", "noticias.addNoticia();")
        btn.textContent = "Añadir noticia";
        section.append(btn);

        document.querySelector("body").append(section);
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
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
            }   
    }

    parseArchivo(lector){
        var resultadoDividido = lector.result.split('\n');
        for(let i = 0; i < resultadoDividido.length; i++){
          var noticia = resultadoDividido[i].split('_');
          this.createNoticia(noticia);
        }
    }
    
    createNoticia(noticia){
        var section = document.createElement("section");
        section.setAttribute("data-type", "noticia");

        var titulo = document.createElement("h3");
        titulo.setAttribute("data-type", "titulo");
        titulo.textContent = noticia[0];
        section.append(titulo);

        var subTitulo = document.createElement("p");
        subTitulo.setAttribute("data-type", "subtitulo");
        subTitulo.textContent = noticia[1];
        section.append(subTitulo);

        var contenido = document.createElement("p");
        contenido.setAttribute("data-type", "contenido");
        contenido.textContent = noticia[2];
        section.append(contenido);

        var autor = document.createElement("p");
        autor.setAttribute("data-type", "autor");
        autor.textContent = noticia[3];
        section.append(autor);

        document.querySelector("main").append(section);
    }

    addNoticia(){
        var titulo = document.querySelector("input[data-type=titulo]");
        var subtitulo =  document.querySelector("input[data-type=subtitulo]");
        var contenido = document.querySelector("input[data-type=contenido]");
        var autor = document.querySelector("input[data-type=autor]");
        var noticia = [
            titulo.value,
            subtitulo.value,
            contenido.value,
            autor.value
        ]
        this.createNoticia(noticia);
        titulo.value = "";
        subtitulo.value = "";
        contenido.value = "";
        autor.value = "";
    }
}