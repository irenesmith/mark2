const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

class Card {
  constructor(rank, suit, cardImg) {
    this.rank = rank;
    this.suit = suit;
    this.cardImgName = 'img/card' + suits[suit] + ranks[rank] + '.png';
    this.faceUp = false;
  }

  Flip() {
    this.faceUp = !this.faceUp;
  }

  IsFaceup() {
    return this.faceUp;
  }

  GetImageName() {
    return this.cardImgName;
  }
}

class Deck {
  constructor() {
    // Clear out the deck if it exists.

    this.numCards = 52;
    this.cards = [];
    this.curCard = 0;
    this.CardBack = "img/cardBack_blue2.png";

    for(let suit = 0; suit < 4; suit++) {
      for(let rank = 0; rank < 13; rank++) {
        var card = new Card(rank, suit);
        this.cards.push(card);
      }
    }

    this.Shuffle();
  }

  Shuffle() {
    for(let i = 0; i < this.numCards; i++) {
      let j = getRandomInt(52);
      let card1 = this.cards[j];
      let card2 = this.cards[i];
      this.cards[j] = card2;
      this.cards[i] = card1;
    }
    this.curCard = 0;  
  }

  Next() {
    // If we are out of cards, return
    // null instead of a card.
    if(this.curCard >= this.numCards) {
      return null;
    }
    return this.cards[this.curCard++];
  }

  Compare(Card1, Card2) {
    if (Card1.rank < Card2.rank) {
      return -1;
    }
    if (Card1.rank > Card2.rank) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
