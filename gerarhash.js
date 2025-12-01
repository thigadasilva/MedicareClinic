const bcrypt = require('bcrypt');

const senha = 'Recep@123'; // <-- Coloque sua senha temporária aqui
const saltRounds = 10; // O número de 'rounds' de salt (10 é um padrão seguro)

bcrypt.hash(senha, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log("Seu Hash é:");
        console.log(hash);
        console.log("Copie o hash acima para o seu banco de dados SQLite.");
    }
});
