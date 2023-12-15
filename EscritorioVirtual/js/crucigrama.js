"use strict";
class Crucigrama{
    constructor(board, tipo){
        this.board = board.split(',');
        this.tipo = tipo;
        this.rows = 11;
        this.cols = 9;
        this.init_time;
        this.end_time;
        this.isFinished = false;
        this.tablero = new Array(this.rows);
        for(let i = 0; i < this.rows; i++)
            this.tablero[i] = new Array(this.cols); 
        this.start();
    }

    start(){
        for(let i = 0; i < this.rows; i++)
            for(let j = 0; j < this.cols; j++)
                this.tablero[i][j] = this.board[i*this.cols + j] == '.' ? '0' : (this.board[i*this.cols + j] == '#' ? '-1' : this.board[i*this.cols + j] );
    }

    paintMathword(){
        var p;
        for(let i = 0; i < this.rows; i++)
            for(let j = 0; j < this.cols; j++){
                p = document.createElement("p");
                p.setAttribute("data-i", i);
                p.setAttribute("data-j", j);
                if(this.tablero[i][j] < 0) 
                    p.setAttribute("data-state", "empty");
                else if(this.tablero[i][j] == 0){
                    p.setAttribute("data-state", "");
                    p.onclick = this.setClicked.bind(p);
                }
                else{
                    p.setAttribute("data-state", "blocked");
                    p.textContent = this.tablero[i][j];
                }
                $("main").append(p);
        }
        
        this.init_time = Date.now();
    }

    setClicked(){
        $("main p[data-state = 'clicked']").attr("data-state", ""); //Encontramos el que estaba clicked y lo ponemos a empty
        this.setAttribute("data-state", "clicked"); //Ponemos el elemento que se clico a clicked
    }

    check_win_condition(){
        var isEmpty = false;
        $("p[data-state != 'empty']").each((index, p) => {
            isEmpty = isEmpty || (p.textContent == "");
        });
        return !isEmpty;
    }

    calculate_date_difference(){
        var timeExpent = this.end_time - this.init_time; //miliseconds
        var hours = Math.floor(timeExpent / 1000 / 60 / 60);
        var minutes = Math.floor(timeExpent / 1000 / 60 - hours * 60);
        var seconds = Math.floor(timeExpent / 1000 - (hours * 60 + minutes) * 60);
        return hours + ":" + minutes + ":" + seconds;
    }

    //This es document
    checkKey(crucigrama, event){
        if(!crucigrama.isFinished){
            if(crucigrama.checkAnyClicked()){
            var regex =  new RegExp(/^[1-9+\-*/]$/); // el \- es para indicar el caracter - y no que es un rango
            if(regex.test(event.key))
                crucigrama.introduceElement(event.key);
            }
            else
                alert("Selecciona una casilla primero");
        }
        
    }

    checkAnyClicked(){
        var anyClicked = false;

        $("p[data-state = 'clicked']").each(() => anyClicked = true);

        return anyClicked;
    }

    introduceElement(key) {
        var regex = new RegExp(/^[1-9+\-*/]$/); // el \- es para indicar el caracter - y no que es un rango
        if(regex.test(key)){
            var expression_row = true;
            var expression_col = true;
            
            //Aunque solo debería de a ver un p en clicked gracias a setClicked cogemos el primero por si acaso
            var selected = $("p[data-state = 'clicked']")[0]; 
           
            var i = new Number(selected.getAttribute("data-i"));
            var j = new Number(selected.getAttribute("data-j"));
            this.tablero[i][j] = key;
            var first_number;
            var second_number;
            var expression;
            var result;

            //Si es el borde no miramos a la derecha y tampoco ponemos row a false ya que no hay nada
            if(j + 1 != this.cols && this.tablero[i][j+1] != '-1'){
                for(let col = j + 1; col < this.cols; col++){
                    if(this.tablero[i][col] == '='){
                        first_number = this.tablero[i][col - 3];
                        second_number = this.tablero[i][col - 1];
                        expression = this.tablero[i][col - 2];
                        result = this.tablero[i][col + 1];

                        if(first_number != '0' && second_number != '0' && expression != '0' && result != '0'){
                            var operation = [first_number, expression, second_number]; 
                            expression_row = result == eval(operation.join(''));
                        }

                        break;
                    }
                }

                
            }
            //Lo mismo de antes pera para la columna
            if(i + 1 != this.rows && this.tablero[i+1][j] != '-1'){ 
                for(let row =  i + 1; row < this.rows; row++){
                    if(this.tablero[row][j] == '='){
                        first_number = this.tablero[row - 3][j];
                        second_number = this.tablero[row - 1][j];
                        expression = this.tablero[row - 2][j];
                        result = this.tablero[row + 1][j];

                        if(first_number != '0' && second_number != '0' && expression != '0' && result != '0'){
                            var operation = [first_number, expression, second_number]; 
                            expression_col = result == eval(operation.join(''));
                        }
                        break;
                    }
                }
                
                    
            }
            
            
            

            

            //Solo si todo sale bien
            if(expression_col && expression_row){
                selected.textContent = key;
                selected.setAttribute("data-state", "correct");
                this.tablero[i][j] = key;
            }
            else{
                this.tablero[i][j] = '0';
                //No reseteamos los valores del parrafo porque no los hemos tocado más que en el if de este else
                alert("El valor introducido no es correcto");
            }

            if(this.check_win_condition()){
                this.isFinished = true;
                this.end_time = new Date();
                alert("Crucigrama acabado en " + this.calculate_date_difference());
                this.createRecordForm();
            }
            
        }
    }

    createRecordForm(){
        $("body").append("<form action='#' method='post' name='formulario'>"+
        "<p>Nombre: <input type = 'text' name = 'nombre' /></p>"+
        "<p>Apellidos: <input type = 'text' name = 'apellidos'></input></p>"+
        "<p>Nivel crucigrama: <input type = 'text' name = 'nivel' value = "+ this.tipo +" readonly/> </p>"+
        "<p>Tiempo: <input type = 'text' name = 'tiempo' value = "+ ((this.end_time - this.init_time)/1000) +" readonly/> segundos</p>"+
        "<input type = 'submit' value='Guardar informacion'/>"+
        "</form>");
    }
}

// var crucigrama = new Crucigrama("4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,"
//                 + "*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16", "facil");

var crucigrama  = new Crucigrama("12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-" +
",.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-" +
",#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32", "medio");

// var crucigrama = new Crucigrama("4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-" +
// ",.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-" +
// ",.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72", "dificil");