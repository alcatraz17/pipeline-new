const express = require('express');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const moment = require('moment');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const influxDB = new InfluxDB({ url: process.env.INFLUXDB_URL, token: process.env.INFLUXDB_TOKEN });
const writeApi = influxDB.getWriteApi(process.env.INFLUXDB_ORG, process.env.INFLUXDB_DB);

app.post('/data', async (req, res) => {
  try {
    const data = req.body;
    const point = new Point('iot_data')
      .timestamp(moment(data.date).valueOf() * 1_000_000)
      .tag('systemId', data.systemId)
      .floatField('pcuSwitchState', data.pcuSwitchState)
      .floatField('mainsState', data.mainsState)
      .floatField('inputVoltage', data.inputVoltage)
      .floatField('inputFrequency', data.inputFrequency)
      .floatField('outputVoltage', data.outputVoltage)
      .floatField('outputFrequency', data.outputFrequency)
      .floatField('batteryVoltage', data.batteryVoltage)
      .floatField('load', data.load)
      .floatField('upsMode', data.upsMode)
      .floatField('gridCharge', data.gridCharge)
      .floatField('chargingMode', data.chargingMode)
      .floatField('chargingStatus', data.chargingStatus)
      .floatField('loadStatus', data.loadStatus)
      .floatField('warningProtectionCode', data.warningProtectionCode)
      .floatField('sdCardError', data.sdCardError)
      .floatField('signalStrength', data.signalStrength)
      .floatField('outputCurrent', data.outputCurrent);

    await writeApi.writePoint(point);
    await writeApi.close();

    res.status(200).send('Data written successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error writing data');
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
