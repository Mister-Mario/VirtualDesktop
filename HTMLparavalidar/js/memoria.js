"use strict";
class Memoria{
    elements = {
        "members": [
          {
            "data-state" : "unflipped",
            "element" : "HTML5",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "CSS3",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "JS",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "PHP",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "SVG",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "W3C",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "HTML5",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "CSS3",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "JS",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "PHP",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "SVG",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
          },
          {
            "data-state" : "unflipped",
            "element" : "W3C",
            "source" : "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
          }
        ]
      }
    constructor (){
        this.hasFilppedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.suffleElements();
        this.createElements();
        this.addEventListeners(document.querySelectorAll('section[data-name = "game"] article'));
    }

    suffleElements(){
        // Loop through array starting at the last index
        for (let i = this.elements.members.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));

            // Swap elements at indexes i and j (single line)
            [this.elements.members[i], this.elements.members[j]] = [this.elements.members[j], this.elements.members[i]];
        }
    }

    unflipCards(){
      setTimeout(() => {
        this.firstCard.setAttribute("data-state", "unflipped");
        this.secondCard.setAttribute("data-state", "unflipped")
        this.resetBoard();
      }, 2500);
        
    }

    resetBoard(){
        this.firstCard = null;
        this.secondCard = null;
        this.hasFilppedCard = false;
        this.lockBoard = false;
    }

    checkForMatch(){
      this.lockBoard = true;
      this.firstCard.getAttribute("data-element") === this.secondCard.getAttribute("data-element") ? 
        this.disableCards() : this.unflipCards();
    }

    disableCards(){
      this.firstCard.setAttribute("data-state", "revealed");
      this.secondCard.setAttribute("data-state", "revealed");
      this.resetBoard();
    }

    createElements(){
      var section = document.createElement("section");
      section.setAttribute("data-name", "game");
      var h3 = document.createElement("h3");
      h3.textContent = "Cartas"
      section.append(h3);
      var article = null;
      var h4 = null;
      var img = null;
      var card = null;
      for(let i = 0; i < this.elements.members.length; i++){
        card = this.elements.members[i];
        article = document.createElement("article");
        article.setAttribute("data-element", card["element"]);
        article.setAttribute("data-state", "unflipped");
        h4 = document.createElement("h4");
        h4.textContent = "Tarjeta de memoria";
        img = document.createElement("img");
        img.setAttribute("src", card["source"]);
        img.setAttribute("alt", card["element"]);
        
        article.appendChild(h4);
        article.appendChild(img);
        section.appendChild(article);
      }
      
      document.querySelector("main").appendChild(section);
    }

    addEventListeners(cards){
      for(let i = 0; i < cards.length; i++){
        cards[i].onclick = this.flipCard.bind(cards[i], this);
      }
    }

    flipCard(game){
      if(this.getAttribute("data-state") === "revealed")
        return;
      if(game.lockBoard)
        return;
      if(this.getAttribute("data-state")  === "flip")
        return;

      this.setAttribute("data-state", "flip");

      if(game.hasFilppedCard){
        game.secondCard = this;
        game.checkForMatch();
      }
      else{
        game.hasFilppedCard = true;
        game.firstCard = this;
      }
        
    }
    
}


  