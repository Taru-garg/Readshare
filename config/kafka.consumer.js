"use strict";

/*
*
* TODO: {taru.garg} Write code for processing E-Mail verification requests 
* We currently use kafka for consuming messages and thus processing those
* messages only for the purpose of sending E-mail invites for joining the team.
* However, eventually it will be used for sending E-mail verification invites when
* a user registers for the first time.
*
*/
const KafkaManager = require("kafka");

