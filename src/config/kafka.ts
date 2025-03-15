import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'api-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

export default kafka;