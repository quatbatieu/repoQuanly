import { useState , useEffect } from 'react';
import mqtt from 'mqtt';
import { useSelector } from 'react-redux';
import moment from 'moment';

function MqttClient() {
  const [client, setClient] = useState(null);

  const user = useSelector(state => state.member);

  const mqttConnect = (host, mqttOption) => {
    setClient(mqtt.connect(host, mqttOption));
  };

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        console.log('end')
      });
    }
  }

  const handleDisconnect = () => {
    mqttDisconnect();
  };

  const handleConnect = () => {
    let url = process.env.REACT_APP_API_WSS_URL

    if (window.location.protocol !== "https:") {
      url = process.env.REACT_APP_API_WS_URL
    }
    const clientId = `RECORD_UPDATE_${user.stationsId}_${moment().format("YYYY_MM_DD_hh_mm_ss")}`

    const options = {
      reconnectPeriod: 10000,
      rejectUnauthorized: false
    };
    options.clientId = clientId;

    mqttConnect(url, options);
  };

  useEffect(() => {
    if (user) {
      handleConnect()
    }
    return () => {
      handleDisconnect()
    }
  }, [user])

  return client;
}

export default MqttClient;