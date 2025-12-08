<template>
  <div class="card">
    <div class="card-header">
      <slot name="icon">
        <img v-if="icon" :src="icon" class="card-icon" />
      </slot>
      <h3>{{ title }}</h3>
    </div>
    <p class="subtitle">{{ subtitle }}</p>
    <p class="value">{{ description }}</p> <!-- usa .value pra bater com CSS -->
    <div class="card-actions" v-if="actions.length">
      <button
        v-for="action in actions"
        :key="action.label"
        @click="action.onClick"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: [String, Number], default: '' },
  icon: { type: String, default: '' },
  actions: { type: Array, default: () => [] }
})
</script>
<style>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  width: 200px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-icon {
  width: 24px;
  height: 24px;
}
.card-actions {
  margin-top: 12px;
}
</style>