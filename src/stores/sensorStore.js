import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SENSOR_STATIONS } from '@/data/seedData.js';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function jitter(v, range) {
  return +(v + (Math.random() - 0.5) * range).toFixed(2);
}

function deriveStatus(s) {
  const ratio = s.value / s.threshold;
  if (ratio >= 1.4) return 'Critical';
  if (ratio >= 0.9) return 'Warning';
  if (ratio >= 0.6) return 'Watch';
  return 'Normal';
}

export const useSensorStore = defineStore('sensors', () => {
  // Deep-clone seed so we can mutate
  const stations = ref(SENSOR_STATIONS.map((s) => ({ ...s })));

  // Overall risk level driven by worst sensor
  const riskLevel = computed(() => {
    const statusPriority = { Critical: 4, Warning: 3, Watch: 2, Normal: 1 };
    const max = Math.max(
      ...stations.value.map((s) => statusPriority[s.status] || 1),
    );
    if (max >= 4) return 'critical';
    if (max >= 3) return 'warning';
    if (max >= 2) return 'watch';
    return 'safe';
  });

  // Jitter configs per type
  const jitterMap = {
    Rainfall: { range: 6, min: 0, max: 100 },
    'Water Level': { range: 0.15, min: 0, max: 5 },
    Seismic: { range: 0.2, min: 0.1, max: 4 },
    'Storm Surge': { range: 0.08, min: 0, max: 3 },
    'SO₂ Flux': { range: 60, min: 100, max: 3000 },
    Rainfall2: { range: 4, min: 0, max: 80 },
  };

  function tick() {
    stations.value = stations.value.map((s) => {
      const cfg = jitterMap[s.type] || { range: 3, min: 0, max: 100 };
      const newVal = clamp(jitter(s.value, cfg.range), cfg.min, cfg.max);
      const updated = { ...s, value: newVal };
      updated.status = deriveStatus(updated);
      return updated;
    });
  }

  // Start interval
  const interval = setInterval(tick, 5000);
  function stop() {
    clearInterval(interval);
  }

  return { stations, riskLevel, stop };
});
