var canvas = document.getElementById('canvas');
var printer = null;
var ePosDev = new epson.ePOSDevice();
ePosDev.connect('192.168.192.168', 8008, cbConnect);
function cbConnect(data) {
    if(data == 'OK' || data == 'SSL_CONNECT_OK') {
        ePosDev.createDevice('local_printer', ePosDev.DEVICE_TYPE_PRINTER,
                              {'crypto':false, 'buffer':false}, cbCreateDevice_printer);
    } else {
        alert(data);
    }
}
function cbCreateDevice_printer(devobj, retcode) {
    if( retcode == 'OK' ) {
        printer = devobj;
        printer.timeout = 60000;
        printer.onreceive = function (res) { alert(res.success); };
        printer.oncoveropen = function () { alert('coveropen'); };
        print();
    } else {
        alert(retcode);
    }
}

function print() {
    printer.addTextPosition(139);
    printer.addTextSize(2, 2);
    printer.addTextStyle(false, false, false, printer.COLOR_3);
    printer.addText('SENLABO\n');
    printer.addTextSize(1, 1);
    printer.addTextStyle(false, false, false, printer.COLOR_1);
    printer.addText('Siege social : Liberté 6 Extension N° 121, Dakar\n');
    printer.addText('Site de : https://senlabodakar.com/\n');
    printer.addText('Tel : +221 33 868 44 78\n');
    printer.addText('Email : secretariat@senlabo.com\n');
    printer.send();
}