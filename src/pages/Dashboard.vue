<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSensorStore } from '@/stores/sensorStore.js';
import { ACTIVE_ALERTS, PREDICTIONS } from '@/data/seedData.js';
import RiskBanner from '@/components/ui/RiskBanner.vue';
import SensorCard from '@/components/sensors/SensorCard.vue';
import AlertItem from '@/components/ui/AlertItem.vue';
import PredictionItem from '@/components/ui/PredictionItem.vue';

const sensor = useSensorStore();
const heroSensors = computed(() => sensor.stations.slice(0, 4));
const topPreds = PREDICTIONS.slice(0, 3);

let L, map;
const mapEl = ref(null);
const pinColors = {
  Critical: '#dc2626',
  Warning: '#ea580c',
  Watch: '#d97706',
  Normal: '#16a34a',
};

function buildPopup(s) {
  const col = pinColors[s.status] || '#16a34a';
  return `<div style="min-width:180px">
    <p style="font-weight:700;font-size:13px;margin-bottom:4px;color:#e8eeff">${s.name}</p>
    <p style="font-size:11px;color:#8ba0c8;margin-bottom:6px">📍 ${s.muni}</p>
    <p style="font-family:monospace;font-size:16px;color:${col};font-weight:600">${typeof s.value === 'number' ? s.value.toFixed(1) : s.value} <span style="font-size:11px;color:#8ba0c8">${s.unit}</span></p>
    <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;color:${col};background:${col}22;border:1px solid ${col}44">${s.status}</span>
  </div>`;
}

onMounted(async () => {
  L = (await import('leaflet')).default;
  map = L.map(mapEl.value, {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([10.5, 122.95], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);
  sensor.stations.forEach((s) => {
    const col = pinColors[s.status] || '#16a34a';
    const svgPin = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="34" viewBox="0 0 28 34">
      <circle cx="14" cy="14" r="13" fill="${col}" fill-opacity="0.2" stroke="${col}" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="7" fill="${col}"/>
      <line x1="14" y1="27" x2="14" y2="33" stroke="${col}" stroke-width="2"/>
    </svg>`;
    const icon = L.divIcon({
      html: svgPin,
      iconSize: [28, 34],
      iconAnchor: [14, 33],
      className: '',
    });
    L.marker([s.lat, s.lng], { icon })
      .addTo(map)
      .bindPopup(buildPopup(s), { maxWidth: 220 });
  });
});
onUnmounted(() => {
  if (map) map.remove();
});
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="font-cond font-bold text-2xl text-ink mb-0.5">
        Operations Dashboard
      </h1>
      <p class="text-[13px] text-muted">
        Real-time disaster monitoring — Negros Occidental · Updated every 5s
      </p>
    </div>

    <RiskBanner :level="sensor.riskLevel" />

    <div class="flex items-center justify-between mb-3">
      <div>
        <h2
          class="font-cond font-bold text-[16px] text-ink flex items-center gap-2"
        >
          Live Sensor Network
          <span class="live-badge"
            ><span class="status-dot bg-danger" />LIVE</span
          >
        </h2>
        <p class="text-[11.5px] text-muted">
          42 active IoT nodes across Negros Occidental
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <SensorCard v-for="s in heroSensors" :key="s.id" :sensor="s" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <h2
          class="font-cond font-bold text-[16px] text-ink mb-3 flex items-center gap-2"
        >
          📍 Sensor Network Map
          <span class="text-[11px] text-faint font-sans font-normal"
            >Negros Occidental</span
          >
        </h2>
        <div class="dash-card p-0 overflow-hidden rounded-xl">
          <div ref="mapEl" class="w-full h-[340px] rounded-xl" />
        </div>
        <div class="flex gap-4 mt-2 flex-wrap">
          <div
            v-for="[lbl, col] in [
              ['Critical', '#dc2626'],
              ['Warning', '#ea580c'],
              ['Watch', '#d97706'],
              ['Normal', '#16a34a'],
            ]"
            :key="lbl"
            class="flex items-center gap-1.5 text-[11px] text-muted"
          >
            <span
              class="w-2.5 h-2.5 rounded-full"
              :style="{ background: col }"
            />{{ lbl }}
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-cond font-bold text-[16px] text-ink mb-3">
          🤖 AI Predictions (Next 24h)
        </h2>
        <PredictionItem v-for="p in topPreds" :key="p.type" :pred="p" />
        <div class="flex items-center justify-between mt-4 mb-3">
          <h2 class="font-cond font-bold text-[16px] text-ink">
            🔔 Active Alerts
          </h2>
          <router-link
            to="/alerts"
            class="text-[12px] text-bright hover:underline"
            >View All →</router-link
          >
        </div>
        <AlertItem v-for="a in ACTIVE_ALERTS" :key="a.title" :alert="a" />
      </div>
    </div>
  </div>
</template>
