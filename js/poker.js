/* Game Values */
const maxBet = 5; // Maximum number of credits you can bet at once.
var curBet = 1; // The curren number of credits. Starts at one.
var credits = 1000; // You start with 1000 credits. This may change.

/* Card variables */
var deck;
var hand = [];

/* UI Elements Values */
var holdEnabled = false;

$(document).ready(function() {
  deck = new Deck();
  $('#draw-button').text('DEAL');
  $('#num-credits').text(credits.toString());
});

/* Player Interactions */
$('#draw-button').click(function() {
  if($('#draw-button').text() === 'DEAL') {

    dealCards();

    // Subtract the credits from the player
    credits -= curBet;

    // Update the credits display
    $('#num-credits').text(credits.toString());

    // Change the button caption to 'DRAW'
    $('#draw-button').text('DRAW');
    holdEnabled = true;
    
  } else if($('#draw-button').text() === 'DRAW') {
    // If the text is not 'DEAL' then it's 'DRAW'

    drawCards();

    $('#draw-button').text('DEAL');

    // See if the player won anything.
    let winnings = checkForWin();
    credits += winnings;

    // Update the credits display
    $('#num-credits').text(credits.toString());

    // Poker Machines shuffle constantly when
    // the player isn't actually drawing or
    // dealing the cards. Not quite sure how
    // to do that yet, so I just shuffle at the
    // end of each hand.
    deck.Shuffle();

    // You can't hold a card if the hand hasn't
    // Started yet.
    holdEnabled = false;    
  }
});

/* ---------------------------------------- */
/* Routines to toggle hold on a card. The   */
/* player can either click on the card or   */
/* the word hold beneath the card to hold   */
/* it before drawing the cards from the     */
/* deck. If held, it will not be replaces.  */
/* ---------------------------------------- */
$('.hold').click(function() {
  if(holdEnabled) {
    toggleHold(getIdNum($(this).attr('id')));
  }
});

$('.card').click(function() {
  if(holdEnabled) {
    // toggle the 'held' class on the hold
    // with the same ending number.
    toggleHold(getIdNum($(this).attr('id')));
  }
});

/* ---------------------------------------- */
/* The following routines set the number of */
/* credits bet for the hand.                */
/* ---------------------------------------- */
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

/* ---------------------------------------- */
/* Deals a fresh hand. Replaces all of the  */
/* cards currently in the hand with new     */
/* cards.                                   */
/* ---------------------------------------- */
function dealCards() {
    // Clear the hand. If we're dealing,
    // we're starting fresh.
    hand.length = 0;

    // Get five new cards for the hand.
    for(let i = 1; i <= 5; i++) {
      let card = deck.Next();
      hand.push(card);
      showCard("#card-" + i, card.GetImageName());
    }
}

function drawCards() {
  for(let i = 1; i <= 5; i++) {
    // If the card is not held, get put the next card here.
    if( !($('#hold-' + i.toString()).hasClass('held')) ) {
      let card = deck.Next();
      showCard("#card-" + i, card.GetImageName());
      hand[i-1] = card;
    } else {
      clearHold(i);
    }
  }
}

function showCard(cardId, cardImage) {
  $(cardId).css('background-image', "url(" + cardImage + ")");
}

// Extract the number (which identifies the
// position of the card) in order to change
// image, or mark a card as held or not helt.
function getIdNum(id) {
  return id[id.length - 1];
}

function toggleHold(num) {
  $('#hold-' + num).toggleClass('held');
  $('#card-held-' + num).toggle();
}

function clearHold(num) {
  // remove the held status on a particular card
  $('#hold-' + num).removeClass('held');
  $('#card-held-' + num).hide();
}

/* ------------------------------------------ */
/* The code below this point checks the hand  */
/* to see if the player wont. It might be     */
/* better if this code moved into the other   */
/* folder with Card and Deck?                 */
/* ------------------------------------------ */

function checkForWin() {
/* ------------------------------------------ */
/* Checks the hand for winning combinations.  */
/* Need to find a way to return a message as  */
/* well to tell the play what cause the win!  */
/* ------------------------------------------ */

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
    // If this isn't also a flush, we need to pay off
    // for a straight.
    isStraight = true;
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
      ifFourKind = true;
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