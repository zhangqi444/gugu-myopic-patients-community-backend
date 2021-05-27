'use strict';

class ResolverHelper {

  getConnector(ctx, connectorName) {
    return ctx.connector[connectorName];
  }

  getModel(ctx, modelName) {
    return ctx.model[modelName];
  }

  fetchById(id, ctx, connectorName, modelName) {
    return ctx.connector[connectorName].fetchById(id);
  }
  
  /**
   * The helper function to support paganation of the list fetch. It gets the list of ids first and then relies on the graphQL
   * dataloader to fetch the exact list data.
   * @param  {} option
   * @param  {} condition
   * @param  {} ctx
   * @param  {} connectorName
   * @param  {} modelName
   */
  async fetchByIds(option, condition, ctx, connectorName, modelName) {
    const ids = await ctx.model[modelName].find(
      {
        ...this._convertCondition(condition),
      },
      '_id', 
      option
    );
    const indexes = ids.reduce(function(acc, id, index) {
      acc[id._id] = index;
      return acc;
    }, {});
  
    const result = [];
    const articles = await ctx.connector[connectorName].fetchByIds(ids);
    articles.forEach(article => {
      const index = indexes[article._id];
      result[index] = article;
    });
    return result;
  }

  fetchBySelf(userId, option, condition, ctx, connectorName) {
    return ctx.connector[connectorName].fetchBySelf(userId, option, condition);
  }

  add(input, ctx, connectorName) {
    return ctx.connector[connectorName].add(input);
  }

  update(id, input, ctx, connectorName,) {
    return ctx.connector[connectorName].update(id, input);
  }

  delete(id, input, ctx, connectorName) {
    return ctx.connector[connectorName].delete(id, input);
  }

  _convertCondition(condition) {
    var convertedProj = {};
    condition && Object.keys(condition).map(k => {
      convertedProj[k] = condition[k] || {$ne: true};
    });
    return convertedProj;
  }
}

module.exports = new ResolverHelper();

