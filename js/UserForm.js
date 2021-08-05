/* Adds  given text to value to the passweod text
* field
*/
function addValueToPassword(button)
{
  var currVal=$("#passcode").val();
  if(button=="bksp")
  {
    $("#passcode").val(currVal.substring(0,currVal.length-1));
  }
  else
  {
    $("#passcode").val(currVal.concat(button));
  }
}

/* On the main page, after password entry, directs
* user to main page, legal disclaimer if they
* have not yet agreed to it, or user entry page
* if they have not yet completed their user info.
*/
$(document).ready(function () {
  $("#btnEnter" ).click(function()
  {
    var password=getPassword();
    if(document.getElementById("passcode").value==password)
    {
      if (localStorage.getItem("agreedToLegal")==null)
      {
        $.mobile.changePage("#legalNotice");
      }
      else if(localStorage.getItem("agreedToLegal")=="true")
      {
        if(localStorage.getItem("user")==null)
        {
          /* User has not been created, direct user
          * to User Creation page
          */
          $.mobile.changePage("#pageUserInfo");
        }
        else
        {
          $.mobile.changePage("#pageMenu");
        }
      }
    }
    else
    {
      alert("Incorrect password, please try again");
    }
  });
});


 /*
 * Retrieves password from local storage if it
 * exists, otherwise returns the default password
 */
 function getPassword()
 {
   if (typeof(Storage) == "undefined")
   {
     alert("Your browser does not support HTML5 localStorage. Try  upgrading");
   }
   else if(localStorage.getItem("user")!=null)
   {
     return JSON.parse(localStorage.getItem("user")).NewPassword;
   }
   else
   {
     /*Default password*/
     return "3456";
   }
 }


 /* Records that the user has agreed to the legal
 * disclaimer on this device/browser
 */
$(document).ready(function () {
 $("#noticeYes").click(function(){
   localStorage.setItem("agreedToLegal", "true");
 });
});




//-----------------------------------------------------

//var d=new Date();
$(document).ready(function () {
  $("#frmUserForm").submit(function(){
    //Event: submitting the  form
    saveUserForm();
    return true;
  });
});



 function checkUserForm()
 {
   //Check for empty fields in the form
   //for finding current date
   var d = new Date();
   var month = d.getMonth()+1;
   var date = d.getDate();
   var year = d.getFullYear();
   var currentDate = year +'/' +
   ((''+month).length<2? '0':'') + month +'/'+
   ((''+date).length<2? '0':'') + date;

   if(($("#txtBank").val() !="") &&
     ($("#datCreation").val() !="") && 
     ($("#datCreation").val() <= currentDate) &&
     ($("#changePassword ").val() !="")&&
     ($("#slcBalanceRange option:selected").val() != "Select Balance") 
   )
   {
     return true;
   }
   else
   {
     return false;
   }
 }



 function saveUserForm()
 {
   if(checkUserForm())
   {
     var user = {
       "BankName": $("#txtBank").val(),
       "Date": $("#datCreation").val(),
       "NewPassword": $("#changePassword").val(),
       "BalanceRange": $("#slcBalanceRange option:selected").val()
     };
     try
     {
       localStorage.setItem("user", JSON.stringify(user));
       $.mobile.changePage("#pageMenu");
     }
     catch(e)
     {
       /* Google browsers use different error
       * constant
       */
       if (window.navigator.vendor==="Google Inc")
       {
         if(e == DOMException.QUOTA_EXCEEDED_ERR)
         {
           alert("Error: Local Storage limit exceeds");
         }
       }
       else if(e == QUOTA_EXCEEDED_ERR)
       {
         alert("Error: Saving to local storage");
       }
       console.log(e);
     }
   }
   else
   {
     alert("Please complete the form properly");
   }
 }


 function showUserForm()
 {
   //Load the stored values in the form  try
   try{
     var user=JSON.parse(localStorage.getItem("user"));
     console.log(user);
   }
   catch(e)
   {
     /* Google browsers use different error
     * constant
     */
    if (window.navigator.vendor==="Google Inc")
     {
       if(e == DOMException.QUOTA_EXCEEDED_ERR)
       {
         alert("Error: Local Storage limit exceeds");
       }
     }
     else if(e == QUOTA_EXCEEDED_ERR){
       alert("Error: Saving to local storage");
     }
     console.log(e);
   }
   if(user != null)
   {
     $("#txtBank").val(user.BankName);
     $("#datCreation").val(user.Date);
     $("#changePassword").val(user.NewPassword);
     $('#slcBalanceRange option[value='+user.BalanceRange+']').attr('selected', 'selected');
     $("#slcBalanceRange option:selected").val(user.BalanceRange);
     $('#slcBalanceRange').selectmenu('refresh', true);
   } 
 }


 function loadUserInformation()
{
  try
  {
    user=JSON.parse(localStorage.getItem("user"));
  }
  catch(e)
  {
    /* Google browsers use different error
    * constant
    */
    if (window.navigator.vendor==="Google Inc")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: Local Storage limit exceeds");
      }
    }
    else if(e == QUOTA_EXCEEDED_ERR){
      alert("Error: Saving to local storage");
    }
    console.log(e);
  }
  if(user != null)
  {
  $("#divUserSection").empty();
  var today=new Date();var today=new Date();
  var dob=new Date(user.DOB);
  var age=Math.floor((today-dob)/ (365.25 * 24 * 60 * 60 * 1000));

  //Display appropriate Balance Range
  if(user.BalanceRange=="Excellent")
  {
    user.BalanceRange="$0-$499";
  }
  else if(user.BalanceRange=="Good")
  {
    user.BalanceRange="$500-$1.499";
  }
  else if(user.BalanceRange=="Fair")
  {
    user.BalanceRange="$1.500-$2.999";
  }
  else if(user.BalanceRange=="Bad")
  {
    user.BalanceRange="$3.000-$9.999";
  }
  else
  {
    user.BalanceRange="$10.000 and more";
  }

  $("#divUserSection").append("Banks's Name:"+user.BankName+
  "<br>Date of Creation: "+user.Date+"<br>New Password: "
  +user.NewPassword+"<br>Desired Balance: "+user.BalanceRange);
  $(document).ready(function() {
    $("#divUserSection").append("<br><a href='#pageUserInfo' data-mini='true' id='btnProfile'  data-role='button' data-icon='edit' data-iconpos='left'  data-inline='true' >Edit Profile</a>");
  });
  $('#btnProfile').button();// 'Refresh' the button


 }
}


