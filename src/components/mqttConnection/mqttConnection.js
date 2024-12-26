import React, { useEffect } from 'react';
import mqttClient from 'hooks/MqttClient';
import { useDispatch } from 'react-redux';
import { addMessage , setClient } from 'actions/mqtt';

function MqttConnection() {
  const client = mqttClient();
  const dispatch = useDispatch();

  useEffect(() => {
    if (client) {

      dispatch(setClient(client));
      client.on('connect', () => {
        console.log('connect', 3242)
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        console.log('Reconnecting')
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        const newData = JSON.parse(`${payload.message}`);
        dispatch(addMessage({
          ...newData ,
          topic : payload.topic
        }));
      })

      mqttSub({
        topic: `#`, qos: 2
      })

    }
    return () => {
      mqttUnSub({
        topic: `#`
      })
    }
  }, [client])

  const mqttUnSub = (subscription) => {
    if (client) {
      const { topic } = subscription;
      client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
          return
        }

      });
    }
  };

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;

      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
      });
    }
  };

  return (
    <div>
    </div>
  );
}

export default MqttConnection;