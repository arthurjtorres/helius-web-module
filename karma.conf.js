// Cópia da configuração embutida do builder do Angular (que é descartada quando há karmaConfig),
// acrescida só do piso de cobertura (T21 item 5).
// Ao atualizar o @angular-devkit/build-angular, confira com getBuiltInKarmaConfig do builder.
const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: path.join(__dirname, 'coverage', 'helius-web-portal'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
      // piso medido em 2026-11-26, arredondado para baixo: só pode subir. Mede só o que entra no bundle de teste
      check: { global: { statements: 78, branches: 64, functions: 71, lines: 78 } },
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
  });
};
