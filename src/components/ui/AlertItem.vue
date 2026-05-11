<script setup>
defineProps({
  alert: { type: Object, required: true },
  compact: { type: Boolean, default: false },
});
</script>

<template>
  <div :class="['alert-item', alert.sev]">
    <div
      :class="[
        'mt-1 w-2 h-2 rounded-full flex-shrink-0',
        alert.sev === 'critical'
          ? 'bg-danger status-dot'
          : alert.sev === 'warning'
            ? 'bg-warning'
            : alert.sev === 'watch'
              ? 'bg-caution'
              : 'bg-bright',
      ]"
    />
    <div class="flex-1 min-w-0">
      <p
        :class="[
          'text-[13px] font-semibold mb-0.5',
          alert.sev === 'critical'
            ? 'text-danger'
            : alert.sev === 'warning'
              ? 'text-warning'
              : alert.sev === 'watch'
                ? 'text-caution'
                : 'text-bright',
        ]"
      >
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
