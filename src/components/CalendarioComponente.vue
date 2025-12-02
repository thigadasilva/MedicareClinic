<template>
<vue-cal
locale="pt-BR"
:disable-views="['years', 'year', 'month', 'week', 'day', 'agenda']"
default-view="week"
:time-step="30"
:events="events"
:on-event-click="handleEventClickInternal"
class="vue-cal-green-theme"
/>
</template>

<script setup>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import 'vue-cal/themes/green.css';

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['event-clicked']);

const handleEventClickInternal = (event, domEvent) => {
  domEvent.stopPropagation();
  emit('event-clicked', event.id)
};

</script>
<style scoped>
.vue-cal-green-theme {
 height: 600px;
}

.status-green{background-color: #e0f2f1; border-color: #00796b;}
.status-green{background-color: #fffde7; border-color: #fbc02d;}
.status-red{background-color: #ffebee; border-color: #d32f2f;}
</style>