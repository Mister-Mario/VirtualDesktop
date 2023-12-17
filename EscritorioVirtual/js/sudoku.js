"use strict";
class Sudoku{
    constructor (tablero){
        this.tableroTexto = tablero;
        this.maxFilas = 9;
        this.maxCols = 9;
        this.tablero = new Array(this.maxFilas);
        for(let i = 0; i < this.maxCols; i++)
            this.tablero[i] = new Array(this.maxCols);
        this.start();
    }

    start(){
        var counter = 0;
        for(let i = 0; i < this.maxFilas; i++)
            for(let j = 0; j < this.maxCols; j++){
                this.tablero[i][j] = this.tableroTexto[counter] === '.' ? 0 : this.tableroTexto[counter];
                counter += 1;
            }
                
    }

    setTablero(tablero){
        this.tableroTexto = tablero;
        this.start();
    }

    createStructure(){
        var main = document.querySelector("main");
        var p = null;
        for(let i = 0; i < this.maxFilas; i++)
            for(let j = 0; j < this.maxCols; j++){
                p = document.createElement("p");
                if(this.tablero[i][j] === 0){
                    p.setAttribute("data-state", "");
                    p.onclick = this.addClicked.bind(p, this);
                }
                else{
                    p.setAttribute("data-state", "blocked");
                    p.textContent = this.tablero[i][j];
                }
                main.append(p);
            }
    }

    paintSudoku(){
        this.createStructure();
    }

    addClicked(sudoku){
        if(sudoku.isAnyCellClicked())
            sudoku.getClickedCellRowCol(sudoku.getCellsOrderedByRow())[0].setAttribute("data-state", "");
        this.setAttribute("data-state", "clicked");
    }

    checkKey(sudoku, event){
        if (event.key >= '0' && event.key <= '9') {
            if(sudoku.isAnyCellClicked())
                sudoku.introduceNumber(event.key);
            else{
                alert("Por favor elige una casilla para rellenar");
            }
                
        }
    }

    isAnyCellClicked(){
        var cells = document.querySelectorAll("p");
        for(let i = 0; i < this.maxFilas; i++)
            for(let j = 0; j < this.maxCols; j++)
                if(cells[(i * 9) + j].getAttribute("data-state") === "clicked")
                    return true;
        return false;
    }

    getClickedCellRowCol(cells){
        for(let i = 0; i < this.maxFilas; i++)
            for(let j = 0; j < this.maxCols; j++)
                if(cells[i][j].getAttribute("data-state") === "clicked")
                    return [cells[i][j], i, j];
        return null;
    }

    introduceNumber(number){
        var cells = this.getCellsOrderedByRow();
        var cellInformation = this.getClickedCellRowCol(cells);
        if(!this.isNumberInCol(cells, number, cellInformation[2])
            && !this.isNumberInRow(cells, number, cellInformation[1])
            && !this.isNumberInSubGrid(cells, number, cellInformation[1], cellInformation[2])){
                cellInformation[0].onclick = null;
                cellInformation[0].setAttribute("data-state", "correct");
                cellInformation[0].textContent = number;
                if(this.isEveryCellFilled(cells))
                    alert("Felicidades el sudoku esta completo");
            }
    }

    isEveryCellFilled(cells){
        var flag = true;
        for(let i = 0; i < this.maxFilas; i++)
            for(let j = 0; j < this.maxCols; j++)
                flag = flag && (cells[i][j].getAttribute("data-state") === "blocked" 
                    || cells[i][j].getAttribute("data-state") === "correct");
                    
        return flag;
    }

    isNumberInCol(cells, number, col){
        for(let i = 0; i < this.maxFilas; i++){
            if(cells[i][col].textContent === number)
                return true;
        }
        return false;
    }

    isNumberInRow(cells, number, row){
        for(let i = 0; i < this.maxFilas; i++){
            if(cells[row][i].textContent === number)
                return true;
        }
        return false;
    }

    isNumberInSubGrid(cells, number, row, col){
        var subGridRowStart = (row - row%3);
        var subGridColStart = (col - col%3);
        for(let i = subGridRowStart; i < subGridRowStart + 3; i++)
            for(let j = subGridColStart; j < subGridColStart + 3; j++)
                if(cells[i][j].textContent === number)
                    return true;
        return false;
    }

    getCellsOrderedByRow(){
        var cells = document.querySelectorAll("p");
        for(let i = 0; i < this.maxFilas; i++){
            for(let j = 0; j < this.maxCols; j++){
                this.tablero[i][j] = cells[(i * this.maxCols) + j];
            }
        }

        return this.tablero;
    }
}

var sudoku = new Sudoku("3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6");