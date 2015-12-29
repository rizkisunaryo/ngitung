// Initialize your app
var myApp = new Framework7({
    swipePanel: 'left',
    modalTitle: 'Ngitung',
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    myApp.alert('Here comes About page');
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

myApp.onPageInit('sell', function (page) {
    var calendarDefault = myApp.calendar({
        input: '#sold_date',
    });

    // var fruits = ('Apple Apricot Avocado Banana Melon Orange Peach Pear Pineapple').split(' ');
    // var autocompleteDropdownAll = myApp.autocomplete({
    //     input: '#name',
    //     openIn: 'dropdown',
    //     source: function (autocomplete, query, render) {
    //         var results = [];
    //         // Find matched items
    //         for (var i = 0; i < fruits.length; i++) {
    //             if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
    //         }
    //         // Render items by passing array with result items
    //         render(results);
    //     }
    // });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}



if (window.openDatabase) {
  var mydb = openDatabase("toong", "0.1", "Toong DB", 1024 * 1024 * 50);

  mydb.transaction(function (t) {
      t.executeSql("CREATE TABLE IF NOT EXISTS selling_history (id INTEGER PRIMARY KEY ASC, name, brand, supplier, descr, pic_url, buy_price, sell_price, qty, sold_date)");
      // t.executeSql("CREATE TABLE IF NOT EXISTS name (name PRIMARY KEY)");
      // t.executeSql("CREATE TABLE IF NOT EXISTS brand (name PRIMARY KEY)");
      // t.executeSql("CREATE TABLE IF NOT EXISTS supplier (name PRIMARY KEY)");
      // t.executeSql("CREATE TABLE IF NOT EXISTS descr (name PRIMARY KEY)");
  });
} else {
  myApp.alert("Browser Anda tidak mendukung WebSQL!");
}

function addSelling() {
  //check to ensure the mydb object has been created
  if (mydb) {
      //get the values of the make and model text inputs
      var name = document.getElementById("name").value;
      var brand = document.getElementById("brand").value;
      var supplier = document.getElementById("supplier").value;
      var descr = document.getElementById("descr").value;
      var pic_url = document.getElementById('smallImage').src;
      var buy_price = document.getElementById("buy_price").value;
      var sell_price = document.getElementById("sell_price").value;
      var qty = document.getElementById("qty").value;
      var sold_date = document.getElementById("sold_date").value;

      //Test to ensure that the user has entered both a make and model
      if (name!=="" && buy_price!=="" && sell_price!=="" && qty!=="" && sold_date!=="") {
          //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO selling_history (name, brand, supplier, descr, pic_url, buy_price, sell_price, qty, sold_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, brand, supplier, descr, pic_url, buy_price, sell_price, qty, sold_date]);              
              outputInventory();
              mainView.router.back();
              // t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
              // t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
              // t.executeSql("INSERT INTO supplier (name) VALUES (?)", [supplier]);
              // t.executeSql("INSERT INTO descr (name) VALUES (?)", [descr]);
          });
      } else {
          myApp.alert("Data tidak lengkap!");
      }
  } else {
      myApp.alert("Browser Anda tidak mendukung WebSQL!");
      mainView.router.back();
  }
}



function outputInventory() {
  //check to ensure the mydb object has been created
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          t.executeSql("SELECT * FROM selling_history ORDER BY sold_date ASC", [], updateInventoryList);
          // t.executeSql("SELECT * FROM name", [], showNames);
      });
  } else {
      // alert("db not found, your browser does not support web sql!");
      outputInventory2();
  }
}

