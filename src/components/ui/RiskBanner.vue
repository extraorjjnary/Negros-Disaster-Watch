<script setup>
import { computed } from 'vue';

const props = defineProps({
  level: { type: String, default: 'safe' }, // safe | watch | warning | critical
});

const config = {
  safe: {
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    icon: '✅',
    label: 'ALL CLEAR',
    title: 'All Sensors Normal',
    desc: 'No significant hazard detected. All monitoring stations reporting normal values.',
    textCls: 'text-safe',
  },
  watch: {
    bg: 'bg-caution/10',
    border: 'border-caution/30',
    icon: '👁️',
    label: 'WATCH',
    title: 'Elevated Monitoring Active',
    desc: 'One or more sensors approaching threshold. PDRRMO teams on monitoring standby.',
    textCls: 'text-caution',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    icon: '⚠️',
    label: 'WARNING',
    title: 'Elevated Flood Risk — Northern Sector',
    desc: 'Heavy rainfall detected in Silay and Talisay. River levels rising. MDRRMO teams on standby.',
    textCls: 'text-warning',
  },
  critical: {
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    icon: '🚨',
    label: 'CRITICAL',
    title: 'CRITICAL — Immediate Action Required',
    desc: 'Flood imminent in riverside barangays. Evacuation order in effect for Talisay City Zone A.',
    textCls: 'text-danger',
    pulse: true,
  },
};

const cfg = computed(() => config[props.level] || config.safe);
const now = computed(() =>
  new Date().toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
);
</script>

<template>
  <div
    :class="[
      'flex flex-wrap items-center gap-4 rounded-xl p-4 border mb-6',
      cfg.bg,
      cfg.border,
      cfg.pulse ? 'risk-critical-pulse' : '',
    ]"
  >
    <span class="text-3xl">{{ cfg.icon }}</span>

    <div
      :class="[
        'font-cond font-bold text-2xl px-4 py-1.5 rounded-md',
        cfg.textCls,
        cfg.bg,
        'border',
        cfg.border,
      ]"
    >
      {{ cfg.label }}
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-[14px] font-semibold text-ink mb-0.5">{{ cfg.title }}</p>
      <p class="text-[12.5px] text-muted">{{ cfg.desc }}</p>
    </div>

    <div
      class="text-right text-[11px] text-muted font-mono-custom whitespace-nowrap"
    >
      Last updated<br />
      <span class="text-ink">{{ now }} PHT</span>
    </div>
  </div>
</template>