/* Checks that users have entered all valid info
* and that the date they have entered is not in
* the future
*/

function checkRecordForm()  {
  //for finding current date
  var d=new Date();
  var month=d.getMonth()+1;
  var date=d.getDate();
  var currentDate=d.getFullYear() +'/' +
  ((''+month).length<2? '0':'') + month +'/' +
  ((''+date).length<2? '0':'') + date;

  if(($("#datTaken").val() <= currentDate)&&
  ($("#txtDebit").val() !="")&&
  ($("#txtCredit").val() !=""))
  {
    return true;
  }
  else
  {
    return false;
  }
}

function addRecord()
{
  if(checkRecordForm())
  {

    var deb = $("#txtDebit").val();
    var acc = 1.05;
    var cred = $("#txtCredit").val();
    var inter= 1.09;
    var debBal = deb*acc;
    var creBal = cred*inter;
    var totalBal= debBal-creBal;
    var record={
      "Date": $("#datTaken").val(),
      "Debit": $("#txtDebit").val(),
      "Credit": $("#txtCredit").val(),
      "DebitBalance": debBal.toFixed(2),
      "CreditBalance": creBal.toFixed(2),
      "TotalBalance": totalBal.toFixed(2)
      

    };

    try
    {
      var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
      if(tbRecords == null)
      {
        tbRecords = [];
      }
      tbRecords.push(record);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();
    }
    catch(e)
    {
      /* Google browsers use different error
      * constant
      */
      if (window.navigator.vendor==="Google Inc")
      {
        if(e == DOMException.QUOTA_EXCEEDED_ERR)
        {
          alert("Error: Local Storage limit exceeds");
        }
      }
      else if(e == QUOTA_EXCEEDED_ERR){
        alert("Error: Saving to local storage");
      }  console.log(e);
    }
  }
  else
  {
    alert("Please complete the form properly");
  }
  return true;
}



