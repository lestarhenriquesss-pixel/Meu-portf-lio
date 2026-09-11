/* Small pure helpers, shared by the browser and the dependency-free tests. */
(function (root, factory) {
  const helpers = factory();
  if (typeof module === 'object' && module.exports) module.exports = helpers;
  else root.PortfolioCatalog = helpers;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function normalizeSearch(value) {
    return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function filterProjects(projects, category = 'todos', query = '') {
    const terms = normalizeSearch(query).split(' ').filter(Boolean);
    return projects.filter(project => {
      if (category !== 'todos' && project.category !== category) return false;
      const searchable = normalizeSearch([project.title, project.client, project.description, project.categoryLabel, ...(project.labels || []), ...(project.tags || [])].join(' '));
      return terms.every(term => searchable.includes(term));
    });
  }
  return Object.freeze({ normalizeSearch, filterProjects });
});
