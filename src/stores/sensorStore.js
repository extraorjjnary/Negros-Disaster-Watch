import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SENSOR_STATIONS } from '@/data/seedData.js';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function jitter(v, range) {
  return +(v + (Math.random() - 0.5) * range).toFixed(2);
}

function deriveStatus(value, threshold) {
  const r = value / threshold;
  if (r >= 1.4) return 'Critical';
  if (r >= 0.95) return 'Warning';
  if (r >= 0.65) return 'Watch';
  return 'Normal';
}

// Per-type jitter config
const JITTER = {
  Rainfall: { range: 7, min: 0, max: 110 },
  'Water Level': { range: 0.18, min: 0, max: 5.5 },
  Seismic: { range: 0.22, min: 0.1, max: 4.2 },
  'Storm Surge': { range: 0.09, min: 0, max: 3 },
  'SO₂ Flux': { range: 70, min: 80, max: 3200 },
};

export const useSensorStore = defineStore('sensors', () => {
  const stations = ref(SENSOR_STATIONS.map((s) => ({ ...s })));

  // Overall risk driven by worst sensor — lowercase to match RiskBanner props
  const riskLevel = computed(() => {
    const priority = { Critical: 4, Warning: 3, Watch: 2, Normal: 1 };
    const max = Math.max(...stations.value.map((s) => priority[s.status] ?? 1));
    if (max >= 4) return 'critical';
    if (max >= 3) return 'warning';
    if (max >= 2) return 'watch';
    return 'safe';
  });

  // Called every 5 s from DashboardLayout's setInterval
  function tick() {
    stations.value = stations.value.map((s) => {
      const cfg = JITTER[s.type] ?? { range: 4, min: 0, max: 80 };
      const newVal = clamp(jitter(s.value, cfg.range), cfg.min, cfg.max);
      return { ...s, value: newVal, status: deriveStatus(newVal, s.threshold) };
    });
  }

  return { stations, riskLevel, tick };
});
