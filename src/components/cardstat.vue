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

<style>
.cardstat {
  padding: 1rem;
  border-radius: 8px;
  color: white;
  width: 150px;
  text-align: center;
}
</style>