var currentUser = ""

function show(id) {
    $("#" + id).css("display", "block")
}

function hide(id) {
    $("#" + id).css("display", "none")
}

function CreateJsonPostObject(postType, Object) {
    var postObject = { postType: postType, postObject: Object }
    var jobj = JSON.stringify(postObject)
    return jobj;

}

function transferMoney() {
    
    savings_str = $("#savingsAmount").text();
    savings = parseFloat(savings_str).toFixed(2)

    usableAmount_str = $("#usableAmount").text()
    usableAmount = parseFloat(usableAmount_str).toFixed(2)
    
    transferAmount_str = $("#transferAmount").val()
    

    transferType = $("#transferType").val()

    if(transferAmount_str == "")
    {
        transferAmount_str = "0";
    }

    transferAmount = parseFloat(transferAmount_str).toFixed(2)


    if (transferType == "toUsable") {
        
        if(savings < transferAmount)
        {
            alert("too much money to transfer")
            return
        }
        
        savings = "-" + transferAmount_str;
        usableAmount = transferAmount_str
    }
    else if (transferType == "toSavings") {
        
        if(usableAmount < transferAmount)
        {
            alert("too much money to transfer")
            return
        }
        
        savings = transferAmount_str;
        usableAmount = "-" + transferAmount_str
    }


    var postObject = { username: currentUser, savings: savings, usableAmount: usableAmount };

    var jobj = CreateJsonPostObject("addMoney", postObject);


    var url = "budget";
    $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            $("#savingsAmount").text(data.newSavingsTotal);
            $("#usableAmount").text(data.newUsableTotal);
        }
    })
}

function submitAddMoneyRequest() {
    savings_str = $("#addingToSavingsAmount").text();
    savings = parseFloat(savings_str).toFixed(2)

    usableAmount_str = $("#addingToUsableAmount").text()
    usableAmount = parseFloat(usableAmount_str).toFixed(2)


    var postObject = { username: currentUser, savings: savings, usableAmount: usableAmount };

    var jobj = CreateJsonPostObject("addMoney", postObject);


    var url = "budget";
    $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            $("#savingsAmount").text(data.newSavingsTotal);
            $("#usableAmount").text(data.newUsableTotal);
            hide("addMoney_pop");

        }
    })
}

function addMoney_calculatePercentage() {
    addAmount_str = $("#addMoneyAmount").val();
    if (addAmount_str == "") { addAmount_str = "0" }
    addAmount = parseFloat(addAmount_str).toFixed(2)

    percentageAmount_str = $("#addSavingsPercentage").val()
    if (percentageAmount_str == "") { percentageAmount_str = "0" }
    percentageAmount = parseFloat(percentageAmount_str).toFixed(4);

    if (percentageAmount < 0) {
        percentageAmount = 0;
    }
    else if (percentageAmount > 100) {
        percentageAmount = 100
    }


    savings = (addAmount * (percentageAmount / 100)).toFixed(2)
    usableAmount = (addAmount - savings).toFixed(2);


    $("#addingToSavingsAmount").text(savings)
    $("#addingToUsableAmount").text(usableAmount)
}

function CreateNewUser_Transition() {

    $("#loginScreen").css("display", "none");
    $("#newUserScreen").css("display", "block");

}

function newUserScreen_backTransition() {

    $("#loginScreen").css("display", "block");
    $("#newUserScreen").css("display", "none");

}

function newUserToBudget_Transition() {
    $("#newUserScreen").css("display", "none");
    $("#budgetScreen").css("display", "block");
}

function loginToBudget_Transition() {
    $("#loginScreen").css("display", "none");
    $("#budgetScreen").css("display", "block");
    refreshCatagories()
}

function logout_Transition() {
    $("#loginScreen").css("display", "block");
    $("#budgetScreen").css("display", "none");
    $("#transferAmount").val("")
    $("#disableCover").css("display","none")
}

function adminback() {
    $("#loginScreen").css("display", "block");
    $("#AdminScreen").css("display", "none");
}




function editCatagoryOnKeyUp(id)
{
    var ID = id
    var curElement = $("#"+id);
    var catagory = curElement.children()[0].innerText
    var budgetAmount = curElement.children()[1].innerText
    var SpentAmount = curElement.children()[2].innerText
    
    if(budgetAmount == ""){budgetAmount = "0"}
    if(SpentAmount == ""){SpentAmount = "0"}
    
    var budgetAmount_float = parseFloat(budgetAmount)
    var SpentAmount_float = parseFloat(SpentAmount)
    
    if(budgetAmount_float > SpentAmount_float)
    {
        curElement.css("background-color","lightgreen")
    }
    else if(budgetAmount_float < SpentAmount_float)
    {
        curElement.css("background-color","#ff7a7a")
    }
    else
    {
        curElement.css("background-color","white")
    }
    
    var postObject = {ID:ID, catagory: catagory, budgetAmount: budgetAmount, SpentAmount: SpentAmount}
    
    jobj = CreateJsonPostObject("editCatagory", postObject);

    var url = "budget";
    $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            
        }
    })
}

function refreshCatagories()
{
    $(".catCell").remove();
    
    var postObject = {username: currentUser}
    
    jobj = CreateJsonPostObject("getAllCatagories", postObject);

    var url = "budget";
    $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            for(var i = 0; i < data.length; i++)
            {
                var cat = data[i]
                addCatagoryDisplay(cat.ID, cat.catagory, cat.budgetAmount, cat.SpentAmount)
            }
        }
    })
}


