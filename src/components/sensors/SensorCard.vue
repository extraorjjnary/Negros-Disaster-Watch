<script setup>
import { computed } from 'vue';

const props = defineProps({
  sensor: { type: Object, required: true },
});

const statusConfig = {
  Critical: {
    cls: 'sensor-critical',
    dotCls: 'bg-danger',
    textCls: 'text-danger',
    barCls: 'bg-danger',
    label: 'CRITICAL',
  },
  Warning: {
    cls: 'sensor-warning',
    dotCls: 'bg-warning',
    textCls: 'text-warning',
    barCls: 'bg-warning',
    label: 'WARNING',
  },
  Watch: {
    cls: 'sensor-watch',
    dotCls: 'bg-caution',
    textCls: 'text-caution',
    barCls: 'bg-caution',
    label: 'WATCH',
  },
  Normal: {
    cls: 'sensor-normal',
    dotCls: 'bg-safe',
    textCls: 'text-safe',
    barCls: 'bg-safe',
    label: 'NORMAL',
  },
};

const typeIcon = {
  Rainfall: '🌧️',
  'Water Level': '🌊',
  Seismic: '⚡',
  'Storm Surge': '🌊',
  'SO₂ Flux': '🌫️',
};

const cfg = computed(
  () => statusConfig[props.sensor.status] || statusConfig.Normal,
);
const pct = computed(() =>
  Math.min(100, (props.sensor.value / props.sensor.threshold) * 85),
);
const displayVal = computed(() => {
  const v = props.sensor.value;
  return Number.isInteger(v) ? v : v.toFixed(1);
});
</script>

<template>
  <div :class="['dash-card border', cfg.cls, 'transition-colors duration-500']">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <span class="text-2xl">{{ typeIcon[sensor.type] || '📡' }}</span>
      <span class="font-mono-custom text-[10px] text-faint">{{
        sensor.id
      }}</span>
    </div>

    <!-- Label & location -->
    <p
      class="text-[11px] font-semibold uppercase tracking-[0.8px] text-muted mb-0.5"
    >
      {{ sensor.type }}
    </p>
    <p class="text-[11px] text-faint italic mb-2">📍 {{ sensor.muni }}</p>

    <!-- Value -->
    <p
      :class="[
        'font-mono-custom text-3xl font-medium leading-none mb-1',
        cfg.textCls,
      ]"
    >
      {{ displayVal }}
    </p>
    <p class="text-[12px] text-muted mb-3">{{ sensor.unit }}</p>

    <!-- Status badge -->
    <div
      :class="[
        'inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded',
        cfg.textCls,
        'bg-current/10',
      ]"
    >
      <span :class="['status-dot', cfg.dotCls]" />
      {{ cfg.label }}
    </div>

    <!-- Mini bar -->
    <div class="mini-bar">
      <div
        :class="['mini-bar-fill', cfg.barCls]"
        :style="{ width: pct + '%' }"
      />
    </div>
    <p class="text-[10px] text-faint mt-1.5">
      Threshold: {{ sensor.threshold }} {{ sensor.unit }}
    </p>
  </div>
</template>