function listRecords()
{
  try
  {
    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
  }
  catch(e)
  {
    /* Google browsers use different error
    * constant
    */
    if (window.navigator.vendor==="Google Inc")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: Local Storage limit exceeds");
      }
    }
    else if(e == QUOTA_EXCEEDED_ERR){
      alert("Error: Saving to local storage");
    }
    console.log(e);
  }
  //Load previous records, if they exist
  if(tbRecords != null)
  {
      //Order the records by date
      tbRecords.sort(compareDates);

      //Initializing the table
      $("#tblRecords").html(
        "<thead>"+
        " <tr>"+
        " <th>Date</th>"+
        " <th>Debit&nbsp;&nbsp;&nbsp;</th>"+
        " <th>Debit Balance with Accumulation(5%)&nbsp;&nbsp;&nbsp;</th>"+
        " <th>Credit&nbsp;&nbsp;&nbsp;</th>"+
        " <th>Credit Balance with Interest(9%)&nbsp;&nbsp;&nbsp;</th>"+
        " <th>Total Balance&nbsp;&nbsp;&nbsp;</th>"+
        " <th>Edit</th>"+
        " <th>Delete</th>"+
        " </tr>"+
        "</thead>"+
        "<tbody>"+
        "</tbody>"
      );
      //Loop to insert the each record in the table
      for(var i=0;i<tbRecords.length;i++)
      {
        var rec=tbRecords[i];
        console.log(rec.TotalBalance);
        $("#tblRecords tbody").append("</tr>"+
        " <tr>"+
        " <td>"+rec.Date+"&nbsp;&nbsp;&nbsp;</td>" +
        " <td>"+"  &nbsp;&nbsp;&nbsp;  $"+rec.Debit+"</td>" +
        " <td>"+"  &nbsp;&nbsp;&nbsp;  $"+rec.DebitBalance+"</td>" +
        " <td>"+"  &nbsp;&nbsp;&nbsp; $"+rec.Credit+"</td>" +
        " <td>"+"  &nbsp;&nbsp;&nbsp; $"+rec.CreditBalance+"</td>" +
        " <td>"+"  &nbsp;&nbsp;&nbsp; $"+rec.TotalBalance+"</td>" +
        " <td><a data-inline='true' data-mini='true' data-role='button' href='#pageNewRecordForm' onclick='callEdit("+i+")' data-icon='edit'  data-iconpos='notext'></a>"+
        " <td><a data-inline='true' data-mini='true' data-role='button' href='#' onclick='callDelete("+i+")' data-icon='delete' data-iconpos='notext'></a></td>"+
         "</tr>");
      }
      $('#tblRecords [data-role="button"]').button();// 'Refresh' the  buttons. Without this the delete/edit buttons wont appear
  }
  else
  {
    $("#tblRecords").html("");
  }
    return true;

}

/* The value of the Submit Record button is used
* to determine which operation should be
* performed
*/
$(document).ready(function () {
  $("#btnAddRecord").click(function(){
    /*.button("refresh") function forces jQuery
    * Mobile to refresh the text on the button
    */
    $("#btnSubmitRecord").val("Add");
    if($("btnSubmitRecord").hasClass("btn-ui-hidden"))
    {
      $("#btnSubmitRecord").button("refresh");
    }
  });
});

$(document).ready(function () {
  $("#pageNewRecordForm").on("pageshow",function(){
    //We need to know if we are editing or adding a record everytime  we show this page
    //If we are adding a record we show the form with blank inputs
    var formOperation=$("#btnSubmitRecord").val();
    if(formOperation=="Add")
    {
      clearRecordForm();
    }
    else if(formOperation=="Edit")
    {
      //If we are editing a record we load the stored data in the form
      showRecordForm($("#btnSubmitRecord").attr("indexToEdit"));
    }
  });
});




$(document).ready(function () {
  $("#frmNewRecordForm").submit(function(){
    var formOperation=$("#btnSubmitRecord").val();
    if(formOperation=="Add")
    {
      addRecord();
      $.mobile.changePage("#pageRecords");
    }
    else if(formOperation=="Edit")
    {
      editRecord($("#btnSubmitRecord").attr("indexToEdit"));
      $.mobile.changePage("#pageRecords");
      $("#btnSubmitRecord").removeAttr("indexToEdit");
    }
    /*Must return false, or else submitting form
    * results in reloading the page
    */
    return false;
  });
});


function compareDates(a, b)
{
  var x=new Date(a.Date);
  var y=new Date(b.Date);
  if(x>y)
  {
    return 1;
  }
  else
  {
    return -1;
  }
}


function callEdit(index)
{
  $("#btnSubmitRecord").attr("indexToEdit", index);
  /*.button("refresh") function forces jQuery
  * Mobile to refresh the text on the button
  */  $("#btnSubmitRecord").val("Edit");
  if($("btnSubmitRecord").hasClass("btn-ui-hidden")) {
    $("#btnSubmitRecord").button("refresh");
  }
}


