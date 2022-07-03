"use strict";

const { Kafka } = require("kafkajs");

module.exports = class KafkaManager {
  static instance = null;
  static _producer = null;
  static _consumer = null;

  constructor(runAs = "producer") {
    console.info(`Starting Kafka as a ${runAs}`);
    console.info(`Connecting to Kafka on : ${process.env.KAFKA_BROKER_1_HOST}:${process.env.KAFKA_BROKER_1_PORT}`);
    this.kafkaConfig = {
      brokers: [
        `${process.env.KAFKA_BROKER_1_HOST}:${process.env.KAFKA_BROKER_1_PORT}`,
      ],
      sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
      ssl: true,
    };
    this.runAs = runAs;
    this.kafka = new Kafka(this.kafkaConfig);
    if (this.runAs === "producer") {
      this._producer = this.kafka.producer();
    }
    /*
     * TODO: Improve the consumer code {taru.garg}
     * The consumer groupID should come from the function args as well
     * but meh! Just leaving it as it is for now
     */ else {
      this._consumer = this.kafka.consumer({ groupId: "$GROUP_NAME" });
     }
    this.isConnectedProducer = false;
    this.isConnectedConsumer = false;
  }

  get producer() {
    return this._producer;
  }

  get consumer() {
    return this._consumer;
  }

  static getInstance(runAs = "producer") {
    if (!this.instance) {
      this.instance = new KafkaManager(runAs);
    }
    return this.instance;
  }

  async connect() {
    if (this.runAs === "producer") {
      await this._connectProducer();
    } else {
      await this._connectConsumer();
    }
  }

  async _connectProducer() {
    console.log("Checking if kafka producer is connected");
    try {
      if (!this.isConnectedProducer) {
        console.info("Kafka producer not connected");
        console.info("Connecting to kafka producer");
        await this._producer.connect();
      }
      this.isConnectedProducer = true;
    } catch (error) {
      console.log("Couldn't connect to Kafka");
      console.log(error);
    }
  }

  async  _connectConsumer() {
    console.log("Checking if kafka consumer is connected");
    try {
      if (!this.isConnectedConsumer) {
        console.info("Kafka consumer not connected");
        console.info("Connecting to kafka consumer");
        await this._consumer.connect();
      }
      this.isConnectedConsumer = true;
    } catch (error) {
      console.log("Couldn't connect to Kafka");
      console.log(error);
    }
  }
};
