<script setup>
import { computed } from 'vue';

const props = defineProps({
  pred: { type: Object, required: true },
  showAction: { type: Boolean, default: false },
});

const sevCfg = {
  critical: {
    textCls: 'text-danger',
    barCls: 'bg-danger',
    badge: 'badge-critical',
  },
  high: { textCls: 'text-warning', barCls: 'bg-warning', badge: 'badge-high' },
  moderate: {
    textCls: 'text-caution',
    barCls: 'bg-caution',
    badge: 'badge-moderate',
  },
  low: { textCls: 'text-safe', barCls: 'bg-safe', badge: 'badge-low' },
};

const cfg = computed(() => sevCfg[props.pred.sev] || sevCfg.low);
</script>

<template>
  <div
    class="dash-card mb-2.5 flex items-center gap-4 hover:border-border-light transition-colors"
  >
    <!-- Probability -->
    <div class="min-w-[56px] text-right flex-shrink-0">
      <p :class="['font-mono-custom text-2xl font-medium', cfg.textCls]">
        {{ pred.prob }}%
      </p>
      <p class="text-[9px] text-faint">probability</p>
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap mb-1">
        <p class="text-[13px] font-semibold text-ink">{{ pred.type }}</p>
        <span :class="cfg.badge">{{ pred.sev }}</span>
      </div>
      <p class="text-[11.5px] text-muted">📍 {{ pred.area }}</p>
      <p class="text-[11.5px] text-faint">⏱ {{ pred.timeframe }}</p>
      <div class="mini-bar mt-2">
        <div
          :class="['mini-bar-fill', cfg.barCls]"
          :style="{ width: pred.prob + '%' }"
        />
      </div>
    </div>
  </div>

  <!-- Recommended action (optional) -->
  <div v-if="showAction" class="dash-card mb-3 flex gap-3 items-start">
    <span class="text-base mt-0.5">📌</span>
    <div>
      <p :class="['text-[12px] font-semibold mb-1', cfg.textCls]">
        {{ pred.type }} — Recommended Action
      </p>
      <p class="text-[12px] text-muted leading-relaxed">{{ pred.action }}</p>
    </div>
  </div>
</template>
