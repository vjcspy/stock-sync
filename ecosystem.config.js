module.exports = {
  apps: [{
    name: 'sync-price-worker',
    script: './build/src/index.js',
    instances : "max",
    exec_mode : "cluster"
  }],
};
