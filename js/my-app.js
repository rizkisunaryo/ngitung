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



var colorArr = ["Black", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Gainsboro", "DarkTurquoise", "Crimson"];

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

myApp.onPageInit('sell', function (page) {
    var calendarDefault = myApp.calendar({
        input: '#sold_date',
        closeOnSelect: true,
    });

    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM name", [], function (transaction, results) {
              var availableTags = [];
              for (i=0; i<results.rows.length; i++) 
                availableTags.push(results.rows.item(i).name);
              $( "#name" ).autocomplete({
                delay: 0,
                source: availableTags
              });
            });

            t.executeSql("SELECT * FROM brand", [], function (transaction, results) {
              var availableTags = [];
              for (i=0; i<results.rows.length; i++) 
                availableTags.push(results.rows.item(i).name);
              $( "#brand" ).autocomplete({
                delay: 0,
                source: availableTags
              });
            });

            t.executeSql("SELECT * FROM supplier", [], function (transaction, results) {
              var availableTags = [];
              for (i=0; i<results.rows.length; i++) 
                availableTags.push(results.rows.item(i).name);
              $( "#supplier" ).autocomplete({
                delay: 0,
                source: availableTags
              });
            });
        });
    } 
});

var fsh_from_sold_dateCal;
var fsh_to_sold_dateCal;
myApp.onPageInit('filterSellingHistory', function (page) {
    fsh_from_sold_dateCal = myApp.calendar({
        input: '#fsh_from_sold_date',
        closeOnSelect: true,
        onClose: function (p, values, displayValues) {
                    localStorage.fsh_from_sold_date = document.getElementById('fsh_from_sold_date').value;
                  }
    });
    if (!isEmpty(localStorage.fsh_from_sold_date)) {
      document.getElementById('fsh_from_sold_date').value = localStorage.fsh_from_sold_date;
    }

    fsh_to_sold_dateCal = myApp.calendar({
        input: '#fsh_to_sold_date',
        closeOnSelect: true,
        onClose: function (p, values, displayValues) {
                    localStorage.fsh_to_sold_date = document.getElementById('fsh_to_sold_date').value;
                  }
    });
    if (!isEmpty(localStorage.fsh_to_sold_date)) {
      document.getElementById('fsh_to_sold_date').value = localStorage.fsh_to_sold_date;
    }

    $('#fsh_name').focusout(function() {
      localStorage.fsh_name = document.getElementById('fsh_name').value;
    });
    if (!isEmpty(localStorage.fsh_name)) {
      document.getElementById('fsh_name').value = localStorage.fsh_name;
    }

    $('#fsh_brand').focusout(function() {
      localStorage.fsh_brand = document.getElementById('fsh_brand').value;
    });
    if (!isEmpty(localStorage.fsh_brand)) {
      document.getElementById('fsh_brand').value = localStorage.fsh_brand;
    }

    $('#fsh_supplier').focusout(function() {
      localStorage.fsh_supplier = document.getElementById('fsh_supplier').value;
    });
    if (!isEmpty(localStorage.fsh_supplier)) {
      document.getElementById('fsh_supplier').value = localStorage.fsh_supplier;
    }
});