$(document).ready(function () {
  $("#frmNewRecordForm").submit(function(){
    var formOperation=$("#btnSubmitRecord").val();
    if(formOperation=="Add")
    {
      addRecord();
      $.mobile.changePage("#pageRecords");
    }
    else if(formOperation=="Edit")
    {
      editRecord($("#btnSubmitRecord").attr("indexToEdit"));
      $.mobile.changePage("#pageRecords");
      $("#btnSubmitRecord").removeAttr("indexToEdit");
    }
    /*Must return false, or else submitting form
    * results in reloading the page
    */
    return false;
  });
});

function editRecord(index)
{
  if(checkRecordForm())
  {
    try
    {
      var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
      tbRecords[index] ={
        "Date": $("#datTaken").val(),
        "Debit": $("#txtDebit").val(),
        "Credit": $("#txtCredit").val()
      };//Alter the selected item in the array
      localStorage.setItem("tbRecords", JSON.  stringify(tbRecords)); //Saving array to local storage
      alert("Saving Information");
      clearRecordForm();
      listRecords();
    }
    catch(e)
    {
      /* Google browsers use different error
      * constant
      */
      if (window.navigator.vendor==="Google Inc")
      {
        if(e == DOMException.QUOTA_EXCEEDED_ERR)
        {
          alert("Error: Local Storage limit exceeds");
        }
      }
      else if(e == QUOTA_EXCEEDED_ERR){
        alert("Error: Saving to local storage");
      }
      console.log(e);
    }
  }
  else
  {
    alert("Please complete the form properly");
  }
}

function clearRecordForm()
{
  $("#datTaken").val("");
  $("#txtDebit").val("");
  $("#txtCredit").val("");

  return true;
}

function showRecordForm(index)
{
  try
  {
    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
    var rec=tbRecords[index];
    $("#datTaken").val(rec.Date);
    $("#txtDebit").val(rec.Debit);
    $("#txtCredit").val(rec.Credit);

  }
  catch(e)
  {
    /* Google browsers use different error
    * constant
    */
    if (window.navigator.vendor==="Google Inc")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: Local Storage limit exceeds");
      }
    }
    else if(e == QUOTA_EXCEEDED_ERR){
      alert("Error: Saving to local storage");
    }
    console.log(e);
  }
}

function deleteRecord(index)
{
  try
  {
    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
    tbRecords.splice(index, 1);
    if(tbRecords.length==0)
    {
      /* No items left in records, remove entire
      * array from localStorage
      */
      localStorage.removeItem("tbRecords");
    }
    else
    {
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
    }
  }
  catch(e)
  {
    /* Google browsers use different error
    * constant
    */
    if (window.navigator.vendor==="Google Inc")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: Local Storage limit exceeds");
      }
    }
    else if(e == QUOTA_EXCEEDED_ERR){
      alert("Error: Saving to local storage");
    }
    console.log(e);
  }
}



// Delete the given index and re-display the table
function callDelete(index)
{
  deleteRecord(index);
  listRecords();
}


// Removes all record data from localStorage
$(document).ready(function () {
  $("#btnClearHistory").click(function(){
    localStorage.removeItem("tbRecords");
    listRecords();
    alert("All records have been deleted");
  });
});



 /* Runs the function to display the user information, history, graph or
* suggestions, every time their div is shown
*/
$(document).ready(function () {
  $(document).on("pageshow", function(){
    if($('.ui-page-active').attr('id')=="pageUserInfo")
    {
      showUserForm();
    }
    else if($('.ui-page-active').attr('id')=="pageRecords")
    {
      loadUserInformation();
      listRecords();
    }
    else if($('.ui-page-active').attr('id')=="pageRecommendations")
    {
      advicePage();
      resizeGraph();
    }
    else if($('.ui-page-active').attr('id')=="pageGraph")
    {
      drawGraph();
      resizeGraph();
    }
  });
});


///need to modify after this

function advicePage()  
{  
  if (localStorage.getItem("tbRecords") === null)  
  {  
    alert("No records exist");  
    $(location).attr("href", "#pageMenu");  
  }  
  else  
  {  
    var user=JSON.parse(localStorage.getItem("user"));  
    var BalanceLevel=user.BalanceRange;  
    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
    tbRecords.sort(compareDates);  
    var i=tbRecords.length-1;  
    var TotalBalance=tbRecords[i].TotalBalance;  
    var c=document.getElementById("AdviceCanvas");  
    var ctx=c.getContext("2d");  
    ctx.fillStyle="#c0c0c0";  
    ctx.fillRect(0,0,550,550);  
    ctx.font="22px Arial";  
    drawAdviceCanvas(ctx,BalanceLevel,TotalBalance);  
  }  
} 

