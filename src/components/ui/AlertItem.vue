<script setup>
defineProps({
  alert: { type: Object, required: true },
  compact: { type: Boolean, default: false },
});
const sevText = {
  critical: 'text-danger',
  warning: 'text-warning',
  watch: 'text-caution',
  info: 'text-bright',
};
const dotColor = {
  critical: 'bg-danger status-dot',
  warning: 'bg-warning',
  watch: 'bg-caution',
  info: 'bg-bright',
};
</script>
<template>
  <div :class="['alert-item', alert.sev]">
    <div
      :class="['mt-1 w-2 h-2 rounded-full flex-shrink-0', dotColor[alert.sev]]"
    />
    <div class="flex-1 min-w-0">
      <p :class="['text-[13px] font-semibold mb-0.5', sevText[alert.sev]]">
        {{ alert.title }}
      </p>
      <p v-if="!compact" class="text-[11.5px] text-muted leading-relaxed">
        {{ alert.desc }}
      </p>
    </div>
    <p
      class="text-[10.5px] text-faint font-mono-custom whitespace-nowrap self-start"
    >
      {{ alert.time }}
    </p>
  </div>
</template>
