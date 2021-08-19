import { DataSource } from 'apollo-datasource';
import ApollosConfig from '@apollosproject/config';

const https = require('https');

const { CLEARSTREAM } = ApollosConfig;

export default class clearstream extends DataSource {
  //

  async sendSms({ body, to, ...args }) {
    const data = JSON.stringify({
      to,
      text_header: 'Crossings Community Church',
      text_body: body,
    });

    const options = {
      hostname: 'api.getclearstream.com',
      port: 443,
      path: '/v1/texts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Api-Key': 'e7b25ece4f36884816efa3f7d9391d3f',
      },
    };
    return await this.doRequest(options, data);
  }

  doRequest(options, data) {
    return new Promise((resolve, reject) => {
      const req = https
        .request(options, (res) => {
          res.setEncoding('utf8');
          let responseBody = '';

          res.on('data', (chunk) => {
            responseBody += chunk;
          });

          res.on('end', () => {
            resolve(JSON.parse(responseBody));
          });
        })
        .on('error', (err) => {
          console.log('ERROR: ', err.message);
          reject(err);
        });

      req.write(data);

      req.end;
    });
  }
}
