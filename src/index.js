const plugin = require('./plugin');
const template = require('./template');

const serviceKeyString = process.env.GCE_KEY || process.env.PLUGIN_GCE_KEY || null;

if (! serviceKeyString) {
  console.log('Invalid key file, please provide a base64 encoded key file in the GCE_KEY environment variable or drone secret.')
  process.exit(1);
}

plugin.versions();

const serviceKey = plugin.decodeServiceKey(serviceKeyString);

const params = template.getTemplateParams(process.env);

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
  plugin.echoArtefact(artefact);
  plugin.applyArtefact(artefact, namespace);
});