function outputInventory2 () {
    var sellingHistoryContainer = document.getElementById('sellingHistoryContainer');
    sellingHistoryContainer.innerHTML = 
        '<div class="content-block-title" id="sellingHistoryTitle_2015-12-12">2015-12-12</div>\n' + 
        '<div class="list-block virtual-list media-list" id="sellingHistoryList_2015-12-12"></div>\n' + 
        '<div class="content-block-title" id="sellingHistoryTitle_2015-12-10">2015-12-10</div>\n' + 
        '<div class="list-block virtual-list media-list" id="sellingHistoryList_2015-12-10"></div>';

    var itemsArray = [];
    var jsonData = {};
    jsonData['id'] = 'id';
    jsonData['pic_url'] = 'pic_url';
    jsonData['name'] = 'row.name';
    jsonData['qty'] = 'row.qty';
    jsonData['brand'] = 'row.brand';
    jsonData['descr'] = 'row.descr';
    itemsArray.push(jsonData);
    var myList = myApp.virtualList('#sellingHistoryList_2015-12-12', {
        // Array with plain HTML items
        items: itemsArray,
        // Template 7 template to render each item
        template: 
        '<li style="height:100px;">\n' + 
                '  <a href="#" class="item-link item-content sell-edit" data-id="{{id}}">\n' + 
                '    <div class="item-media"><img src="{{pic_url}}" height="80"></div>\n' + 
                '    <div class="item-inner">\n' + 
                '      <div class="item-title-row">\n' + 
                '        <div class="item-title">{{name}}</div>\n' + 
                '        <div class="item-after">{{qty}}</div>\n' + 
                '      </div>\n' + 
                '      <div class="item-subtitle">{{brand}}</div>\n' + 
                '      <div class="item-text">{{descr}}</div>\n' + 
                '    </div>\n' + 
                '  </a>\n' + 
                '</li>',
        height:100
    });
    var myList2 = myApp.virtualList('#sellingHistoryList_2015-12-10', {
        // Array with plain HTML items
        items: itemsArray,
        // Template 7 template to render each item
        template: 
        '<li style="height:100px;">\n' + 
                '  <a href="#" class="item-link item-content">\n' + 
                '    <div class="item-media"><img src="{{pic_url}}" height="80"></div>\n' + 
                '    <div class="item-inner">\n' + 
                '      <div class="item-title-row">\n' + 
                '        <div class="item-title">{{name}}</div>\n' + 
                '        <div class="item-after">{{qty}}</div>\n' + 
                '      </div>\n' + 
                '      <div class="item-subtitle">{{brand}}</div>\n' + 
                '      <div class="item-text">{{descr}}</div>\n' + 
                '    </div>\n' + 
                '  </a>\n' + 
                '</li>',
        height:100
    });

    $$('.sell-edit').on('click', function () {
      loadSellEdit($$(this).data('id'));
    });
}

function loadSellEdit(id) {
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          t.executeSql("SELECT * FROM selling_history WHERE id=?", [id], function (transaction, results) {
            if (results.rows.length>=1) {
              loadSellEditPage(results.rows.item(0));
            }
          });
          // t.executeSql("SELECT * FROM name", [], showNames);
      });
  } else {
      var data = {};
      data['id']=1;
      data['sold_date']='2015-12-12';
      data['name']='Sepatu';
      loadSellEditPage(data);
  }
}

