// PokerGame holds mostly money information
const pokerGame = {
    currentBank: null,
    currentBet: null,
    placeBet: function () {
        this.currentBank -= this.currentBet;
        return this.currentBank;
    }
}

pokerGame.currentBank = 500;
pokerGame.currentBet = 25;
document.getElementById("bank").value = pokerGame.currentBank;

document.getElementById("bet").addEventListener("change", function () {
    // get the value that was changed
    // update pokerGame bet
    pokerGame.currentBet = parseInt(this.value);

    // do we not enough money? - warn the user
    if (pokerGame.currentBank >= pokerGame.currentBet) {
        document.getElementById("bank").value = pokerGame.placeBet();
    } else {
        document.getElementById("status").innerText = "Insufficient Funds";

        // remove after a two seconds
        setTimeout(function () {
            document.getElementById("status").innerText = "";
        }, 2000);
    }
})

// PokerCard holds information about cards
class PokerCard {
    constructor(cardSuit, cardRank) {
        this.suit = cardSuit;
        this.rank = cardRank;
    }
    showCard = function () {
        return `Your card is a ${this.rank} of ${this.suit}`;
    }
}

// Deck holds the deck and knows about suits, ranks, and cards
class Deck {
    suits = ["spades", "hearts", "clubs", "diamonds"];
    ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    cards = [];

    createDeck() {
        for (const suit of this.suits){
            for(const rank of this.ranks) {
                const newCard = new PokerCard(suit, rank);
                this.cards.push(newCard);
            }
        }
    }

    shuffle() {
        this.cards.sort(function() {
            return 0.5 - Math.random();
        });
    }

    dealHand(player) {
        const numOfCards = player.NUM_OF_CARDS_IN_HAND;

        // ARRAY METHODS - SPLICE vs SLICE
        // splice - adds/removes items in the position select
        // slice - retuns an array of COPIES of the values of the array starting at the position selected

        // IF THERE ARE 10 OR LESS CARDS, NEED TO SHUFFLE IN A NEW DECK!
        if (this.cards.length < 10) {
            // shuffle the deck, then give new cards
            const newDeck = new Deck();
            newDeck.createDeck();
            newDeck.shuffle();

            // COMBINE old deck and the new deck using CONCAT
            this.cards = this.cards.concat(newDeck.cards);
        }
        player.cards = this.cards.splice(0, numOfCards);
    }
}

// players need a HAND of cards
class PlayerHand {
    // cards - which cards are in our hand?
    cards = [];
    // how many do we have? - should have max of 5
    NUM_OF_CARDS_IN_HAND = 5;
    // how many cards we have drawn? - draw twice
    draw = 0;
}

// add cardImage to PokerCard object - via prototype
PokerCard.prototype.cardImage = function() {
    return `./img/${this.rank}_${this.suit}.png`;
}

// JUST TESTING - leave for now
// const testDeck = new Deck();
// testDeck.createDeck();
// testDeck.shuffle();
// const testPlayer = new PlayerHand();
// testDeck.dealHand(testPlayer);
// console.log(testDeck);
// console.log(testPlayer);

// get all of the cards from the DOM
const cardImages = document.getElementsByClassName("cardImg");

const gameDeck = new Deck();
gameDeck.createDeck();
gameDeck.shuffle();
const deal = new PlayerHand();

// get all of the buttons 
const dealButton = document.getElementById("dealB");
const drawButton = document.getElementById("drawB");
const standButton = document.getElementById("standB");
const betButton = document.getElementById("bet")

dealButton.addEventListener("click", function() {
    gameDeck.dealHand(deal);

    // change the images of the cards in the GUI based on card in hand
    for(let i = 0; i < cardImages.length; i++) {
        cardImages[i].src = deal.cards[i].cardImage();
    }

    dealButton.disabled = true;
    drawButton.disabled = false;
    standButton.disabled = false;
    betButton.disabled = true;
});

// replace a card?
PlayerHand.prototype.replaceCard = function(index, pokerDeck) {
    this.cards[index] = pokerDeck.cards.shift();
}

// player clicks on cards that they want to replace
for(let i = 0; i < cardImages.length; i++) {
    cardImages[i].addEventListener("click", function(){
        if(this.src.includes("cardback.png")) {
            this.src = deal.cards[i].cardImage();
        } else {
            this.src = "./img/cardback.png";
        }
    });
}

drawButton.addEventListener("click", function() {
    deal.draw++;

    // disable button if have drawn twice
    if (deal.draw >= 2) {
        drawButton.disabled = true;
    }

    for(let i = 0; i < cardImages.length; i++) {
        // replace cards that are flipped over
        if(cardImages[i].src.includes("cardback.png")) {
            deal.replaceCard(i, gameDeck);
            cardImages[i].src = deal.cards[i].cardImage();
        }
    }

});

standButton.addEventListener("click", function() {

    // reset draw number to 0
    deal.draw = 0;

    // figure out the outcome of the hand (win / loss / etc?)
    const outcome = handType(deal);

    // PAYOUT
    payBet(outcome);

    // update the status with the outcome
    document.getElementById("status").innerText = outcome;
    // remove after a two seconds
    setTimeout(function () {
        document.getElementById("status").innerText = "";
    }, 2000);

    // allow the player to play again
    dealButton.disabled = false;
    drawButton.disabled = true;
    standButton.disabled = true;
    betButton.disabled = false;
});

function payBet(result){
    let pay = 0;
    switch(result){
       case "Royal Flush":
          pay = pokerGame.currentBet * 250;
          break;
       case "Straight Flush":
          pay = pokerGame.currentBet * 50;
          break;
       case "Four of a Kind":
          pay = pokerGame.currentBet * 25;
          break;
       case "Full House":
          pay = pokerGame.currentBet * 9;
          break;
       case "Flush":
          pay = pokerGame.currentBet * 6;
          break;
       case "Straight":
          pay = pokerGame.currentBet * 4;
          break;
       case "Three of a Kind":
          pay = pokerGame.currentBet * 3;
          break;
       case "Two Pair":
          pay = pokerGame.currentBet * 2;
          break;
       case "Jacks or Better":
          pay = pokerGame.currentBet * 1;
          break;
    }
    pokerGame.currentBank += pay;
    document.getElementById("bank").value = pokerGame.currentBank;
 }

 //Console log
console.log("test");
