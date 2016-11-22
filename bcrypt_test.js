/**
 * Created by kasyan on 11/22/16.
 */
var bcrypt = require('bcrypt');
var hash = '$2a$10$zHJ6HdScD98PcRsrUEOoQOmIuE0znqqEhfsktMczJ70UXWW4RIPFG';

bcrypt.compare('123456', hash, function(err, res) {
    if(err) throw err;
    console.log(res);
})