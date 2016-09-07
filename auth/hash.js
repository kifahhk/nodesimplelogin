var crypto = require('crypto');


function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); 
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = 'nah';
    var passwordData = sha512(userpassword, salt);
    return passwordData.passwordHash;
}


module.exports = saltHashPassword;