function drawAdviceCanvas(ctx,BalanceLevel,TotalBalance)  
{  
  ctx.font="22px Arial";  
  ctx.fillStyle="black";  
  ctx.fillText("Your current Balance is " + TotalBalance + "", 25, 320);
    if (BalanceLevel == "Excellent")  
    {  
      ctx.fillText("Your target Balance range is: $0-$499", 25, 350);  
      levelWrite(ctx,TotalBalance);  
      levelMeter(ctx,TotalBalance);  
    }  
    else if (BalanceLevel == "Good")  
    {  
      ctx.fillText("Your target Balance range is: $500-$1.499", 25, 350);  
      levelWrite(ctx,TotalBalance);  
      levelMeter(ctx,TotalBalance);  
    }  
    else if (BalanceLevel == "Fair")  
    {  
      ctx.fillText("Your target Balance range is: $1.500-$2.999", 25, 350);
      levelWrite(ctx,TotalBalance);  
      levelMeter(ctx,TotalBalance);  
    } 
    else if (BalanceLevel == "Bad")  
    {  
      ctx.fillText("Your target Balance range is: $3.000-$9.999", 25, 350);  
      levelWrite(ctx,TotalBalance);  
      levelMeter(ctx,TotalBalance);  
    } 
    else if (BalanceLevel == "Very Bad")  
    {  
      ctx.fillText("Your target Balance range is: $10.000 and more", 25, 350);  
      levelWrite(ctx,TotalBalance);  
      levelMeter(ctx,TotalBalance);  
    }  
  } 


  function levelWrite(ctx,TotalBalance)  
  {  
    console.log(TotalBalance);
    if (TotalBalance <= 499)  
    {  
      writeAdvice(ctx , "Excellent");  
    }  
    else if ((TotalBalance >= 500) && (TotalBalance <= 1499))  
    {  
      writeAdvice(ctx , "Good");  
    } 
    else if ((TotalBalance >=1500) && (TotalBalance <= 2999))  
    {  
      writeAdvice(ctx , "Fair");  
    }  
    else if ((TotalBalance >=3000) && (TotalBalance <= 9999))  
    {  
      writeAdvice(ctx , "Bad");  
    }   
    else  
    {  
      writeAdvice(ctx , "Very Bad");  
    }  
  } 

  function writeAdvice(ctx,level)  
  {  var adviceLine1="";  
     var adviceLine2="";  
     if(level=="Excellent")  
     
     { 
      adviceLine1="Your score is in the top 20% of U.S. customers";  
      adviceLine2="Lenders view you as an exceptional borrower";
     }
     else if(level=="Good")  
     {  
       adviceLine1="Your credit score is in the top 40% of U.S. customers";  
       adviceLine2="Lenders view you as a very dependable borrower"; 
     }   
     else if(level=="Fair")  
     {  
       adviceLine1="Your score is near the average score of U.S. customers";  
       adviceLine2="Most lenders consider this a good score";  
     } 
     else if(level=="Bad")  
     {  
       adviceLine1="Your score is below the average score of U.S. custormer";  
       adviceLine2="Some lenders will aprove loans with this score";  
     }  
     else if(level="Very Bad")  
     {      
       adviceLine1="Your score is in the lowest 20% of U.S. custormer";  
       adviceLine2="Lenders view you as a very risky borrower";  
     }  
     ctx.fillText("Your Balance is " + level +"", 25, 380);  
        ctx.fillText(adviceLine1, 25, 410);  
        ctx.fillText(adviceLine2, 25, 440); 
 } 


 function levelMeter(ctx,TotalBalance)  
 {  
   if (TotalBalance <= 20000)  
   {  
     var cg=new RGraph.CornerGauge("AdviceCanvas", 0, 15000, TotalBalance)
     .Set("chart.colors.ranges",[[10000,20000, "#red"], [500, 1500,  "orange"],
     [500, 1500,  "yellow"], [500, 1500,  "light green"], [0, 500, "green"],
       ]);  
    }  
    else  
    {  
      var cg=new RGraph.CornerGauge("AdviceCanvas", 0,TotalBalance,TotalBalance)
      .Set("chart.colors.ranges", [[10000, 20000, "red"], [500, 1500,  "orange"], 
      [500, 1500,  "yellow"], [500, 1500,  "light green"], [0, 500, "green"],
      [0.01, 0.1, "#0f0"], [10000, TotalBalance, "red"]]);  
    }  
    drawMeter(cg);  
  } 

  function drawMeter(g)  
  {  
    g.Set("chart.value.text.units.post", " $")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 2)
    .Set("chart.title", "CREDIT BALANCE")  
    .Set("chart.radius", 250)  
    .Set("chart.centerx", 50)  
    .Set("chart.centery", 250)  
    .Draw();  
  } 

  function resizeGraph()  
  {  
    if($(window).width() < 700)  
    {  
      $("#GraphCanvas").css({"width":$(window).width()- 50});  
      $("#AdviceCanvas").css({"width":$(window).width()- 50});  
    }  
  } 

  function drawGraph()  
  {  
    if(localStorage.getItem("tbRecords") === null)  
    {  
      alert("No records exist");  
      $(location).attr("href", "#pageMenu");  
    }  
    else  
    {  
      setupCanvas();  
      var TSHarr=new Array();  
      var Datearr=new Array();  
      getTSHhistory(TSHarr, Datearr);  
      var tshLower = new Array(2);  
      var tshUpper = new Array(2);  
      getTSHbounds(tshLower,tshUpper);  
      drawLines(TSHarr, tshUpper, tshLower, Datearr)  
      labelAxes();  
    }  
  } 


  function setupCanvas()  
  {  
    var c=document.getElementById("GraphCanvas");  
    var ctx=c.getContext("2d");  
    ctx.fillStyle="#FFFFFF";  
    ctx.fillRect(0, 0, 500, 500);  
  } 

  function getTSHhistory(TSHarr, Datearr)  
  {  
    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));  
    tbRecords.sort(compareDates);  
    for (var i=0; i < tbRecords.length; i++)
      {  
        var date = new Date(tbRecords[i].Date);  
        /*These methods start at 0, must increment  
        * by one to compensate  
        */  
       var m=date.getMonth() + 1;  
       var d=date.getDate() + 1;  
       //The x-axis label  
       Datearr[i]=(m +"/" + d);  
       //The point to plot  
       TSHarr[i]=parseFloat(tbRecords[i].TSH);  
      }  
  } 

  function getTSHbounds(tshLower, tshUpper)  
  {  
    var user=JSON.parse(localStorage.getItem("user"));  
    var BalanceLevel=user.BalanceRange;  
    if (BalanceLevel == "Excellent")  
    {  
      tshUpper[0] = tshUpper[1] = 499;  
      tshLower[0] = tshLower[1] = 0;  
    }  
    else if (BalanceLevel == "Good")  
    {  
      tshUpper[0] = tshUpper[1] = 1499;  
      tshLower[0] = tshLower[1] = 500;  
    }  
    else if (BalanceLevel == "Fair")  
    {  
      tshUpper[0] = tshUpper[1] = 1500;  
      tshLower[0] = tshLower[1] = 2999;  
    }  
    else if (BalanceLevel == "Bad")  
    {  
      tshUpper[0] = tshUpper[1] = 3000;  
      tshLower[0] = tshLower[1] = 9999;  
    }  
    else  
    {  
      tshUpper[0] = tshUpper[1] = 20000;  
      tshLower[0] = tshLower[1] = 10000;  
    }  
  } 

  function drawLines(TSHarr, tshUpper, tshLower, Datearr)  
  {  
    var TSHline=new RGraph.Line("GraphCanvas", TSHarr, tshUpper, tshLower)  
     .Set("labels", Datearr)  
     .Set("colors", ["blue", "green", "green"])  
     .Set("shadow", true)  
     .Set("shadow.offsetx", 1)  
     .Set("shadow.offsety", 1)  
     .Set("linewidth", 1)  
     .Set("numxticks", 6)  
     .Set("scale.decimals", 2)  
     .Set("xaxispos", "bottom")  
     .Set("gutter.left", 40)  
     .Set("tickmarks", "filledcircle")  
     .Set("ticksize", 5)  
     .Set("chart.labels.ingraph",  
     [,, ["TSH", "blue", "yellow", 1, 80],,])  
     .Set("chart.title", "TSH")  
     .Draw();  
  }
  
  function labelAxes()  
  {  
    var c=document.getElementById("GraphCanvas");  
    var ctx=c.getContext("2d");  
    ctx.font="11px Georgia";  
    ctx.fillStyle="green";  
    ctx.fillText("Date(MM/DD)", 400, 470);  
    ctx.rotate(-Math.PI/2);  
    ctx.textAlign="center";  
    ctx.fillText("TSH Value", -250, 10);  
  } 











