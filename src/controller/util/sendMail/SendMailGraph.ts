class SendMailGraph {
  sendMail = async (
    access_token: string,
    correo: string,
    usuario: string,
    cadenaAleatoria: string
  ) => {
    const contenido =
      "<div>      <br>      <table align='center' cellpadding='0' cellspacing='0' width='600' border='0'>        <tbody>            <tr>              <td><img align='center' src='../../../assets/images/mail.png' width='600' height='120' alt=''></td>            </tr>            <tr style='background:#f5f5f5;border:1px solid #f5f5f5 !important;'>              <td style='padding:10px !important;'>                  <div style='background:#ffffff;padding:10px;border-radius:2px !important;font-size:14px;'>                    <p>Estimado/a <strong> " +
      usuario +
      ' </strong></p>                    <p>Reciba un cordial saludo de La 29 - Cooperativa de Ahorro y Crédito.  <br>                    Se ha registrado en el sistema de proveedores de la cooperativa<br><br>                    Se ha generado una clave para su acceso: <strong> ' +
      cadenaAleatoria +
      "</strong><br><br>                    Luego puede cambiar su clave en el sistema.<br><br>                    Gracias por su atención</p>                  </div>              </td>            </tr>            <tr style='background:rgba(249,249,249,1.00);border:1px solid #f5f5f5;'>              <td style='padding:10px !important;'>                  <divstyle='color:rgba(120,120,120,1.00);font-size:12px;'>                  <p align='center'> Para mayor información puede ingresar a 29Octubre a través de: <br><span><a rel='nofollow' target='_blank' href='http://personas1.29enlinea.fin.ec/'><strong> personas1.29enlinea.fin.ec </strong></a></span></p>              </td>            </tr>        </tbody>      </table>  </div>";

    var axios = require('axios');
    var data = JSON.stringify({
      message: {
        subject: 'Clave de acceso para proveedores',
        body: {
          contentType: 'HTML',
          content: contenido,
        },
        toRecipients: [{ emailAddress: { address: correo } }],
      },
    });

    var config = {
      method: 'post',
      url: 'https://graph.microsoft.com/v1.0/me/sendMail',
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    // el return es importante para retornar el resultado del axios
    return axios(config)
      .then(function (response) {
        //  console.log('aqui va JSON.stringify(response.data) ',JSON.stringify(response.error));
        return 'OK';
      })
      .catch(function (error) {
        //console.log('SendMailGraph', error);
        return error;
      });
  };
}
export default SendMailGraph;
