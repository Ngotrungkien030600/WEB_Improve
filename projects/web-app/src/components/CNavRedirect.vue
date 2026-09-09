<template></template>

<script>
import { legacyFileToRoute } from '../utils/legacy-redirect.js';

export default {
  name: 'CNavRedirect',
  mounted() {
    const route = legacyFileToRoute(window.location.pathname) || '/';
    if (route !== window.location.pathname) {
      window.location.replace(route);
    }
  },
};
</script>
