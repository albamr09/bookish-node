const { Message } = require('../models/index')

const getStatus = async (_, res) => {
  return res.status(200).send(Message.M001.value)
}

module.exports = { getStatus }
