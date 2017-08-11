// Business Logic - Init functions
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

// Business Logic - Util functions
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

// UI Utils
function displayPin(pin) {
    var $pin = $('#pin');
    $pin.html('Your PIN is ' + pin);
    $pin.fadeIn();
}

// General Flow
/*
1. User is presented with welcome splash screen and PIN
2. Instruction dialogue appears on atm screen
3. Program listens for inputs from buttons and slots.
4. Program modifies dialogue on screen as user advances.
END: User is presented with congratulations screen
*/

// Init Flow
createAccount();
savePinToLocalStorage(createAPin());
saveTestPinToLocalStorage();
displayPin(getPinFromLocalStorage());

(function modal(){
    $('#modal').fadeIn('slow');
})();

// NOTE: each click event has a different function depending on the state of the program

var stateContainer = {
    state: 'login'
    // states:
    // 'login'
    // 'show balance'
    // 'withdrawl'
    // 'deposit'
    // 'deposit confirm'
    // 'finish'
    // 'error'
}

// Initial Click Handlers
$('#dismissal-x').click(function(){
    if (stateContainer.state === 'login') {
        $('#modal').fadeOut('fast');
        $('#screen .prompt-message').text('Welcome to The Bank\'s ATM! Please insert your debit card to continue.');
        $('.card').addClass('glow-yellow');
    }
});

$('section.card').click(function () {
    if (stateContainer.state === 'login') {
        $('#screen .prompt-message').text('Please enter your pin.');
        $('.card').removeClass('glow-yellow');
        $('section.keypad-container').addClass('glow-yellow');
        $('.pin-entry').show();
    } else if (stateContainer.state === 'finish') {
        // state === 'finish'
        $('#screen .prompt-message').text('Thank you for using The Bank\'s ATM! Please take your card and recepit. Have a nice day!');
    }
})

$('.keypad button').click(function(e){
    if (stateContainer.state === 'login') {
        if ($('.pin-entry .row-asterisks').text().length < 4) {
            var currentPin = localStorage.getItem('testPin')
            localStorage.setItem('testPin', currentPin + e.target.innerHTML)
            $('.pin-entry .row-asterisks').append('<span>*</span>');
        }
        $('section.keypad-container').removeClass('glow-yellow');
    } else if (stateContainer.state === 'deposit' || stateContainer.state === 'withdrawl') {
        // show what is being typed in similar to pin and save amount as edited
    }
});

$('.keypad button.enter').click(function(e){
    if (stateContainer.state === 'login') {
        var testPin = getTestPinFromLocalStorage();
        if (loginToAccount(testPin) === 'login') {
            $('#screen .prompt-message').text('Which action would you like to take?');
            $('.pin-entry').hide();
            $('.screen-directions').css({
                display: 'flex'
            });
        } else {
            saveTestPinToLocalStorage('')
            $('.pin-entry .row-asterisks').html('');
            $('#screen .prompt-message').text('Please reenter you pin.')
        }
    } else if (stateContainer.state === 'deposit') {
        // confirm amount with user
    } else if (stateContainer.state === 'deposit confirm') {
        // show new balance and ask what they want to do next
    }
});

$('section.deposit').click(function () {
    if (stateContainer.state === 'deposit confirm') {
        $('#screen .prompt-message').text('Cash deposited.');
    }
})

$('section.withdrawl').click(function () {
    if (stateContainer.state === 'withdrawl') {
        $('#screen .prompt-message').text('Which action would you like to take? [Show Balance, Withdrawl, Deposit, Exit]');
    }
})

$('section.receipt').click(function () {
    if (stateContainer.state === 'finish') {
        $('#screen .prompt-message').text('Thank you for using The Bank\'s ATM! Please take your card and recepit. Have a nice day!');
    }
})

$('#show-balance').click(function(){
    if (stateContainer.state !== 'deposit' || stateContainer.state !== 'withdrawl' || stateContainer.state !== 'finish') {
        stateContainer.state = 'show balance';
    }
    if (stateContainer.state === 'show balance') {
        var balance = getBalance();
        $('#screen .prompt-message').text('Your balance is $' + balance + '.  \n Which action would you like to take?');
    }
});

$('#withdrawl').click(function(){
    if (stateContainer.state !== 'deposit' || stateContainer.state !== 'finish') {
        stateContainer.state = 'withdrawl';
    }
    if (stateContainer.state === 'withdrawl') {
        console.log('How much would you like to withdrawl?');
    }
});

$('#deposit').click(function(){
    if (stateContainer.state !== 'withdrawl' || stateContainer.state !== 'finish') {
        stateContainer.state = 'deposit';
    }
    if (stateContainer.state === 'deposit') {
        console.log('How much would you like to deposit?');
    }
});

$('#exit-or-finish').click(function(){
    if (stateContainer.state === 'finish') {
        $('#screen .prompt-message').text('Thank you for using The Bank\'s ATM! Please take your card and recepit. Have a nice day!');
    }
});

// Dialogue
/*
1. Welcome to the ATM Simulator! Your PIN is ####
2. Welcome to The Bank's ATM! Please insert your debit card to continue.
3. Please enter your pin.
[CORRECT PIN]
4. Which action would you like to take? [Show Balance, Withdrawl, Deposit, Exit]
[INCORRECT PIN] - Step 3.
[Show Balance]
1. Your balance is ####.
2. Which action would you like to take? [Withdrawl, Deposit, Finish]
[Withdrawl]
1. How much would you like to withdrawl?
2. Dispensing cash in withdrawl slot.
3. Please remove cash from withdrawl slot.
4. Which action would you like to take? [Withdrawl, Deposit, Finish]
[Deposit]
1. How much would you like to deposit?
2. Please insert cash into deposit slot.
3. Cash deposited.
4. Which action would you like to take? [Withdrawl, Deposit, Finish]
[Finish]
1. Returning card and printing receipt.
2. Thank you for using The Bank's ATM! Please take your card and receipt. Have a nice day!
3. <Go to Step 2>
[Exit] - option is always present
1. Returning card and printing receipt.
2. Thank you for using The Bank's ATM! Please take your card and recepit. Have a nice day!
3. <Go to Step 2>
*/