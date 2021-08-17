const nacl = require('../nacl');
nacl.util = require('tweetnacl-util');
module.exports = {
    key: 'send',
    noun: 'Transaction',
    display: {
      label: 'Create Transaction',
      description: 'Creates a new Transaction.'
    },
    operation: {
      inputFields: [
        {key: 'Publickey', required: true, type: 'string', helpText: 'Which PublicKey to use'},
        {key: 'PrivateKey', required: true, type: 'string', helpText: 'Which PrivateKey to use'},
        {key: 'Target', required: true, type: 'string', label: 'Where do you want to send it ?'},
        {key: 'Amount', required: false, type: 'number', helpText: 'How much do you want to send ?'},
        {key: 'UserData', required: false, type: 'string', helpText: 'What data needs to be stored ?'},
      ],
      perform: (z, bundle) => {
        const promise = z.request({
          url: 'http://apinode.credits.com/api/transaction/pack',
          method: 'POST',
          body: JSON.stringify({
            authKey: "",
            MethodApi: "TransferCs",
            PublicKey: bundle.inputData.Publickey,
            ReceiverPublicKey: bundle.inputData.Target,
            NetworkAlias: "Testnet",
            Amount: bundle.inputData.Amount,
            Fee: 1.0,
            UserData: bundle.inputData.UserData
          }),
          headers: {
            'Content-type': 'application/json'
            , 'Accept': 'application/json'
            , 'Content-Encoding': 'utf-8'
          }
        });
        var q = "";
        return promise.then((response) => {
          var keydata = from_b58(bundle.inputData.PrivateKey);
          var transactionpack = from_b58(response.data.dataResponse.transactionPackagedStr)
          z.console.log("Here")
          var signed = nacl.sign.detached(transactionpack, keydata);
          var sign_b58 = to_b58(signed);
          
          const promise2 = z.request({
            url: 'http://apinode.credits.com/api/transaction/execute',
            method: 'POST',
            body: JSON.stringify({
              authKey: "",
              MethodApi: "TransferCs",
              PublicKey: bundle.inputData.Publickey,
              ReceiverPublicKey: bundle.inputData.Target,
              NetworkAlias: "Testnet",
              Amount: bundle.inputData.Amount,
              Fee: 1.0,
              UserData: bundle.inputData.UserData,
              TransactionSignature : sign_b58
            }),
            headers: {
              'Content-type': 'application/json'
              , 'Accept': 'application/json'
              , 'Content-Encoding': 'utf-8'
            }
          });
          return promise2.then((response) => response.data);
        });
        
        
      
        
        //
      },
      sample: {
        id: 55445,
        createdAt: 1472069465,
        publickey: '6WTWncHTBCrv6foypFNS7gdPX6avd8bMC1i6QGpxq9wx',
        status: "success",
        userdata: 'some json data',
        style: ''
      },
      outputFields: [
        {key: 'id', label: 'ID'},
        {key: 'createdAt', label: 'Created At'},
        {key: 'publickey', label: 'PublicKey'},
        {key: 'status', label: 'Status'},
        {key: 'userdata', label: 'User Data'},
        {key: 'style', label: 'Style'}
      ]
    }
  };

  function to_b58(
    B,            //Uint8Array raw byte input
) {
    var A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var d = [],   //the array for storing the stream of base58 digits
        s = "",   //the result string variable that will be returned
        i,        //the iterator variable for the byte input
        j,        //the iterator variable for the base58 digit array (d)
        c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
        n;        //a temporary placeholder variable for the current base58 digit
    for(i in B) { //loop through each byte in the input stream
        j = 0,                           //reset the base58 digit iterator
        c = B[i];                        //set the initial carry amount equal to the current byte amount
        s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
        while(j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
            n = d[j];                    //set the placeholder for the current base58 digit
            n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
            c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
            d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
            j++                          //iterate to the next base58 digit
        }
    }
    while(j--)        //since the base58 digits are backwards, loop through them in reverse order
        s += A[d[j]]; //lookup the character associated with each base58 digit
    return s          //return the final base58 string
}


function from_b58(
    S,            //Base58 encoded string input
) {
    var A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var d = [],   //the array for storing the stream of decoded bytes
        b = [],   //the result byte array that will be returned
        i,        //the iterator variable for the base58 string
        j,        //the iterator variable for the byte array (d)
        c,        //the carry amount variable that is used to overflow from the current byte to the next byte
        n;        //a temporary placeholder variable for the current byte
    for(i in S) { //loop through each base58 character in the input string
        j = 0,                             //reset the byte iterator
        c = A.indexOf( S[i] );             //set the initial carry amount equal to the current base58 digit
        if(c < 0)                          //see if the base58 digit lookup is invalid (-1)
            return undefined;              //if invalid base58 digit, bail out and return undefined
        c || b.length ^ i ? i : b.push(0); //prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
        while(j in d || c) {               //start looping through the bytes until there are no more bytes and no carry amount
            n = d[j];                      //set the placeholder for the current byte
            n = n ? n * 58 + c : c;        //shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
            c = n >> 8;                    //find the new carry amount (1-byte shift of current byte value)
            d[j] = n % 256;                //reset the current byte to the remainder (the carry amount will pass on the overflow)
            j++                            //iterate to the next byte
        }
    }
    while(j--)               //since the byte array is backwards, loop through it in reverse order
        b.push( d[j] );      //append each byte to the result
    return new Uint8Array(b) //return the final byte array in Uint8Array format
}