function loadSellEditPage (data) {
  mainView.router.loadContent(
    '<!-- Top Navbar-->\n' + 
    '<div class="navbar">\n' + 
    '  <div class="navbar-inner">\n' + 
    '    <div class="left"><a href="#" class="back link" id="sellBack"> <i class="icon icon-back"></i><span>Back</span></a></div>\n' + 
    '    <div class="center sliding">Jual</div>\n' + 
    '    <div class="right">\n' + 
    '      <a href="#" class="link icon-only open-panel"> <i class="icon icon-bars"></i></a>\n' + 
    '    </div>\n' + 
    '  </div>\n' + 
    '</div>\n' + 
    '<div class="pages">\n' + 
    '  <!-- Page, data-page contains page name-->\n' + 
    '  <div data-page="sell" class="page">\n' + 
    '    <!-- Scrollable page content-->\n' + 
    '    <div class="page-content">\n' + 
    '      <div class="content-block">\n' + 
    '        <div class="list-block">\n' + 
    '          <ul>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Tanggal penjualan" readonly id="sold_date" value="'+data.sold_date+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Nama barang" id="name" value="'+data.name+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Merk" id="brand" value="'+data.brand+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Supplier" id="supplier" value="'+data.supplier+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Keterangan" id="descr" value="'+data.descr+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Harga beli per unit" onkeypress="return isNumberKey(event);" onkeyup="this.value=numberWithCommas(this.value);" id="buy_price" value="'+data.buy_price+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Harga jual per unit" onkeypress="return isNumberKey(event);" onkeyup="this.value=numberWithCommas(this.value);" id="sell_price" value="'+data.sell_price+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Jumlah terjual" onkeypress="return isNumberKey(event);" onkeyup="this.value=numberWithCommas(this.value);" id="qty" value="'+data.qty+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '          </ul>\n' + 
    '        </div>\n' + 
    '        <div class="img-wrapper" onclick="capturePhoto();">\n' + 
    '            <img id="smallImage" src="'+data.pic_url+'">\n' + 
    '        </div>\n' + 
    '        <!-- <p><a href="#" class="button" onclick="capturePhoto();">Ambil gambar</a></p> -->\n' + 
    '        <br /><br />\n' + 
    '        <a href="#" class="button button-big button-fill color-gray" style="background-color:grey;" onclick="editSelling('+data.id+');">Edit penjualan</a>\n' + 
    '      </div>\n' + 
    '    </div>\n' + 
    '  </div>\n' + 
    '</div>\n'
  );
  return;
}

function editSelling(id) {
  //check to ensure the mydb object has been created
  if (mydb) {
      //get the values of the make and model text inputs
      var name = document.getElementById("name").value;
      var brand = document.getElementById("brand").value;
      var supplier = document.getElementById("supplier").value;
      var descr = document.getElementById("descr").value;
      var pic_url = document.getElementById('smallImage').src;
      var buy_price = document.getElementById("buy_price").value;
      var sell_price = document.getElementById("sell_price").value;
      var qty = document.getElementById("qty").value;
      var sold_date = document.getElementById("sold_date").value;

      //Test to ensure that the user has entered both a make and model
      if (name!=="" && buy_price!=="" && sell_price!=="" && qty!=="" && sold_date!=="") {
          //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
          mydb.transaction(function (t) {
              t.executeSql("UPDATE selling_history SET name=?, brand=?, supplier=?, descr=?, pic_url=?, buy_price=?, sell_price=?, qty=?, sold_date=? WHERE id=?", [name, brand, supplier, descr, pic_url, buy_price, sell_price, qty, sold_date, id]);              
              outputInventory();
              mainView.router.back();
              // t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
              // t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
              // t.executeSql("INSERT INTO supplier (name) VALUES (?)", [supplier]);
              // t.executeSql("INSERT INTO descr (name) VALUES (?)", [descr]);
          });
      } else {
          myApp.alert("Data tidak lengkap!");
      }
  } else {
      myApp.alert("Browser Anda tidak mendukung WebSQL!");
      mainView.router.back();
  }
}

function showNames (transaction, results) {
  for (i=0; i<results.rows.length; i++) {
    myApp.alert(results.rows.item(i).name);
  }
  // body...
}

