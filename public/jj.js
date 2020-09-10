// JJ noodles Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBz5RNtGXMkmdRzLw--YH67YIxP26DzwKo",
  authDomain: "jjnoodles-d4df0.firebaseapp.com",
  databaseURL: "https://jjnoodles-d4df0.firebaseio.com",
  projectId: "jjnoodles-d4df0",
  storageBucket: "jjnoodles-d4df0.appspot.com",
  messagingSenderId: "645610471981",
  appId: "1:645610471981:web:c703abde4fd496f890eea4",
  measurementId: "G-5LDPNR66N6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//OPEN OR CLOSED FOR BUSINESS
const closed = false;  //False for open business, True for closed
const date = new Date()
const day = date.getDay() //Do not take orders on Saturday(6) or Sunday(0)
if (closed || day === 6 || day === 0) {
  $('#open_shop').text("CURRENTLY NOT ACCEPTING ORDERS");
  $('#open_shop').css('color', 'red');
  document.getElementById("exampleFormControlSelect1").disabled = true; //turn off quantity selector
};

//Keeps the table disabled
document.getElementById("order_table").style.display = "none";


// If click on team member login, alert a prompt for password
$('#login').on('click',function() {
  var code = prompt("Please enter the authentication code: ");
  // If password = jjhamchoi, load order page
  if (code === 'jjhamchoi') {
    $('#team').text("Welcome team member! You are logged in.");
    // Load orders table
    document.getElementById("order_table").style.display = "block";
  }
});



// Updates total price based on Quantity
// Also ables submit button if quanity > 0
function getTotal(){
  var quantity = document.getElementById("exampleFormControlSelect1").value;
  $('#total').text("$" + quantity*30 + ".00");
  if (quantity == 0) {
    document.getElementById("submit").disabled = true;
  }else {
    document.getElementById("submit").disabled = false;
  }
};


// Order Summary
$('#submit').on('click', (event) => {
  event.preventDefault()
  var customerName = document.getElementById("formGroupExampleInput").value;
  var customerPhone = document.getElementById("formGroupExampleInput1").value;
  var customerQuantity = document.getElementById("exampleFormControlSelect1").value;
  var customerNotes = document.getElementById("exampleFormControlTextarea1").value;
  var customerTotal = "$" + customerQuantity*30 + ".00";
  $('#name').append(customerName);
  $('#phone').append(customerPhone);
  $('#quant').append(customerQuantity);
  $('#notes').append(customerNotes);
  $('#totalAmount').append(customerTotal);
});


//Clear order summary if closing modal, so theres no repeat
$('#closeOrder').on('click',function() {
  $('#name').text("Name: ");
  $('#phone').text("Phone: ");
  $('#quant').text("Lobster Noodle Quantity: ");
  $('#notes').text("Additonal Notes: ");
  $('#totalAmount').text("Total: ");
});

// Adds orders to Firebase
const firebaseRef = firebase.database().ref('orders');

// Confirmed Order Message
$('#confirmOrder').on('click',function() {
  //Change text on modal
  $('#staticBackdropLabel').text("Order Recieved.");
  $('#confirmMessage').text("Thanks for choosing JJ Noodles, we'll see you on Sunday!");
  $( "#confirmOrder" ).remove();
  $('<img class=logoThree src="logo.jpg">').appendTo("#confirmMessage");
  $('<p>To start a new order, please refresh the page.</p>').appendTo("#confirmMessage");
  // Save order info into variables
  var customerName = document.getElementById("formGroupExampleInput").value;
  var customerPhone = document.getElementById("formGroupExampleInput1").value;
  var customerQuantity = document.getElementById("exampleFormControlSelect1").value;
  var customerNotes = document.getElementById("exampleFormControlTextarea1").value;
  var customerTotal = "$" + customerQuantity*30 + ".00";
  var fullDate = Date();
  var date = fullDate.split(' ').slice(0, 5).join(' ');
  // Save order into Database
  saveOrder(date, customerName, customerPhone, customerQuantity, customerNotes, customerTotal);
  // Clear form after adding to database
  document.getElementById('orderForm').reset();
});


// Save order info to firebase
function saveOrder(date, customerName, customerPhone, customerQuantity, customerNotes, customerTotal){
  var newFirebaseRef = firebaseRef.push();
  newFirebaseRef.set({
    date: date,
    name: customerName,
    phone: customerPhone,
    quantity: customerQuantity,
    notes: customerNotes,
    total: customerTotal
  });
}

// Add order info from database into table
var getFirebase = firebase.database().ref().child("orders");
getFirebase.on("child_added", snap => {
  var date = snap.child("date").val();
  var customerName = snap.child("name").val();
  var customerPhone = snap.child("phone").val();
  var customerQuantity = snap.child("quantity").val();
  var customerNotes = snap.child("notes").val();
  var customerTotal = snap.child("total").val();
  $("#table_body").prepend("<tr><td>" + date + "</td><td>" + customerName + "</td><td>" + customerPhone + "</td><td>" + customerQuantity + "</td><td>" + customerNotes + "</td><td>" + customerTotal + "</td></tr>");
});
