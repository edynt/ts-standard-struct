import { Kafka, Producer, Consumer } from 'kafkajs';

export class QueueHook {
  private static instance: QueueHook;
  private kafka: Kafka;
  private producer: Producer;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
  }

  public static getInstance(): QueueHook {
    if (!QueueHook.instance) {
      QueueHook.instance = new QueueHook();
    }
    return QueueHook.instance;
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
  }

  public async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  public async subscribe(topic: string, callback: (message: any) => Promise<void>): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'my-group' });
    await consumer.connect();
    await consumer.subscribe({ topic });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (value) {
          await callback(JSON.parse(value));
        }
      },
    });
  }
}

// Usage example:
// const queue = QueueHook.getInstance();