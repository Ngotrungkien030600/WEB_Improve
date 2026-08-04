<template>
  <RouterView />
  <MotivationPopup />
</template>

<script>
import MotivationPopup from './components/MotivationPopup.vue';

export default {
  name: 'App',
  components: { MotivationPopup },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  background: #08080e;
}
</style>
