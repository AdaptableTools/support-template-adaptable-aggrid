module.exports = {
  webpack: {
    configure: (config) => {
      // Fix ESM resolution for @adaptabletools/adaptable
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
      // Disable CSS minimizer - incompatible with adaptable/infinite-table CSS (calc, infinity)
      config.optimization.minimizer = config.optimization.minimizer.filter(
        (plugin) => plugin.constructor.name !== 'CssMinimizerPlugin'
      );
      // Suppress source-map warnings from node_modules (adaptable has broken source maps)
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { module: /node_modules\/@adaptabletools/ },
        /Failed to parse source map/,
      ];
      return config;
    },
  },
};
