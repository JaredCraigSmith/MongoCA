var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uniqid = require('uniqid');


mongoose.connect('mongodb://localhost/budgetDB', { useNewUrlParser: true });

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    savings: String,
    usableAmount: String,

});

var Users = mongoose.model('Users', userSchema);

var catagorySchema = mongoose.Schema({
    username: String,
    ID: String,
    catagory: String,
    budgetAmount: String,
    SpentAmount: String,
})
var catagory = mongoose.model('Catagories', catagorySchema);







/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


router.post('/budget', function(req, res, next) {
    console.log("POST budget route");
    console.log(req.body);

    var postObject = req.body

    if (postObject.postType == "createNewUser") {
        console.log("createNewUser");
        createNewUser(postObject.postObject, res)
    }
    else if (postObject.postType == "loginUser") {
        console.log("loginUser");
        getUser(postObject.postObject, res)
    }
    else if (postObject.postType == "addMoney") {
        console.log("addMoney")
        addMoney(postObject.postObject, res);
    }
    else if (postObject.postType == "addCatagory") {
        console.log("addCatagory")
        addCatagory(postObject.postObject, res)
    }
    else if (postObject.postType == "deleteCatagory") {
        console.log("deleteCatagory")
        deleteCatagory(postObject.postObject, res)
    }
    else if (postObject.postType == "getAllCatagories") {
        console.log("getAllCatagories")
        getAllCatagories(postObject.postObject, res)
    }
    else if (postObject.postType == "editCatagory") {
        console.log("editCatagory")
        editCatagory(postObject.postObject, res)
    }

});

function editCatagory(postObject, res) {
    var ID = postObject.ID
    catagory.find({ ID: ID }, function(err, catList) {
        cat = catList[0]
        cat.catagory = postObject.catagory;
        cat.budgetAmount = postObject.budgetAmount;
        cat.SpentAmount = postObject.SpentAmount;
        cat.save(function(err, post) {
            if (err) {
                res.sendStatus(500)
            }
            try {

                res.sendStatus(200)
            }
            catch (err) {

            }
        });

    })
}


function getAllCatagories(postObject, res) {
    var username = postObject.username
    catagory.find({ username: username }, function(err, catList) {
        if (err) {
            res.sendStatus(500)
        }
        else {
            try {
                res.json(catList);
                res.sendStatus(200)
            }
            catch (err) {

            }
        }

    })
}

function deleteCatagory(postObject, res) {
    var username = postObject.username;
    var ID = postObject.ID;
    catagory.deleteOne({ username: username, ID: ID }, function(err) {
        if (err) {
            res.sendStatus(500)
        }
        else {
            res.sendStatus(200)
        }

    })
}

function addCatagory(postObject, res) {
    var catID = uniqid();
    postObject["ID"] = catID
    var newCatagory = new catagory(postObject);
    newCatagory.save(function(err, post) {
        if (err) {
            res.sendStatus(500)
        }
        try {
            res.json(postObject);
            res.sendStatus(200)
        }
        catch (err) {

        }
    });
}

function addMoney(postObject, res) {
    var username = postObject.username;

    Users.find({ username: username }, function(err, userList) {
        if (err) {

        }
        else {
            var ToAddSavings = parseFloat(postObject.savings)
            var ToAddUsableAmount = parseFloat(postObject.usableAmount)

            var BankSavings = parseFloat(userList[0].savings)
            var BankUsable = parseFloat(userList[0].usableAmount)

            var newSavings = BankSavings + ToAddSavings;
            var newUsable = BankUsable + ToAddUsableAmount;

            userList[0].savings = newSavings;
            userList[0].usableAmount = newUsable;

            userList[0].save(function(err, post) {
                if (err) {
                    status.number = 500;
                }
                try {
                    res.json({ newSavingsTotal: newSavings, newUsableTotal: newUsable });
                    res.sendStatus(200)
                }
                catch (err) {

                }
            });

        }
    })
}

function getUser(postObject, res) {
    var status = { number: 200, data: "" }

    var username = postObject.username;
    var password = postObject.password;

    Users.find({ username: username, password: password }, function(err, userList) {
        if (err) {

        }
        else {
            if (userList.length == 0) {
                //login failed
                status.number = 200;
                status.data = "no user found"
            }
            else {

                status.number = 200;
                status.data = userList[0]

            }
            try {
                res.json(status.data);
                res.sendStatus(status.number)
            }
            catch (err) {

            }
        }
    })

}

function createNewUser(NewUserObject, res) {
    var status = { number: 200, data: "" }

    Users.find({ username: NewUserObject.username }, function(err, userList) {
        if (err) {
            console.log("duplicate error")
        }
        else {

            if (userList.length == 0) {
                //no duplicate continue as normal
                console.log("creating user")
                var newUser = new Users(NewUserObject);
                newUser.save(function(err, post) {
                    if (err) {
                        status.number = 500;
                    }
                    try {
                        res.json(status.data);
                        res.sendStatus(status.number)
                    }
                    catch (err) {

                    }
                });
            }
            else {
                //duplicate error
                console.log("not creating user because it's a duplicate")
                status.number = 200;
                status.data = "duplicate username";
                try {
                    res.json(status.data);
                    res.sendStatus(status.number)
                }
                catch (err) {

                }

            }
        }
    })
}


module.exports = router;
