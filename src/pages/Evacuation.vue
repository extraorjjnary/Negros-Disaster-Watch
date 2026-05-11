<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EVAC_CENTERS, EMERGENCY_CONTACTS } from '@/data/seedData.js';

// Leaflet map for evac centers
let L, map;
const mapEl = ref(null);

const statusColor = {
  Active: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    bar: 'bg-warning',
  },
  'Near Full': {
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    text: 'text-danger',
    bar: 'bg-danger',
  },
  Standby: {
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    text: 'text-safe',
    bar: 'bg-safe',
  },
  Reserved: {
    bg: 'bg-faint/10',
    border: 'border-faint/30',
    text: 'text-muted',
    bar: 'bg-faint',
  },
};

onMounted(async () => {
  L = (await import('leaflet')).default;
  map = L.map(mapEl.value, {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView([10.55, 122.95], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  EVAC_CENTERS.forEach((c) => {
    const col =
      c.status === 'Near Full'
        ? '#dc2626'
        : c.status === 'Active'
          ? '#ea580c'
          : '#16a34a';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <rect x="2" y="2" width="24" height="24" rx="6" fill="${col}" fill-opacity="0.2" stroke="${col}" stroke-width="1.5"/>
      <text x="14" y="19" text-anchor="middle" font-size="14">🏫</text>
    </svg>`;
    const icon = L.divIcon({
      html: svg,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      className: '',
    });
    const pct = c.cap > 0 ? Math.round((c.current / c.cap) * 100) : 0;
    L.marker([c.lat, c.lng], { icon })
      .addTo(map)
      .bindPopup(
        `<div style="min-width:180px">
        <p style="font-weight:700;font-size:13px;margin-bottom:3px;color:#e8eeff">${c.name}</p>
        <p style="font-size:11px;color:#8ba0c8;margin-bottom:6px">📍 ${c.muni}</p>
        <p style="font-size:12px;color:#e8eeff">${c.current}/${c.cap} persons (${pct}%)</p>
        <span style="font-size:10px;font-weight:700;color:${col};background:${col}22;padding:2px 8px;border-radius:4px">${c.status}</span>
      </div>`,
        { maxWidth: 220 },
      );
  });
});
onUnmounted(() => {
  if (map) map.remove();
});
</script>

<template>
  <div class="mb-5">
    <h1 class="font-cond font-bold text-2xl text-ink mb-0.5">
      Evacuation Guide — Negros Occidental
    </h1>
    <p class="text-[13px] text-muted">
      Pre-identified evacuation centers, routes, and capacities per municipality
    </p>
  </div>

  <!-- Evac map -->
  <div class="dash-card p-0 overflow-hidden rounded-xl mb-5">
    <div ref="mapEl" class="w-full h-64 lg:h-80" />
  </div>

  <!-- Evac Centers Grid -->
  <h2 class="font-cond font-bold text-[16px] text-ink mb-3">
    Evacuation Centers
  </h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
    <div v-for="c in EVAC_CENTERS" :key="c.name" class="dash-card">
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-semibold text-ink mb-0.5 leading-snug">
            {{ c.name }}
          </p>
          <p class="text-[11px] text-faint">📍 {{ c.muni }} · {{ c.type }}</p>
        </div>
        <span
          :class="[
            'flex-shrink-0 ml-2 text-[10px] font-bold px-2 py-0.5 rounded border',
            statusColor[c.status]?.text || 'text-muted',
            statusColor[c.status]?.border || 'border-border',
            statusColor[c.status]?.bg || '',
          ]"
        >
          {{ c.status }}
        </span>
      </div>
      <p class="text-[12px] text-muted mb-2">
        Capacity:
        <strong class="text-ink">{{ c.current }} / {{ c.cap }}</strong> persons
      </p>
      <div class="mini-bar">
        <div
          :class="['mini-bar-fill', statusColor[c.status]?.bar || 'bg-safe']"
          :style="{
            width:
              c.cap > 0 ? Math.round((c.current / c.cap) * 100) + '%' : '0%',
          }"
        />
      </div>
      <p class="text-[10px] text-faint mt-1.5">
        {{ c.cap > 0 ? Math.round((c.current / c.cap) * 100) : 0 }}% occupancy
      </p>
    </div>
  </div>

  <!-- Emergency contacts -->
  <div class="dash-card">
    <h2 class="font-cond font-bold text-[16px] text-ink mb-4">
      Emergency Contact Directory
    </h2>
    <div class="overflow-x-auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Agency</th>
            <th>Location</th>
            <th>Contact Number</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in EMERGENCY_CONTACTS" :key="c.agency">
            <td class="font-semibold text-ink">{{ c.agency }}</td>
            <td>{{ c.location }}</td>
            <td class="font-mono-custom text-bright">{{ c.tel }}</td>
            <td class="text-faint">{{ c.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
