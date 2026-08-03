<template></template>

<script>
export default {
  name: 'CNavRedirect',
  mounted() {
    const pathname = window.location.pathname;
    const page = pathname.replace(/^\/+/, '');
    window.location.href = '/pages/' + page + '.html';
  },
};
</script>