function addCatagoryDisplay(ID, catagory, budget, spent)
{
    var spancell = "<span id='" + ID + "' class='spanCell catCell' onkeyup=\"editCatagoryOnKeyUp('" + ID + "')\"> <div contenteditable=true data-text='Enter catagory' onkeypress='return (this.innerText.length <= 20)'>" + catagory + "</div> <div contenteditable=true data-text='00.00' onkeypress='return (this.innerText.length <= 20)'>" + budget + "</div> <div contenteditable=true data-text='00.00' onkeypress='return (this.innerText.length <= 20)'>" + spent + "</div> </span> "
    var elem = $("#budget1").append(spancell)
    var curElement = $("#"+ID)
    
    var budgetAmount_float = parseFloat(budget)
    var SpentAmount_float = parseFloat(spent)
    
    if(budgetAmount_float > SpentAmount_float)
    {
        curElement.css("background-color","lightgreen")
    }
    else if(budgetAmount_float < SpentAmount_float)
    {
        curElement.css("background-color","#ff7a7a")
    }
    else
    {
        curElement.css("background-color","white")
    } 
   
    
}

function addNewBudgetCatagory() {
        var postObject =
    {username: currentUser,
    catagory: "",
    budgetAmount: "0.00",
    SpentAmount: "0.00"}
    
    jobj = CreateJsonPostObject("addCatagory", postObject);

    var url = "budget";
    $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            var spancell = "<span id='" + data.ID + "' class='spanCell catCell' onkeyup=\"editCatagoryOnKeyUp('" + data.ID + "')\"> <div contenteditable=true data-text='Enter catagory' onkeypress='return (this.innerText.length <= 20)'></div> <div contenteditable=true data-text='00.00' onkeypress='return (this.innerText.length <= 20)'></div> <div contenteditable=true data-text='00.00' onkeypress='return (this.innerText.length <= 20)'>0.00</div> </span> "
            var elem = $("#budget1").append(spancell)
        }
    })
    
}

function removeBudgetCatagory() {

    if ($("#removeCatagoryButton").text() == "-") {
        $("#removeCatagoryButton").text("done")
        $(".catCell").addClass("deleteOnClick")
        setDeleteOn();
        $("#removeCatagoryButton").after("<span id='deleteInformer'>Click on a box to delete. Click done when done</span>")
    }
    else {
        $("#removeCatagoryButton").text("-")
        $(".catCell").removeClass("deleteOnClick")
        $("#deleteInformer").remove()
    }

}




function setDeleteOn() {
    $(".deleteOnClick").on("click", function() {
        if ($(this).hasClass("deleteOnClick")) {
        
            var ID = $(this).attr("id");
            var self = this;
           var postObject = {username: currentUser, ID: ID}
    
            jobj = CreateJsonPostObject("deleteCatagory", postObject);

            var url = "budget"; 
            
            
            $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            $(self).remove()
        }
    })
            
            
            
        }

    })
}





function createNewProfile() {

    var username = $("#new_usernameInput").val().toLowerCase();
    var password = $("#new_passwordInput").val().toLowerCase();

    var savings_str = $("#savingsInput").val();
    var savings = parseFloat(savings_str).toFixed(2);

    var usableAmount_str = $("#newUser_usableAmount").text()
    var usableAmount = parseFloat(usableAmount_str).toFixed(2);

    var postObject = { username: username, password: password, savings: savings, usableAmount: usableAmount };

    jobj = CreateJsonPostObject("createNewUser", postObject);

    var url = "budget";
    $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            if (data == "duplicate username") {
                alert("Username alrady in use, try a different one")
            }
            else {
                currentUser = username;
                $("#savingsAmount").text(savings)
                $("#usableAmount").text(usableAmount)
                addNewBudgetCatagory()
                $(".catCell").remove();
                newUserToBudget_Transition()
                $("#new_usernameInput").val("");
                $("#new_passwordInput").val("");
                $("#savingsInput").val("");
                $("#totalMoneyInput").val("");
                $("#newUser_usableAmount").text("")
            }
        }
    })

}

function loginUser() {
    var username = $("#usernameInput").val().toLowerCase();
    var password = $("#passwordInput").val().toLowerCase();

    if (username == "deraj" && password == "admin") {
        $("#loginScreen").css("display", "none");
        $("#AdminScreen").css("display", "block");
        return;
    }


    var postObject = { username: username, password: password };

    var jobj = CreateJsonPostObject("loginUser", postObject);


    var url = "budget";
    $.ajax({
        url: url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            if (data == "no user found") {
                alert("no user found");
            }
            else {
                currentUser = data.username;
                $("#savingsAmount").text(data.savings)
                $("#usableAmount").text(data.usableAmount)
                if(username == "example" && password == "example")
                {
                    $("#disableCover").css("display","block")
                }
                loginToBudget_Transition()
                $("#usernameInput").val("")
                $("#passwordInput").val("");
            }
        }
    })
}

function calculateUsableAmount() {

    var totalMoney_str = $("#totalMoneyInput").val();
    if (totalMoney_str == "") { totalMoney_str = "0" }
    var totalMoney = parseFloat(totalMoney_str);

    var savings_str = $("#savingsInput").val();
    if (savings_str == "") { savings_str = "0" }
    var savings = parseFloat(savings_str);

    var usableAmount = totalMoney - savings;
    $("#newUser_usableAmount").text(usableAmount.toFixed(2))
}
