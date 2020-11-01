class GetTokenGraph {
  getToken = async () => {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      client_id: 'ae5bc1a0-e73e-413d-b913-1dadc3649ccc',
      client_secret: 'VJTHVeQh0lnVKcOIo/Eb/ewz9k9VN_[5',
      username: 'lcoba@29deoctubre.fin.ec',
      password: '1NF0rm4t1c0!',
      grant_type: 'password',
      resource: 'https://graph.microsoft.com',
    });
    var config = {
      method: 'get',
      url:
        'https://login.microsoftonline.com/f8733e19-5615-4258-907e-cb8c982ffc34/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie:
          'x-ms-gateway-slice=prod; stsservicecookie=ests; fpc=AiBMUq1AJt1JtjD7JrvvuXNJFMDBAQAAAKkMr9YOAAAA',
      },
      data: data,
    };
    // el return es importante para retornar el resultado del axios
    return axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
        return response.data.access_token;
      })
      .catch(function (error) {
        //  console.log('Error GetTokenGraph', error);
        return error;
      });
  };
}

export default GetTokenGraph;
