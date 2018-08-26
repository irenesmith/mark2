/* Game Values */
const maxBet = 5; // Maximum number of credits you can bet at once.
var curBet = 1; // The curren number of credits. Starts at one.
var credits = 1000; // You start with 1000 credits. This may change.

/* Card variables */
var deck;
var hand;

/* UI Elements Values */
var holdEnabled = false;

$(document).ready(function() {
  deck = new Deck();
  hand = new Hand();
  $('#draw-button').text('DEAL');
  $('#num-credits').text(credits.toString());
});

/* Player Interactions */
$('#draw-button').click(function() {
  if($('#draw-button').text() === 'DEAL') {

    hand.DealHand(deck);

    // Subtract the credits from the player
    credits -= curBet;

    // Update the credits display
    $('#num-credits').text(credits.toString());

    // Change the button caption to 'DRAW'
    $('#draw-button').text('DRAW');
    holdEnabled = true;
    
    for(let i = 1; i <= 5; i++) {
      showCard(('#card-' + i), hand.cards[i - 1].GetImageName());
    }

  } else if($('#draw-button').text() === 'DRAW') {
    // If the text is not 'DEAL' then it's 'DRAW'

    hand.DrawCards(deck);

    $('#draw-button').text('DEAL');

    for(let i = 1; i <= 5; i++) {
      showCard(('#card-' + i), hand.cards[i - 1].GetImageName());
       if(hand.cards[i - 1].held) {
        clearHold(i);
      }
    }

    // See if the player won anything.
    let winnings = hand.CheckForWin();
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

function showCard(cardId, cardImage) {
  let img = "url(" + cardImage + ")";
  $(cardId).css('background-image', img);
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
  hand.cards[i - 1].HoldCard(true);
}

function clearHold(num) {
  // remove the held status on a particular card
  $('#hold-' + num).removeClass('held');
  $('#card-held-' + num).hide();
  hand.cards[i = 1].HoldCard(false);
}
