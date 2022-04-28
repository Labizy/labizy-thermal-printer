'use strict';
const path = require('path')
const escpos = require('escpos')
escpos.USB = require('escpos-usb')
const writtenNumber = require('written-number');
writtenNumber.defaults.lang = 'fr';

var bodyParser = require('body-parser')
var app = require('express')()
var http = require('http').Server(app)
var cors = require('cors');
const dayjs = require('dayjs');
app.use(cors({
  origin: '*',
}));
app.use(bodyParser.json())

const port = 3525;

const formatNumber = (val = 0) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");  //Intl.NumberFormat().format(parseInt(val))

const size1 = (1 + 1 * 0.5)
const size2 = (1 + 1 * 0.7)

app.post('/print', (req, res) => {

  try {
    print(req.body)
    res.json(
      { succes: true }
    )
  } catch (error) {
    res.status(400).send({ status: false, error })
  }

});

http.listen(port, () => {
  console.log(`Printer: http://localhost:${port}`);
});

const logo = path.join(__dirname, "logo.png")

const print = (facture) => {

  const device = new escpos.USB(0x04b8, 0x0e28);
  const options = {
    encoding: "860",
    width: 32

  }
  const printer = new escpos.Printer(device, options)



  //console.log("Printing...", facture)

  const calculateAge = (dateStr) => {
    const dateNaiss = dayjs(dateStr, "YYYY-MM-DD")
    const now = dayjs()
    const years = now.diff(dateNaiss, 'y')
    return years
  }

  const { analyses, patient, agent_facturation, exonerant } = facture


  escpos.Image.load(logo, function (image) {
    device.open(

      function () {

        printer.align('ct')
          .image(image, 'd24')

        printer
          .control("LF")
          .font('a')
          .align("LT")
          .style('a')
          .size(0, 0)
          .text("Siège social: Liberté 6 Extension N 121, Dakar");

        printer
          .control("CR")
          .font('a')
          .align("LT")
          .style('a')
          .size(0, 0)
          .text("Site: https://senlabodakar.com");


        printer
          .control("CR")
          .font('a')
          .align("LT")
          .style('a')
          .size(0, 0)
          .text("Tel: +221 33 868 44 78");

        printer
          .control("CR")
          .font('a')
          .align("LT")
          .style('a')
          .size(0, 0)
          .text("Email: secretariat@senlabo.com");

        printer
          .control("LF")
          .font('b')
          .align("LT")

          // .align('ct')
          // .style('bu')
          .size(1, size1)
          // .text(`Facture N: ${facture.numero_facture}`)
          .tableCustom([
            { text: "N* Facture", align: 'LEFT', width: 0.5 },
            { text: facture.numero_facture, align: 'RIGHT', width: 0.5 }
          ]);


        printer
          .control("LF")
          .font('b')
          .align("LT")

          // .align('ct')
          // .style('bu')
          .size(1, size1)
          // .text(`Facture N: ${facture.numero_facture}`)
          .tableCustom([
            { text: "CP:", align: 'LEFT' },
            { text: patient?.numero_patient, align: 'RIGHT' }
          ]);


        printer
          .control("LF")
          .font('a')
          .align("LT")
          .style('a')
          .size(0, 0)
          .text(`fait à Dakar le: ${dayjs(facture.created_at).format("D MMM YYYY HH:mm")}`);

        printer
          .control("LF")
          .font('a')
          .align("LT")
          .style('b')
          .size(0, 0)
          .text(`Prénom et Nom: ${patient?.prenom} ${patient?.nom}`);


        printer
          .control("CR")
          .font('a')
          .align("LT")
          .style('b')
          .size(0, 0)
          .text(`Age: ${patient?.age || calculateAge(patient?.date_naissance) || ""} an(s)`);

        printer
          .control("CR")
          .font('a')
          .align("LT")
          .style('b')
          .size(0, 0)
          .text(`Adresse:  ${patient?.adresse || ""}`);

        printer
          .control("CR")
          .font('a')
          .align("LT")
          .style('b')
          .size(0, 0)
          .text(`Téléphone: ${patient?.telephone || ""}`);


        // printer
        //   .control("CR")
        //   .font('a')
        //   .align("LT")
        //   .style('b')
        //   .size(0, 0)
        //   .text(`Matricule: ${patient?.numero_patient}`);



        analyses.map(item => {
          printer
            .control("LF")

          printer
            .font('a')
            .align("LT")
            .size(size1, size1)
            .text(item.designation);

          printer
            .control("CR")
            .align("RT")
            .font("a")
            .style('B')
            .size(size1, size1)
            .text(`Montant Payé = ${formatNumber(item.prix) || 0} F`.toUpperCase());
        });


        printer.drawLine()

        printer
          .control("LF")
          .font('a')
          .style('a')
          .size(0, 0).tableCustom([
            { text: "Total:", align: 'LEFT' },
            { text: `${formatNumber(facture.montant) || 0} F`, align: 'RIGHT' }
          ]);

        printer
          .control("CR")
          .font('a')
          .style('a')
          .size(0, 0).tableCustom([
            { text: "Montant à payer:", align: 'LEFT' },
            { text: `${formatNumber(facture.montant_a_payer) || 0} F`, align: 'RIGHT' }
          ]);



        if (facture?.montant_avance) {
          printer
            .control("CR")
            .font('a')
            .style('a')
            .size(size1, size1).tableCustom([
              { text: "Montant avance:", align: 'LEFT' },
              { text: `${formatNumber(facture.montant_avance) || 0} F`, align: 'RIGHT' }
            ]);

          const restant_a_payer = facture.montant_a_payer - (facture?.montant_avance || 0)
          printer
            .control("CR")
            .font('a')
            .style('a')
            .size(size1, size1).tableCustom([
              { text: "Restant à payer:", align: 'LEFT' },
              { text: `${formatNumber(restant_a_payer) || 0} F`, align: 'RIGHT' }
            ]);

        }



        const montantNetStr = writtenNumber(facture.montant || 0)

        const montantText = `Est etablie la presente facture en date du ${dayjs(facture.created_at).format("D/MM/YYYY")} à ${montantNetStr} FCFA`


        printer
          .control("LF")
          .font('a')
          .align("LT")
          .style('b')
          .size(size1, size1)
          .text(montantText);


        if (facture.prise_en_charge) {
          printer
            .control("LF")
            .font('a')
            .align("CT")
            .style('bu')
            .size(size1, size1)
            .text(`PATIENT PRISE EN CHARGE`);

          const pecText = `${exonerant?.designation || ""} / ${facture?.taux_exoneration || exonerant?.taux} %`

          printer
            .control("CR")
            .font('a')
            .align("LT")
            .style('b')
            .size(size1, size1)
            .text(pecText);
        } else if (facture?.taux_reduction) {
          const redText = `${"Reduction"}: ${facture?.taux_reduction} %`

          printer
            .control("LF")
            .font('a')
            .align("LT")
            .style('b')
            .size(size1, size1)
            .text(redText);
        }

        printer
          .control("LF")
          .font('a')
          .align("LT")
          .style('b')
          .size(size1, size1)
          .text(`Agent de facturation: ${agent_facturation ?
            agent_facturation.firstName + " " + agent_facturation.lastName : ""}`);


        printer
          .control("LF")
          .control("LF")
          .font('b')
          .align("CT")
          .style('b')
          .size(1, 1)
          .text(`MERCI. BON RETABLISSEMENT !`);

        // printer
        //   .control("LF")
        //   .control("LF")
        //   .font('a')
        //   .align("CT")
        //   .style('b')
        //   .size(1, 1)
        //   .text(` `);

        printer.cut()
          .close();
      });

  })



  console.log("PRINTING DONE")
}
