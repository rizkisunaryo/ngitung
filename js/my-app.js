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
    // run createContentPage func after link was clicked
    var calendarDefault = myApp.calendar({
          input: '#sold_date',
      });
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



function outputInventory() {
  //check to ensure the mydb object has been created
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          t.executeSql("SELECT * FROM selling_history ORDER BY sold_date ASC", [], updateInventoryList);
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
    jsonData['pic_url'] = 'pic_url';
          jsonData['name'] = 'row.name';
          jsonData['qty'] = 'row.qty';
          jsonData['supplier'] = 'row.supplier';
          jsonData['descr'] = 'row.descr';
          itemsArray.push(jsonData);
    var myList = myApp.virtualList('#sellingHistoryList_2015-12-12', {
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
                '      <div class="item-subtitle">{{supplier}}</div>\n' + 
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
                '      <div class="item-subtitle">{{supplier}}</div>\n' + 
                '      <div class="item-text">{{descr}}</div>\n' + 
                '    </div>\n' + 
                '  </a>\n' + 
                '</li>',
        height:100
    });
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
        jsonData['pic_url'] = row.pic_url;
        jsonData['name'] = row.name;
        jsonData['qty'] = row.qty;
        jsonData['supplier'] = row.supplier;
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
                    '  <a href="#" class="item-link item-content">\n' + 
                    '    <div class="item-media"><img src="{{pic_url}}" height="80"></div>\n' + 
                    '    <div class="item-inner">\n' + 
                    '      <div class="item-title-row">\n' + 
                    '        <div class="item-title">{{name}}</div>\n' + 
                    '        <div class="item-after">{{qty}}</div>\n' + 
                    '      </div>\n' + 
                    '      <div class="item-subtitle">{{supplier}}</div>\n' + 
                    '      <div class="item-text">{{descr}}</div>\n' + 
                    '    </div>\n' + 
                    '  </a>\n' + 
                    '</li>',
            height:100
        });
    }



















    // var itemsArray = [];
    // //Iterate through the results
    // for (i = 0; i < results.rows.length; i++) {
    //     //Get the current row
    //     var row = results.rows.item(i);

    //     var jsonData = {};
    //     jsonData['pic_url'] = row.pic_url;
    //     jsonData['name'] = row.name;
    //     jsonData['qty'] = row.qty;
    //     jsonData['supplier'] = row.supplier;
    //     jsonData['descr'] = row.descr;
    //     itemsArray.push(jsonData);
    // }
    // var myList = myApp.virtualList('#sellingHistoryList', {
    //     // Array with plain HTML items
    //     items: itemsArray,
    //     // Template 7 template to render each item
    //     template: 
    //     '<li style="height:100px;">\n' + 
    //             '  <a href="#" class="item-link item-content">\n' + 
    //             '    <div class="item-media"><img src="{{pic_url}}" height="80"></div>\n' + 
    //             '    <div class="item-inner">\n' + 
    //             '      <div class="item-title-row">\n' + 
    //             '        <div class="item-title">{{name}}</div>\n' + 
    //             '        <div class="item-after">{{qty}}</div>\n' + 
    //             '      </div>\n' + 
    //             '      <div class="item-subtitle">{{supplier}}</div>\n' + 
    //             '      <div class="item-text">{{descr}}</div>\n' + 
    //             '    </div>\n' + 
    //             '  </a>\n' + 
    //             '</li>',
    //     height:100
    // });
  }
}

outputInventory();