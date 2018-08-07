const maxBet = 5; // Maximum number of credits you can bet at once.
var curBet = 1; // The curren number of credits. Starts at one.
var credits = 1000; // You start with 1000 credits. This may change.
var holdEnabled = false;

var deck;
var hand = [];

$(document).ready(function() {
  deck = new Deck();
  $('#draw-button').text('DEAL');
  $('#num-credits').text(credits.toString());
});

$('#draw-button').click(function() {
  if($('#draw-button').text() === 'DEAL') {
    // Clear the hand.
    hand.length = 0;

    // Get five cards for the hand.
    for(let i = 1; i <= 5; i++) {
      let card = deck.Next();
      if(card === null) {
        console.log("shuffling Deck...");
        deck.Shuffle();
        card = deck.Next();
      }
      let imgId = "#card-" + i;
      $(imgId).attr('src', card.GetImageName());
      hand.push(card);
    }

    // Subtract the credits from the player
    credits -= curBet;
    $('#num-credits').text(credits.toString());

    // Change the button caption to 'DRAW'
    $('#draw-button').text('DRAW');
    holdEnabled = true;
    // TODO: Now enable the hold buttons.
    
  } else if($('#draw-button').text() === 'DRAW') {
    // If the text is not 'DEAL' then it's 'DRAW'
    for(let i = 1; i <= 5; i++) {
      // If the card is not held, get put the next card here.
      if( !($('#hold-' + i.toString()).hasClass('held')) ) {
        let card = deck.Next();
        if(card === null) {
          console.log("Shuffling Deck");
          deck.Shuffle();
          card = deck.Next();
        }
        let imgId = "#card-" + i;
        $(imgId).attr('src', card.GetImageName());
        hand[i-1] = card;
      } else {
        // remove the held status
        $('#hold-' + i).removeClass('held');
      }
    }

    $('#draw-button').text('DEAL');
    let winnings = checkForWin();
    credits += winnings;
    $('#num-credits').text(credits.toString());
    deck.Shuffle();
    holdEnabled = false;    
  }
});

$('.hold').click(function() {
  if(holdEnabled) {
    $(this).toggleClass('held');
  }
});

$('.card').click(function() {
  if(holdEnabled) {
    // toggle the 'held' class on the hold
    // with the same ending number.
    let cardId = $(this).attr('id');
    let num = cardId[cardId.length - 1];
    $('#hold-' + num).toggleClass('held');
  }
});

$('#bet-max').click(function() {
  curBet = maxBet;
  $('#curBet').text(curBet.toString());
});

$('#incBet').click(function() {
  if(curBet < 5) {
    curBet++;
    $('#curBet').text(curBet.toString());
  }
});

$('#decBet').click(function() {
  if(curBet > 1) {
    curBet--;
    $('#curBet').text(curBet.toString());
  }
});

// Checks the hand for winning combinations.
// Need to find a way to return a message as
// well to tell the play what cause the win!
function checkForWin() {
  // Check for a win.
  // First set all win types to false!
  let isRoyalStraight = false;
  let isStraight = false;
  let isFlush = false;

  // First sort the cards in the hand, to check
  // to see if there is a straight.
  hand.sort(deck.Compare);
  // Check for a royal straight.
  if(hand[0].rank == 1 && hand[1].rank == 9 && hand[2].rank == 10 && hand[3].rank == 11 && hand[4].rank == 12) {
    // Yes, it's a Royal Straight
    isRoyalStraight = true;
  } else if((hand[1].rank == (hand[0].rank + 1)) &&
      (hand[2].rank == (hand[1].rank + 1)) &&
      (hand[3].rank == (hand[2].rank + 1)) &&
      (hand[4].rank == (hand[3].rank + 1))) {
        isStraight = true;
  }

  // if the suits are all the same, this is a flush
  if((hand[1].suit == (hand[0].suit + 1)) &&
      (hand[2].suit == (hand[1].suit + 1)) &&
      (hand[3].suit == (hand[2].suit + 1)) &&
      (hand[4].suit == (hand[3].suit + 1))) {
        isFlush = true;
  }

  // if we have both a royal straight and a flush
  // then we have a royal flush.
  if(isRoyalStraight && isFlush)
    return 500 * curBet;

  if(isStraight && isFlush)
    return 40 * curBet;

  if(isFlush)
    return curBet * 5;

  if(isStraight)
    return curBet * 3;

  return findMatching();
}

function findMatching() {
  let isFourKind = false;
  let isThreeKind = false;
  let pairs = 0;
  let cardCount = [];

  // Count cards by rank
  for(let i = 0; i < 13; i++) {
    cardCount[i] = 0;
  }

  for(let i = 0; i < 5; i++) {
    cardCount[hand[i].rank] += 1;
  }

  // Four of a kind
  for(let i = 0; i < 13; i++) {
    if(cardCount[i] == 4) {
      if(i === 0) // Aces!
        return curBet * 50;
      else // 2 to King
        return curBet * 25;
    }

    if(cardCount[i] == 3) {
      isThreeKind = true;
    }

    if(cardCount[i] == 2) {
      pairs++;
    }

  }

  // Full House
  if(isThreeKind && pairs === 1)
    return curBet * 8;
  
  // Three of a kind
  if(isThreeKind)
    return curBet * 2;

  // Two Pair
  if(pairs === 2) {
    return curBet;
  }

  return 0;
}