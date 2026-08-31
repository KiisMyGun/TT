<template>
  <span class="brand-wordmark" :aria-label="name">
    <template v-if="isSuperTT">
      <span class="brand-wordmark__super" aria-hidden="true">super</span>
      <span class="brand-wordmark__tt" aria-hidden="true">TT</span>
    </template>
    <span v-else>{{ name }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
}>()

const isSuperTT = computed(() => props.name.trim().toLowerCase() === 'supertt')
</script>

<style scoped>
.brand-wordmark {
  display: inline-flex;
  align-items: baseline;
  line-height: 1;
  white-space: nowrap;
}

.brand-wordmark__super {
  margin-right: 0.08em;
  font-size: 0.58em;
  font-weight: 720;
  letter-spacing: 0.035em;
}

.brand-wordmark__tt {
  font-size: 1.14em;
  font-weight: 900;
  letter-spacing: -0.055em;
}
</style>