myApp.onPageInit('pieChart', function (page) {
  if (mydb) {
      mydb.transaction(function (t) {
        t.executeSql("SELECT name, brand, supplier, SUM(qty) as sum_qty FROM selling_history GROUP BY name, brand, supplier ORDER BY sum_qty DESC", [], function (transaction, results) {
          var pieData = [];

          var iLimit = 10;
          if (results.rows.length < iLimit) 
            iLimit = results.rows.length;

          // var ulInnerHtml = '';
          for (i=0; i<iLimit; i++) {
            var record = results.rows.item(i);
            pieData.push({
              value:record.sum_qty,
              label:record.brand + ' - ' + record.name + ' - ' + record.supplier,
              color:colorArr[i]
            });

            // ulInnerHtml += '<li class="chart" style="color:'+ colorArr[i] +'">'+ record.brand + ' - ' + record.name + ' - ' + record.supplier +'</li>';
          }

          var ctx = document.getElementById("chart-area").getContext("2d");
          new Chart(ctx).Pie(pieData);
          // $$('#pieChart-ul').html(ulInnerHtml);
        });
      });
  } 
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
  var mydb = openDatabase("ngitung", "0.1", "Ngitung DB", 1024 * 1024 * 50);

  mydb.transaction(function (t) {
      t.executeSql("CREATE TABLE IF NOT EXISTS selling_history (id INTEGER PRIMARY KEY ASC, name, brand, supplier, descr, pic_url, buy_price, sell_price, qty, sold_date)");
      // t.executeSql("CREATE TABLE IF NOT EXISTS setting (from_sold_date, to_sold_date, name, brand, supplier)");
      // t.executeSql("INSERT INTO selling_history (name, brand, supplier, descr, pic_url, buy_price, sell_price, qty, sold_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ['name', 'brand', 'supplier', 'descr', 'pic_url', '10,000', '20,000', '3', '2015-11-12']);
      t.executeSql("CREATE TABLE IF NOT EXISTS name (name PRIMARY KEY)");
      t.executeSql("CREATE TABLE IF NOT EXISTS brand (name PRIMARY KEY)");
      t.executeSql("CREATE TABLE IF NOT EXISTS supplier (name PRIMARY KEY)");
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
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO supplier (name) VALUES (?)", [supplier]);
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
          var sqlStr = "SELECT * FROM selling_history WHERE 1 ";
          if (!isEmpty(localStorage.fsh_from_sold_date)) {
            sqlStr += "AND sold_date >= '"+localStorage.fsh_from_sold_date+"' ";
          }
          if (!isEmpty(localStorage.fsh_to_sold_date)) {
            sqlStr += "AND sold_date <= '"+localStorage.fsh_to_sold_date+"' ";
          }
          if (!isEmpty(localStorage.fsh_name)) {
            sqlStr += "AND name = '"+localStorage.fsh_name+"' ";
          }
          if (!isEmpty(localStorage.fsh_brand)) {
            sqlStr += "AND brand = '"+localStorage.fsh_brand+"' ";
          }
          if (!isEmpty(localStorage.fsh_supplier)) {
            sqlStr += "AND supplier = '"+localStorage.fsh_supplier+"' ";
          }
          sqlStr += 'ORDER BY sold_date ASC';
          t.executeSql(sqlStr, [], updateInventoryList);
      });
  } else {
      // alert("db not found, your browser does not support web sql!");
      outputInventory2();
  }
}

function outputInventoryWithDate(fromDate,toDate) {
  //check to ensure the mydb object has been created
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          sqlStr = "SELECT * FROM selling_history WHERE 1 ";
          if (fromDate!=='') {
            sqlStr += "AND sold_date>='"+fromDate+"' "
          }
          if (toDate!=='') {
            sqlStr += "AND sold_date<='"+toDate+"' "
          }
          sqlStr += "ORDER BY sold_date ASC ";
          t.executeSql(sqlStr, [], updateInventoryList);
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
    '    <div class="center sliding">Edit Penjualan</div>\n' + 
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
    '        <div class="row">\n' + 
    '          <div class="col-50">\n' + 
    '            <a href="#" class="button button-big button-fill color-gray" style="background-color:red;" onclick="delSelling('+data.id+');">Hapus</a>\n' + 
    '          </div>\n' + 
    '          <div class="col-50">\n' + 
    '            <a href="#" class="button button-big button-fill color-gray" style="background-color:grey;" onclick="editSelling('+data.id+');">Edit</a>\n' + 
    '          </div>\n' + 
    '        </div>\n' + 
    // '        <a href="#" class="button button-big button-fill color-gray" style="background-color:grey;" onclick="editSelling('+data.id+');">Edit penjualan</a>\n' + 
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
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO supplier (name) VALUES (?)", [supplier]);
          });
      } else {
          myApp.alert("Data tidak lengkap!");
      }
  } else {
      myApp.alert("Browser Anda tidak mendukung WebSQL!");
      mainView.router.back();
  }
}

function delSelling(id) {
  //check to ensure the mydb object has been created
  if (mydb) {
    mydb.transaction(function (t) {
        t.executeSql("DELETE FROM selling_history WHERE id=?", [id]);
        outputInventory();
        mainView.router.back();
    });
  } else {
      myApp.alert("Browser Anda tidak mendukung WebSQL!");
      mainView.router.back();
  }
}

