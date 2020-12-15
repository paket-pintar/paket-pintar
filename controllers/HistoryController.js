const { History } = require('../models')

class HistoryController {
  static async getAllHistory (req, res, next) {
    let histories = null
    let options = {
      order: [
        ['id', 'DESC']
      ]
    }
    try {
      histories = await History.findAll(options)
      res.status(200).json(histories)
    } catch (err) {
      next(err)
    }
  }

  static async getHistoryById (req, res, next) {
    const historyId = req.params.id
    try {
      if (isNaN(+historyId)) {
        throw { msg: 'history ID is not valid!', status: 400 }
      } else {
        const history = await History.findByPk(historyId)
        if (!history) {
          throw { msg: 'history not found!', status: 404 }
        } else {
          res.status(200).json(history)
        }
      }
    } catch (err) {
      next(err)
    }
  }

}

module.exports = HistoryController