function updateInventoryList(transaction, results) {
  if (results.rows.length < 1) {
    document.getElementById('welcomeMessage').innerHTML = '<p>Anda belum mencatat penjualan apapun. Klik tombol di atas untuk mencatat penjualan.</p>';
    var myList = myApp.virtualList('#sellingHistoryList', {items: ['']});
  } else {
    document.getElementById('welcomeMessage').innerHTML = '';

    var sellingHistoryContainer = document.getElementById('sellingHistoryContainer');
    var i;
    var theInnerHtml = '';
    var itemsDateArray = [];
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);

        if (typeof itemsDateArray[row.sold_date] === 'undefined') {
            theInnerHtml += 
                '<div class="content-block-title" id="sellingHistoryTitle_'+row.sold_date+'">'+row.sold_date+'</div>\n' + 
                '<div class="list-block virtual-list media-list" id="sellingHistoryList_'+row.sold_date+'"></div>\n';
            itemsDateArray[row.sold_date] = [];
        };

        var jsonData = {};
        jsonData['id'] = row.id;
        jsonData['pic_url'] = row.pic_url;
        jsonData['name'] = row.name;
        jsonData['qty'] = row.qty;
        jsonData['brand'] = row.brand;
        jsonData['descr'] = row.descr;
        itemsDateArray[row.sold_date].push(jsonData);
    }
    sellingHistoryContainer.innerHTML = theInnerHtml;

    for (var k in itemsDateArray){
        // if (target.hasOwnProperty(k)) {
        //      alert("Key is " + k + ", value is" + target[k]);
        // }
        myApp.virtualList('#sellingHistoryList_'+k, {
            // Array with plain HTML items
            items: itemsDateArray[k],
            // Template 7 template to render each item
            template: 
            '<li style="height:100px;">\n' + 
                    '  <a href="#" class="item-link item-content sell-edit" data-id="{{id}}">\n' + 
                    '    <div class="item-media"><img src="{{pic_url}}" height="80"></div>\n' + 
                    '    <div class="item-inner">\n' + 
                    '      <div class="item-title-row">\n' + 
                    '        <div class="item-title">{{name}}</div>\n' + 
                    '        <div class="item-after">{{qty}}</div>\n' + 
                    '      </div>\n' + 
                    '      <div class="item-subtitle">{{brand}}</div>\n' + 
                    '      <div class="item-text">{{descr}}</div>\n' + 
                    '    </div>\n' + 
                    '  </a>\n' + 
                    '</li>',
            height:100
        });
    }

    $$('.sell-edit').on('click', function () {
      loadSellEdit($$(this).data('id'));
    });
  }
}

outputInventory();







var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // // Uncomment to view the base64-encoded image data
  // // console.log(imageData);

  // // Get image handle
  // //
  // var smallImage = document.getElementById('smallImage');

  // // Unhide image elements
  // //
  // smallImage.style.display = 'block';

  // // Show the captured photo
  // // The in-line CSS rules are used to resize the image
  // //
  // smallImage.src = imageData;
  cropAndMovePic(imageData);
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The in-line CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { 
    quality: 50,
    destinationType: destinationType.FILE_URI, 
    saveToPhotoAlbum: false,
    // allowEdit: true
  });
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
  
}





var photoOriginFolder = '';
function cropAndMovePic(fileUri){ 
  plugins.crop(function success () {
    filePath = fileUri.replace("file://", ""); 
    var res = filePath.split("/");
    var theStr = '';
    var until = res.length - 2;
    for (var i=1; i<until; i++) {
      theStr+='/'+res[i];
    }
    theStr = 'file://' + theStr;

    cropFileUri = theStr + '/cache/cropped.jpg';
    fileName = res[res.length-1];

    window.resolveLocalFileSystemURI(
      cropFileUri,
      function(fileEntry){
            newFileUri  = theStr + '/files/';
            oldFileUri  = cropFileUri;
            // fileName = fileEntry.fullPath.replace('/','');

            window.resolveLocalFileSystemURI(newFileUri,
                    function(dirEntry) {
                        // move the pic to a new directory and rename it
                        fileEntry.moveTo(dirEntry, fileName, successMove, resOnError);

                        // change smallImage src to the new pic
                        var smallImage = document.getElementById('smallImage');
                        smallImage.style.display = 'block';
                        smallImage.src = newFileUri+'/'+fileName;
                        // alert(newFileUri+'/'+fileName);
                    },
                    resOnError);
      },
      resOnError
    );
  }, function fail () {
    // myApp.alert('gagal');
  }, fileUri);
} 

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
  // alert(entry.fullPath);
    //Store imagepath in session for future use
    // like to store it in database
    // sessionStorage.setItem('imagepath', entry.fullPath);
}

function resOnError(error) {
    // alert(error.code);
}







function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}
function numberWithCommas(x) {
    //remove commas
    retVal = x ? parseFloat(x.replace(/,/g, '')) : 0;
    if (retVal==0) return '';

    //apply formatting
    return retVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



