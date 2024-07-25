const dns = require('dns');
const logger = require('./logger');

class WebFilter {
  constructor() {
    this.rules = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  filter(domain) {
    for (const rule of this.rules) {
      if (domain.includes(rule.pattern)) {
        return rule.type === 'allow';
      }
    }
    return true; // Allow by default
  }

  async resolveDomain(domain) {
    return new Promise((resolve, reject) => {
      dns.resolve(domain, (err, addresses) => {
        if (err) {
          logger.error('DNS resolution failed', { domain, error: err.message });
          reject(err);
        } else {
          logger.info('Domain resolved', { domain, addresses });
          resolve(addresses);
        }
      });
    });
  }
}

module.exports = new WebFilter();
