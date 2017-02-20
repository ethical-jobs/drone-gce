const fs = require('fs');
const dot = require('dot');

/**
 * Returns parameters to prase a template with
 *
 * @param object environment
 * @return Object
 */
function getTemplateParams(environment) {
  let params = {
    drone: {},
    plugin: {},
    environment: {},
  };
  Object.keys(environment).forEach(key => {
    const pieces = key.split(/_(.+)/, 2);
    if (pieces[1] && ['PLUGIN', 'DRONE'].indexOf(pieces[0]) !== -1) {
      const varNamespace = pieces[0].toLowerCase();
      const varKey = pieces[1].toLowerCase();
      params[varNamespace][varKey] = environment[key];
    } else {
      params.environment[key] = environment[key];
    }
  });
  return params;
}

/**
 * Returns a valid parameterised kubernetes yaml
 *
 * @param string pathToTemplate
 * @param object params
 * @return String
 */
function processTemplate(pathToTemplate, params) {
  const templateFile = fs.readFileSync(pathToTemplate, 'utf8');
  const templateString = templateFile.toString();

  template = dot.template(templateString, {
    evaluate:    /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode:      /\{\{!([\s\S]+?)\}\}/g,
    use:         /\{\{#([\s\S]+?)\}\}/g,
    define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname: 'template',
    strip: false,
    append: true,
    selfcontained: false
  });

  return template(params);
}

module.exports = {
  getTemplateParams: getTemplateParams,
  processTemplate: processTemplate,
};
