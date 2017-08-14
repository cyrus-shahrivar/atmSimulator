// TODOs Punchlist
/*
After prototype user testing:
- error handling
- fancy design
*/

// Program Variables
///////////////////////////////////////////////////////////
// NOTE: each click event has a different function depending on the state of the program
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
var stateContainer = {
    state: 'login'
    // states:
    // 'login'
    // 'show balance'
    // 'withdrawl'
    // 'withdrawl confirm'
    // 'deposit'
    // 'deposit confirm'
    // 'finish'
    // 'error'
};

var hasAssistanceMode = false;
// Buttons
var $modalCloseButton = $('#dismissal-x');
var $keypadNumbers = $('.keypad button.number');
var $keypadEnter = $('.keypad button.enter');
var $showBalanceButton = $('#show-balance');
var $withdrawlButton = $('#withdrawl');
var $depositButton = $('#deposit');
var $finishButton = $('#exit-or-finish');
var $assistanceButton = $('.assistanceButton');
// Slots
var $cardSlot = $('section.card');
var $depositSlot = $('section.deposit');
var $withdrawlSlot = $('section.withdrawl');
var $receiptSlot = $('section.receipt');
// Other Elements
var $modal = $('#modal');
var $screenMessage = $('#screen .prompt-message');
var $screenDirections = $('.screen-directions');
var $pinEntry = $('.pin-entry');
var $pinAsterisks = $('.pin-entry .row-asterisks');
var $numberEntryContainer = $('.number-entry');
var $numberEntry = $('.number-entry .row-numbers');
var $keypadContainer = $('section.keypad-container');
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Business Logic - Init functions
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function createAPin () {
    var start = 1000;
    var endNotInclusive = 10000;
    var randomNumber = Math.floor(Math.random()*(endNotInclusive - start)) + start;
    return String(randomNumber);
}

function savePinToLocalStorage(pin) {
    return localStorage.setItem('pin', pin);
}

function saveTestPinToLocalStorage(){
    return localStorage.setItem('testPin', '');
}

function createAccount() {
    localStorage.setItem('balance', Math.floor(Math.random()*1000));
}
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Business Logic - Util functions
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function getPinFromLocalStorage() {
    return localStorage.getItem('pin');
}

function getTestPinFromLocalStorage() {
    return localStorage.getItem('testPin');
}

function loginToAccount(pin) {
    var localPin = getPinFromLocalStorage();
    if (localPin === pin) {
        return 'login'
    } else {
        return 'logout'
    }
}

function getBalance() {
    return Number(localStorage.getItem('balance'));
}

function deposit(amount) {
    var balance = Number(getBalance());
    var newBalance = balance + Number(amount);
    localStorage.setItem('balance', newBalance)
    return true;
}

function withdrawl(amount) {
    var balance = getBalance();
    var newBalance = balance - Number(amount);
    if (newBalance >= 0) {
        localStorage.setItem('balance', newBalance)
        return true;
    } else {
        return false;
    }
}
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// UI Utils
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function displayPin(pin) {
    var $pin = $('#pin');
    $pin.html('Your PIN is ' + pin);
    $pin.fadeIn();
}
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Initial Click Handlers
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
$modalCloseButton.click(function(){
    if (stateContainer.state === 'login') {
        $modal.fadeOut('fast');
        $('main').css({
            display: 'flex'
        });
        $screenMessage.text('Welcome to The Bank\'s ATM! Please insert your debit card to continue.');
        if (hasAssistanceMode) {
            $cardSlot.addClass('glow-yellow');
        }
    }
});

$cardSlot.click(function () {
    if (stateContainer.state === 'login') {
        $screenMessage.text('Please enter your pin.');
        if (hasAssistanceMode) {
            $cardSlot.removeClass('glow-yellow');
            $keypadContainer.addClass('glow-yellow');
        }
        $pinEntry.show();
    } else if (stateContainer.state === 'finish') {
        // state === 'finish'
        $screenMessage.text('Thank you for using The Bank\'s ATM! Please take your card and recepit. Have a nice day!');
    }
})

$keypadNumbers.click(function(e){
    if (stateContainer.state === 'login') {
        if ($pinAsterisks.text().length < 4) {
            var currentPin = localStorage.getItem('testPin')
            localStorage.setItem('testPin', currentPin + e.target.innerHTML)
            $pinAsterisks.append('<span>*</span>');
        }
        if (hasAssistanceMode) {
            $keypadContainer.removeClass('glow-yellow');
        }
    } else if (stateContainer.state === 'deposit' || stateContainer.state === 'withdrawl') {
        // show what is being typed in similar to pin and save amount as edited
        console.log(e.target.innerHTML)
        $numberEntryContainer.show();
        $numberEntry.append('<span>' + e.target.innerHTML + '</span>');
    }
});

