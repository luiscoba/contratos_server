class Util {
  // sacado de https://usefulangle.com/post/187/nodejs-get-date-time
  static fechaActual = () => {
    // current timestamp in milliseconds
    let ts = Date.now();
    let date_ob = new Date(ts);
    let day = date_ob.getDate() + 1;
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    // prints date & time in YYYY-MM-DD format
    //console.log(year + '-' + month + '-' + day);
    return year + '-' + month + '-' + day;
  };

  static fechaYhoraActual = (horasVencimiento: number) => {
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ('0' + date_ob.getDate()).slice(-2);
    // current month
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    hours = hours + horasVencimiento;
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();

    return (
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    );
  };

  // Generamos una cadena aleatoria  https://www.it-swarm-es.tech/es/javascript/generar-cadenascaracteres-aleatorios-en-javascript/967048592/
  static cadenaAleatoria = (length) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}

export default Util;
