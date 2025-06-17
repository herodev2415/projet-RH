<!-- components/CardStat.vue -->
<template>
  <div class="cardstat" :style="{ backgroundColor: color }">
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [String, Number],
  color: String
})
</script>

<style scoped>
.cardstat {
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  width: 180px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
}
.cardstat:hover {
  transform: translateY(-5px);
}
h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}
p {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.4rem 0 0;
}
</style>
