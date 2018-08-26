const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

class Card {
  constructor(rank, suit, cardImg) {
    this.rank = rank;
    this.suit = suit;
    this.cardImgName = '/img/card' + suits[suit] + ranks[rank] + '.png';
    this.faceUp = false;
    this.held = false;
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

  HoldCard(state) {
    // State is one of true - held
    // or false - not held
    this.held = state;
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

class Hand {
  constructor() {
    this.cards = Array(5);
  }

  DealHand(deck) {
    // Clear the hand. If we're dealing,
    // we're starting fresh.
    this.cards.length = 0;

    // Get five new cards for the hand.
    for(let i = 1; i <= 5; i++) {
      let card = deck.Next();
      this.cards.push(card);
    }
  }

  DrawCards(deck) {
    for(let i = 0; i < 5; i++) {
      // If the card is not held, get put the next card here.
      if( !this.cards[i].held ) {
        hand[i] = deck.Next();
      } else {
        hand[i].HoldCard(false);
      }
    }  
  }

  ToggleHold(num) {
    cards[num].HoldCard(!cards[num].held);
  }

  /* ------------------------------------------ */
  /* The code below this point checks the hand  */
  /* to see if the player wont. It might be     */
  /* better if this code moved into the other   */
  /* folder with Card and Deck?                 */
  /* ------------------------------------------ */

  CheckForWin() {
    /* ------------------------------------------ */
    /* Checks the hand for winning combinations.  */
    /* Need to find a way to return a message as  */
    /* well to tell the play what cause the win!  */
    /* ------------------------------------------ */
    
    // First set all win types to false!
      let isRoyalStraight = false;
      let isStraight = false;
    
      let winnings = this.findMatching();

      if(winnings > 0)
        return winnings;

      // First sort the cards in the hand, to check
      // to see if there is a straight.
      this.cards.sort(deck.Compare);
    
      // Check for a royal straight.
      if(this.cards[0].rank == 1 && (this.cards[4].rank - this.cards[1].rank) == 3) {
        // Yes, it's a Royal Straight
        isRoyalStraight = true;
        // If this isn't also a flush, we need to pay off
        // for a straight.
        isStraight = true;
      } else if((this.cards[4].rank - this.cards[0].rank) === 4) {
            isStraight = true;
      }
    
      let hasFlush = isFlush(hand);
    
      // if we have both a royal straight and a flush
      // then we have a royal flush.
      if(isRoyalStraight && hasFlush(hand))
        return 500 * curBet;
    
      if(isStraight && hasFlush)
        return 40 * curBet;
    
      if(hasFlush)
        return curBet * 5;
    
      if(isStraight)
        return curBet * 3;
    
    }
  
    isFlush(hand) {
      // if the suits are all the same, this is a flush
      let suit = hand[0].suit;
      let suitCount = 1;
      for(let i = 1; i < 5; i++) {
        if(hand[i].suit === suit) {
          suitCount++;
        } else {
          return false;
        }
      }
      return suitCount === 5;
    }
  
    findMatching() {
      let isFourKind = false;
      let isThreeKind = false;
      let cardCount = [];
    
      // Count cards by rank
      for(let i = 0; i < 13; i++) {
        cardCount[i] = 0;
      }
    
      for(let i = 0; i < 5; i++) {
        cardCount[hand[i].rank] += 1;
      }
    
      // Four of a kind
      if(cardCount.includes(4)) {
        isFourKind = true;
        if(cardCount[0] === 4) {
          return curBet * 50;
        } else {
          return curBet * 25;
        }
      }
    
      if(cardCount.includes(3)) {
        isThreeKind = true;
      }
    
      let pairs = 0;
      cardCount.forEach(function(count) {
        if(count === 2) {
          pairs++;
        }
      });
    
      // Full House
      if(isThreeKind && pairs === 1) {
        return curBet * 8;
      }
      
      // Three of a kind
      if(isThreeKind) {
        return curBet * 2;
      }
    
      // Two Pair
      if(pairs === 2) {
        return curBet;
      }
    
      return 0;
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
