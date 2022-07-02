"use strict";

const { Kafka } = require("kafkajs");

module.exports = class KafkaManager {
  static instance = null;
  static _producer = null;

  constructor() {
    console.info("Connecting to Kafka on : ");
    console.info(
      `${process.env.KAFKA_BROKER_1_HOST}:${process.env.KAFKA_BROKER_1_PORT}`
    );
    this.kafkaConfig = {
      brokers: [`${process.env.KAFKA_BROKER_1_HOST}:${process.env.KAFKA_BROKER_1_PORT}`],
      sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
      ssl: true,
    };

    this.kafka = new Kafka(this.kafkaConfig);
    this._producer = this.kafka.producer();
    this.isConnected = false;
  }

  static get producer() {
    return this._producer;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new KafkaManager();
    }
    return this.instance;
  }

  async connect() {
    console.log("Checking if kafka producer is connected");
    try {
      if (!this.isConnected) {
        console.warn("Kafka producer not connected");
        console.log("Connecting to kafka producer");
        await this._producer.connect();
      }
      this.isConnected = true;
    } catch (error) {
      console.log(error);
    }
  }

  async send(topic, messages) {
    try {
      await this.connect();
      const result = await this._producer.send({
        topic,
        messages: messages,
      });
    } catch (error) {
      console.log(error);
    }
  }
};