$keypadEnter.click(function(e){
    if (stateContainer.state === 'login') {
        var testPin = getTestPinFromLocalStorage();
        if (loginToAccount(testPin) === 'login') {
            $screenMessage.text('Which action would you like to take?');
            $pinEntry.hide();
            $screenDirections.css({
                display: 'flex'
            });
        } else {
            saveTestPinToLocalStorage('')
            $pinAsterisks.html('');
            $screenMessage.text('Please reenter you pin.')
        }
    } else if (stateContainer.state === 'deposit') {
        stateContainer.state = 'deposit confirm';
        $screenMessage.text('Are you sure you would like to deposit this amount?');
    } else if (stateContainer.state === 'deposit confirm') {
        $numberEntryContainer.hide();
        $screenMessage.text('Please deposit money into deposit slot below');
    } else if (stateContainer.state === 'withdrawl') {
        stateContainer.state = 'withdrawl confirm';
        $screenMessage.text('Are you sure you would like to withdrawl this amount?');
    } else if (stateContainer.state === 'withdrawl confirm') {
        $numberEntryContainer.hide();
        $screenMessage.text('Please take your money from the withdrawl slot');
    }
});

$depositSlot.click(function () {
    if (stateContainer.state === 'deposit confirm') {
        var amountToDeposit = $numberEntry.text().split('$')[1];
        deposit(amountToDeposit);
        $numberEntry.text('$');
        $screenMessage.html('');
        $screenMessage.append('<p>Cash deposited.</p>');
        $screenMessage.append('<p>Your new balance is: $' + getBalance() + ' </p>');
        $screenMessage.append('<p>Which action would you like to take?</p>');
    }
})

$withdrawlSlot.click(function () {
    if (stateContainer.state === 'withdrawl confirm') {
        var amountToWithdrawl = $numberEntry.text().split('$')[1];
        withdrawl(amountToWithdrawl);
        $numberEntry.text('$');
        $screenMessage.html('');
        $screenMessage.append('<p>Cash withdrawn.</p>');
        $screenMessage.append('<p>Your new balance is: $' + getBalance() + ' </p>');
        $screenMessage.append('<p>Which action would you like to take?</p>');
    }
})

$receiptSlot.click(function () {
    $modal.find('h1').text('Congratulations!');
    $modal.find('h2').text('You have completed trying out the ATM simulator.');
    $modalCloseButton.hide();
    $modal.fadeIn();
})

$showBalanceButton.click(function(){
    if ((stateContainer.state !== 'deposit' || stateContainer.state !== 'withdrawl') && stateContainer.state !== 'finish') {
        stateContainer.state = 'show balance';
    }
    if (stateContainer.state === 'show balance') {
        var balance = getBalance();
        $screenMessage.text('Your balance is $' + balance + '.  \n Which action would you like to take?');
    }
});

$withdrawlButton.click(function(){
    if (stateContainer.state !== 'deposit' && stateContainer.state !== 'finish') {
        stateContainer.state = 'withdrawl';
    }
    if (stateContainer.state === 'withdrawl') {
        $screenMessage.text('How much would you like to withdrawl?');
    }
});

$depositButton.click(function(){
    if (stateContainer.state !== 'withdrawl' && stateContainer.state !== 'finish') {
        stateContainer.state = 'deposit';
    }
    if (stateContainer.state === 'deposit') {
        $screenMessage.text('How much would you like to deposit?');
    }
});

$finishButton.click(function(){
    stateContainer.state = 'finish';
    $screenMessage.html('');
    $screenMessage.append('<p>Returning card and printing receipt.</p>')
    $screenMessage.append('<p>Thank you for using The Bank\'s ATM! Please take your card and recepit. Have a nice day!</p>');
});

$assistanceButton.click(function () {
    hasAssistanceMode = !(hasAssistanceMode);
    var message = hasAssistanceMode ? 'On' : 'Off';
    $(this).html('Help Mode ' + message);
});
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Init Flow
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
createAccount();
savePinToLocalStorage(createAPin());
saveTestPinToLocalStorage();
displayPin(getPinFromLocalStorage());

(function modal(){
    $modal.fadeIn('fast');
})();
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
