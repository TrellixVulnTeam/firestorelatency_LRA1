const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const fs = admin.firestore();

exports.createFakeItems = functions.https.onRequest((req, res) => {
  const createCount = 500;

  const batchDetail = fs.batch();
  const batch = fs.batch();
  for (step = 0; step < createCount; step++) {
    const refDetail = fs.collection('items-detailed').doc();
    const ref = fs.collection('items').doc();

    const light = {
      tagIDNumber: Math.random(),
      name: 'Doe, John',
      dateOfBirth: new Date(),
      expirationDate: new Date(),
      ref: refDetail
    }

    const detail = {
      createdDate: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'Server Import',
      modifiedDate: admin.firestore.FieldValue.serverTimestamp(),
      modifiedBy: 'Server Import',
      invoiceNumber: Math.random(),
      invoicePaymentMethod: 'PO',
      invoicePaymentDate: null,

      tagIDNumber: light.tagIDNumber,
      lastName: 'Doe',
      firstName: 'John',
      sex: 'Unknown',
      dateOfBirth: light.dateOfBirth,
      email: 'blank@blank.com',
      cellNumber: '123-123-1234',
      address: {
        street: '123 Main Street',
        city: 'Denver',
        state: 'CO',
        zip: '80111',
      },
      localAddress: {
        street: '123 Main Street',
        city: 'Denver',
        state: 'CO',
        zip: '80111',
      },
    };

    batchDetail.set(refDetail, detail);
    batch.set(ref, light);
  };

  return batchDetail.commit()
    .then(result => batch.commit())
    .then(result => {
      return res.send('Success! ' + createCount + ' Items Created.');
    })
    .catch(error => {
      console.error('Error importing to Firestore!', error);
      return res.status(500).send('Import Failed!');
    });
});
