const substanceMappingAPI = {
  toJSON(response) {
    // why do this: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
    if (!response.ok) {
      const { statusText, status } = response;
      throw Error(statusText || status);
    }
    return response.json();
  },
  getSubstanceMetadata() {
    return fetch(
      window.location.origin + '/api/version/20.07.13/metadata'
    ).then(this.toJSON);
  },
  getSubstanceMapping() {
    return fetch(window.location.origin + '/api/substance_mapping').then(
      this.toJSON
    );
  },
  saveSubstanceMapping(bodyContent) {
    const url = window.location.origin + '/api/substance_mapping';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(bodyContent);
    return fetch(url, { method, headers, body }).then(this.toJSON);
  },
};

function getValidTarget(targets, value) {
  if (targets.find((target) => target.value === value)) return value;
  return 'Other';
}
