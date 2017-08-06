// Business Logic - Init functions
function createAPin () {
    var randomNumber = Math.floor(Math.random()*10000);
    if (randomNumber < 1000) {
        return '0' + String(randomNumber);
    } else {
        return String(randomNumber);
    }
}

function savePinToLocalStorage(pin) {
    return localStorage.setItem('pin', pin);
}

function createAccount() {
    localStorage.setItem('balance', Math.floor(Math.random()*1000));
}

// Business Logic - Util functions
function getPinFromLocalStorage() {
    return localStorage.getItem('pin');
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

// General Flow
/*
1. User is presented with welcome splash screen and PIN
2. Instruction dialogue appears on atm screen
3. Program listens for inputs from buttons and slots.
4. Program modifies dialogue on screen as user advances.
END: User is presented with congratulations screen
*/

$('#screen').html('<p>Welcome to The Bank\'s ATM! Please insert your debit card to continue.</p>');

// Dialogue
/*
1. Welcome to the ATM Simulator! Your PIN is ####
2. Welcome to The Bank's ATM! Please insert your debit card to continue.
3. Which action would you like to take? [Show Balance, Withdrawl, Deposit, Exit]
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
1. Returning Card... 
2. Thank you for using The Bank's ATM! Please take your card. Have a nice day!
3. <Go to Step 2>
[Exit] - option is always present
1. Returning Card... 
2. Thank you for using The Bank's ATM! Please take your card. Have a nice day!
3. <Go to Step 2>
*/