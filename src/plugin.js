const fs = require('fs');
const shell = require('shelljs');
const Base64 = require('js-base64').Base64;

/**
 * Decodes a base64 encoded service key
 *
 * @param string key
 * @return Object
 */
function decodeServiceKey(key) {
	return JSON.parse(Base64.decode(key));
}

/**
 * Authorises service account with gcloud cli
 *
 * @param string pathToKey
 * @param string serviceAccountEmail
 * @param string projectName
 * @return Bool
 */
function authorizeServiceAccount(pathToKey, serviceAccountEmail, projectName) {
  const cmd = `
    gcloud auth activate-service-account \
      ${serviceAccountEmail} \
      --key-file ${pathToKey} \
      --project ${projectName}
  `;
  shell.echo(cmd);
  return shell.exec(cmd).code == 0;
}

/**
 * Sets the working cluster through gcloud cli
 *
 * @param string cluster
 * @param string zone
 * @return Bool
 */
function setCluster(cluster, zone) {
  const cmd = `
    gcloud container clusters get-credentials ${cluster} --zone ${zone}
  `;
  shell.echo(cmd);
  return shell.exec(cmd).code == 0;
}

/**
 * Executes a kubernetes template file on the cluster
 *
 * @param string pathToArtefact
 * @param string namespace
 * @return Bool
 */
function applyArtefact(pathToArtefact, namespace = '') {
  const namespaceArg = namespace ? `--namespace=${namespace}` : '';
  const cmd = `
    kubectl apply -f ${pathToArtefact} --record ${namespaceArg}
  `;
  shell.echo(cmd);
  return shell.exec(cmd).code == 0;
}

/**
 * writes a file to disk
 *
 * @param string pathToFile
 * @param string fileString
 * @return Bool
 */
function writeFile(pathToFile, fileString) {
  return fs.writeFileSync(pathToFile, fileString);
}

module.exports = {
  decodeServiceKey: decodeServiceKey,
  writeFile: writeFile,
  authorizeServiceAccount: authorizeServiceAccount,
  setCluster: setCluster,
  applyArtefact: applyArtefact,
};