function updateInventoryList(transaction, results) {
  if (results.rows.length < 1) {
    // if (isEmpty(localStorage.fsh_from_sold_date) && isEmpty(localStorage.fsh_to_sold_date)) {
    //   document.getElementById('welcomeMessage').innerHTML = '<p>Anda belum mencatat penjualan apapun. Klik tombol di bawah untuk mencatat penjualan.</p>';
    // } else {
    //   var theInnerHtml2 = 'Tidak ada data penjualan';
    //   if (localStorage.fsh_from_sold_date!=='') {
    //     theInnerHtml2 += ' dari ' + getFormattedDate(localStorage.fsh_from_sold_date);
    //   }
    //   if (localStorage.fsh_to_sold_date!=='') {
    //     theInnerHtml2 += ' sampai ' + getFormattedDate(localStorage.fsh_to_sold_date);
    //   }
    //   document.getElementById('welcomeMessage').innerHTML = '<p>'+theInnerHtml2+'.</p>';
    // }
    document.getElementById('welcomeMessage').innerHTML = '<p>Tidak ada data. Silahkan ubah filter atau tambah data penjualan.</p>';
    var sellingHistoryContainer = document.getElementById('sellingHistoryContainer');
    sellingHistoryContainer.innerHTML = '';
  } else {
    document.getElementById('welcomeMessage').innerHTML = '';

    var sellingHistoryContainer = document.getElementById('sellingHistoryContainer');
    var i;
    var theInnerHtml = '';
    var itemsDateArray = [];
    var prevSoldDate = '';
    var profitTotalPerDay = 0;
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);

        if (typeof itemsDateArray[row.sold_date] === 'undefined') {
            itemsDateArray[row.sold_date] = [];
        }

        if (prevSoldDate!=row.sold_date && prevSoldDate!=='') {
          theInnerHtml += 
            '<div class="content-block-title" id="sellingHistoryTitle_'+prevSoldDate+'">'+getFormattedDate(prevSoldDate)+'<br />'+numberWithCommas(profitTotalPerDay.toString())+'</div>\n' + 
            '<div class="list-block virtual-list media-list" id="sellingHistoryList_'+prevSoldDate+'"></div>\n';

          profitTotalPerDay = 0;
        }
        var buyPriceNum = Number(row.buy_price.split(',').join(''));
        var sellPriceNum = Number(row.sell_price.split(',').join(''));
        var profit = (sellPriceNum - buyPriceNum) * Number(row.qty);
        profitTotalPerDay += profit;

        var jsonData = {};
        jsonData['id'] = row.id;
        jsonData['pic_url'] = row.pic_url;
        jsonData['name'] = row.name;
        jsonData['qty'] = row.qty;
        jsonData['brand'] = row.brand;
        jsonData['descr'] = row.descr;
        itemsDateArray[row.sold_date].push(jsonData);

        prevSoldDate = row.sold_date;
    }
    theInnerHtml += 
      '<div class="content-block-title" id="sellingHistoryTitle_'+prevSoldDate+'">'+getFormattedDate(prevSoldDate)+'<br />'+numberWithCommas(profitTotalPerDay.toString())+'</div>\n' + 
      '<div class="list-block virtual-list media-list" id="sellingHistoryList_'+prevSoldDate+'"></div>\n';

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



function getFormattedDate(dateYmd) {
  var d = new Date(dateYmd);

  var day = d.getDay();
  var date = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();

  var dayStr = '';
  switch (day) {
      case 0:
          dayStr = "Minggu";
          break;
      case 1:
          dayStr = "Senin";
          break;
      case 2:
          dayStr = "Selasa";
          break;
      case 3:
          dayStr = "Rabu";
          break;
      case 4:
          dayStr = "Kamis";
          break;
      case 5:
          dayStr = "Jum'at";
          break;
      case 6:
          dayStr = "Sabtu";
          break;
  } 

  var monthStr = '';
  switch (month) {
    case 0:
      monthStr = 'Januari';
      break;
    case 1:
      monthStr = 'Februari';
      break;
    case 2:
      monthStr = 'Maret';
      break;
    case 3:
      monthStr = 'April';
      break;
    case 4:
      monthStr = 'Mei';
      break;
    case 5:
      monthStr = 'Juni';
      break;
    case 6:
      monthStr = 'Juli';
      break;
    case 7:
      monthStr = 'Agustus';
      break;
    case 8:
      monthStr = 'September';
      break;
    case 9:
      monthStr = 'Oktober';
      break;
    case 10:
      monthStr = 'November';
      break;
    case 11:
      monthStr = 'Desember';
      break;
  }

  return dayStr+', '+date+' '+monthStr+' '+year;
}



function clearFilterSellingHistory() {
  fsh_from_sold_dateCal.setValue('');
  fsh_to_sold_dateCal.setValue('');
  document.getElementById('fsh_name').value = '';
  document.getElementById('fsh_brand').value = '';
  document.getElementById('fsh_supplier').value = '';

  localStorage.fsh_from_sold_date = '';
  localStorage.fsh_to_sold_date = '';
  localStorage.fsh_name = '';
  localStorage.fsh_brand = '';
  localStorage.fsh_supplier = '';
}

function isEmpty(value) {
  if (typeof value === 'undefined' || value.trim()==='')
    return true;
  return false;
}