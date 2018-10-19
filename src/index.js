const plugin = require('./plugin');
const template = require('./template');

if (! process.env.GCE_KEY) {
  console.log('Invalid key file, please provide a base64 encoded key file in the GCE_KEY environment variable.')
  process.exit(1);
}

const params = template.getTemplateParams(process.env);

const serviceKey = plugin.decodeServiceKey(process.env.GCE_KEY);

const artefacts = process.env.PLUGIN_ARTEFACTS.split(',');

const namespace = process.env.PLUGIN_NAMESPACE || '';

// Authorise and set cluster

plugin.writeFile('./service-account-key.json', JSON.stringify(serviceKey));

plugin.authorizeServiceAccount('./service-account-key.json', serviceKey.client_email, serviceKey.project_id);

plugin.setCluster(params.plugin.cluster, params.plugin.zone);

// Process and apply artefacts

artefacts.forEach(function (artefact) {
  const templateString = template.processTemplate(artefact, params);
  plugin.writeFile(artefact, templateString);
  plugin.applyArtefact(artefact, namespace);
});
