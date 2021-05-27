'use strict';

const DataLoader = require('dataloader');

class BasicConnector {
  constructor(ctx, model) {
    this.ctx = ctx;
    this.model = model;
    this.loader = new DataLoader(
      ids => this.fetch(ids)
    );
  }

  async fetch(ids) {
    return await this.ctx.model[this.model].find({
      _id: {
        $in: ids
      }
    });
  }

  fetchByIds(ids) {
    return this.loader.loadMany(ids);
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  async fetchBySelf(userId, option, condition) {
    if(userId) {
      return await this.ctx.model[this.model].find(
        this._getBasicQuery(userId, condition),
        null,
        option
      );
    }
  }

  async summary(userId, query, option) {
    if(userId) {
      const count = await this.ctx.model[this.model].countDocuments(
        { ...this._getBasicQuery(userId, null), ...query },
        option
      );

      return { count };
    }
  }

  _getBasicQuery(userId, condition) {
    let query = {
      isDeleted: { $ne: true }, // default condition
      isBlocked: { $ne: true }, // default condition
    }

    if(condition) {
      query = { ...query, ...this._convertCondition(condition) };
    }

    if(userId) {
      query['user'] = userId;
    }

    return query;
  }

  async add(input) {
    const result = await this.ctx.model[this.model].create(
      [ input ]
    );
    return result[0];
  }

  async update(id, input) {
    return await this.ctx.model[this.model].findByIdAndUpdate(
      { _id: id },
      input,
      { upsert: false, new: true, setDefaultsOnInsert: true }
    );
  }

  async delete(id) {
    return await this.ctx.model[this.model].findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { upsert: false, new: true, setDefaultsOnInsert: true }
    );
  }

  _convertCondition(condition) {
    return this.ctx.service.util.convertCondition(condition);
  }
}

module.exports = BasicConnector;

