// Handle Deposits
// Handle Withdrawls
// Produce a PIN
var Bank = function (name) {
    this.name = name;
}

var Account = function (pin) {
    this.pin = pin
}

Account.prototype.loginToAccount = function (params) {
    
}

Bank.prototype.showBalance = function (account) {
    
}

Bank.prototype.deposit = function (amount) {
    
}

Bank.prototype.widthdrawl = function (amount) {
    account.balance
}

Bank.prototype.createAPin = function () {
    var randomNumber = Math.floor(Math.random()*10000);
    if (randomNumber < 1000) {
        return '0' + String(randomNumber);
    } else {
        return String(randomNumber);
    }
}

