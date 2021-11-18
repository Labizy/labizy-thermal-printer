'use strict';
const path = require('path')
const escpos = require('escpos')
escpos.USB = require('escpos-usb')

const device = new escpos.USB();
const options = {
  encoding: "GB18030",
  width: 58

}
const printer = new escpos.Printer(device, options)

var bodyParser = require('body-parser')
var app = require('express')()
var http = require('http').Server(app)
var cors = require('cors');
const dayjs = require('dayjs');
app.use(cors())
app.use(bodyParser.json())

const port = 3525;






app.post('/print', (req, res) => {

  print(req.body)
  res.json(
    { status: 'success' }
  )
});

http.listen(port, () => {
  console.log(`Printer: http://localhost:${port}`);
});

const print = (facture) => {





  //   const facture = JSON.parse(`
  // {
  //   "montant": 27000,
  //   "montant_avance": 0,
  //   "analyses": [
  //       {
  //           "prix": 22000,
  //           "prix_ipm": 19000,
  //           "_id": "60d2b0ec23a297d70cfe6ac8",
  //           "designation": "Transferrine",
  //           "created_at": "2021-06-23T03:56:27.855Z",
  //           "updated_at": "2021-06-23T03:58:16.388Z",
  //           "type": {
  //               "_id": "60d2a947893ca43ddca9bdb9",
  //               "designation": "Biochimie",
  //               "slug": "biochimie",
  //               "created_at": "2021-06-23T03:23:51.772Z",
  //               "updated_at": "2021-06-23T03:23:51.772Z",
  //               "__v": 0
  //           }
  //       },
  //       {
  //           "prix": 9500,
  //           "prix_ipm": 8000,
  //           "_id": "60d2b0ec23a297d70cfe6aa5",
  //           "designation": "Clairance créatinine",
  //           "created_at": "2021-06-23T03:56:27.854Z",
  //           "updated_at": "2021-06-23T03:58:16.388Z",
  //           "type": {
  //               "_id": "60d2a947893ca43ddca9bdb9",
  //               "designation": "Biochimie",
  //               "slug": "biochimie",
  //               "created_at": "2021-06-23T03:23:51.772Z",
  //               "updated_at": "2021-06-23T03:23:51.772Z",
  //               "__v": 0
  //           }
  //       }
  //   ],
  //   "_id": "6187e63c9f23510a23a5deb5",
  //   "prise_en_charge": true,
  //   "exonerant": {
  //       "_id": "61023f4aca8a381becc07014",
  //       "designation": "IPM de SAGAM",
  //       "taux": 10,
  //       "slug": "ipm-de-sagam"
  //   },
  //   "agent_facturation": {
  //       "isConfirmed": true,
  //       "otpTries": 0,
  //       "status": true,
  //       "roles": [
  //           "agent_saisie",
  //           "comptable",
  //           "technicien",
  //           "admin"
  //       ],
  //       "_id": "617f0eeeb6e8f0e06156786f",
  //       "firstName": "Moha",
  //       "lastName": "Cisse",
  //       "email": "mceessay@gmail.com",
  //       "created_at": "2021-10-31T21:47:31.246Z",
  //       "updated_at": "2021-11-03T23:03:46.722Z",
  //       "__v": 0,
  //       "password": "$2b$10$HSC1gKqyh1gxYRO/Ems3X.GfKL4yuEEADXnXQ5VyDloWq8J6xrmBW"
  //   },
  //   "patient": {
  //       "_id": "6187e63c9f23510a23a5deb1",
  //       "nom": "Test",
  //       "prenom": "test",
  //       "date_naissance": "2021-11-29",
  //       "sexe": "f",
  //       "telephone": "77828282",
  //       "email": "jdhfakfj@kjdfsd.ss",
  //       "adresse": "dfsdfd",
  //       "created_at": "2021-11-07T14:44:12.593Z",
  //       "updated_at": "2021-11-07T14:44:12.593Z",
  //       "numero_patient": 1061,
  //       "__v": 0
  //   },
  //   "prescripteur": {
  //       "nom": "sdfdf",
  //       "structure": "sdfsd",
  //       "telephone": "dsfd",
  //       "email": "sdf@ksjd.sdd"
  //   },
  //   "status": "pending",
  //   "created_at": "2021-11-07T14:44:12.660Z",
  //   "updated_at": "2021-11-07T14:44:12.660Z",
  //   "numero_facture": 1056,
  //   "__v": 0
  // }
  // `)







  device.open(

    function () {
      printer
        .font('a')
        .align('ct')
        .style('bu')
        .size(1, 1)
        .text("SENLABO");


      printer
        .control("LF")
        .font('b')
        .align("LT")
        .style('a')
        .size(0, 0)
        .text("Siege social : Liberte 6 Extension N 121, Dakar");

      printer
        .control("CR")
        .font('b')
        .align("LT")
        .style('a')
        .size(0, 0)
        .text("Site de : https://senlabodakar.com");


      printer
        .control("CR")
        .font('b')
        .align("LT")
        .style('a')
        .size(0, 0)
        .text("Tel : +221 33 868 44 78");

      printer
        .control("CR")
        .font('b')
        .align("LT")
        .style('a')
        .size(0, 0)
        .text("Email : secretariat@senlabo.com");

      printer
        .control("LF")
        .font('a')
        .align('ct')
        .style('bu')
        .size(1, 1)
        .text(`Facture N: ${facture.numero_facture}`);




      printer
        .control("LF")
        .font('b')
        .align("LT")
        .style('a')
        .size(0, 0)
        .text(`fait a Dakar le : ${dayjs(facture.created_at).format("D MMM YYYY HH:mm")}`);

      const { analyses } = facture


      for (let i = 0; i < analyses.length; i++) {
        const item = analyses[i];

        //   {
        //     "prix": 22000,
        //     "prix_ipm": 19000,
        //     "_id": "60d2b0ec23a297d70cfe6ac8",
        //     "designation": "Transferrine",
        //     "created_at": "2021-06-23T03:56:27.855Z",
        //     "updated_at": "2021-06-23T03:58:16.388Z",
        //     "type": {
        //         "_id": "60d2a947893ca43ddca9bdb9",
        //         "designation": "Biochimie",
        //         "slug": "biochimie",
        //         "created_at": "2021-06-23T03:23:51.772Z",
        //         "updated_at": "2021-06-23T03:23:51.772Z",
        //         "__v": 0
        //     }
        // },

        printer
          .control("LF")
          .font('b')
          .align("LT")
          .style('b')
          .size(0, 0)
          .text(item.designation);

        printer
          .control("CR")
          .font('b')
          .align("LT")
          .style('a')
          .size(0, 0)
          .text(`Montant a payer: ${item.prix}`);

        printer
          .control("CR")
          .font('b')
          .align("LT")
          .style('a')
          .size(0, 0)
          .text(`Montant exoneration: ${item.prix_ipm}`);
        // printer
        //   .control("CR")
        //   .font('b')
        //   .align("LT")
        //   .style('a')
        //   .size(0, 0)
        //   .text(`Montant paye ${item.designation}`);



      }


      printer.cut()
        .close();
    });
}
