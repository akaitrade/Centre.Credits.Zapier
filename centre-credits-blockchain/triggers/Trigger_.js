const GetData = (z, bundle) => {
    // `z.console.log()` is similar to `console.log()`.
    z.console.log('console says hello world!');
  
    const params = {};
    if (bundle.inputData.style) {
      params.style = bundle.inputData.style;
    }
    const requestOptions = {
      url: '',
      params: params
    };
    return z.request(requestOptions)
      .then((response) => z.JSON.parse(response.content));
  };
  module.exports = {
    key: 'Trigger_',
    noun: 'Trigger_',
    display: {
      label: '',
      description: 'Trigger when Transaction is sended'
    },
    operation: {
      inputFields: [
        {key: 'PublicKey', type: 'string',  helpText: 'Which PublicKey to use'},
        {key: 'PrivateKey', type: 'string',  helpText: 'Which PrivateKey to use'},
        {key: 'Target', type: 'string',  helpText: 'Where do you want to send it ?'},
        {key: 'Amount', type: 'string',  helpText: 'How much do you want to send ?'}
      ],
  
      perform: GetData,
      sample: {
        id: 1,
        createdAt: 1472069465,
        name: '',
        authorId: 1,
        directions: '',
        style: ''
      },
  
      outputFields: [
        {key: 'id', label: 'ID'},
        {key: 'createdAt', label: 'Created At'},
        {key: 'name', label: 'Name'},
        {key: 'directions', label: 'Directions'},
        {key: 'authorId', label: 'Author ID'},
        {key: 'style', label: 'Style'}
      ]
    },
  
  };