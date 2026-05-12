<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import { REPORTS_RAINFALL, REPORTS_FLOOD_RISK } from '@/data/seedData.js';

Chart.register(...registerables);

const rainfallEl = ref(null);
const floodEl = ref(null);
const seismicEl = ref(null);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: '#8ba0c8', font: { size: 10 } },
      grid: { color: 'rgba(30,64,175,0.1)' },
    },
    y: {
      ticks: { color: '#8ba0c8', font: { size: 10 } },
      grid: { color: 'rgba(30,64,175,0.1)' },
    },
  },
};

onMounted(() => {
  // Rainfall bar chart
  new Chart(rainfallEl.value, {
    type: 'bar',
    data: {
      labels: REPORTS_RAINFALL.labels,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: REPORTS_RAINFALL.data,
          backgroundColor: REPORTS_RAINFALL.labels.map((_, i) =>
            i >= 9 ? 'rgba(220,38,38,0.55)' : 'rgba(59,130,246,0.55)',
          ),
          borderColor: REPORTS_RAINFALL.labels.map((_, i) =>
            i >= 9 ? 'rgba(220,38,38,0.9)' : 'rgba(59,130,246,0.9)',
          ),
          borderWidth: 1,
          borderRadius: 3,
        },
      ],
    },
    options: { ...chartDefaults },
  });

  // Flood risk line chart
  new Chart(floodEl.value, {
    type: 'line',
    data: {
      labels: REPORTS_FLOOD_RISK.labels,
      datasets: [
        {
          label: 'Risk Level',
          data: REPORTS_FLOOD_RISK.data,
          borderColor: 'rgba(234,88,12,0.9)',
          backgroundColor: 'rgba(234,88,12,0.1)',
          pointBackgroundColor: 'rgba(234,88,12,0.9)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBorderWidth: 0,
        },
      ],
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        y: {
          ...chartDefaults.scales.y,
          min: 0,
          max: 5,
          ticks: {
            color: '#8ba0c8',
            font: { size: 10 },
            callback: (v) => ['', 'Safe', 'Watch', 'Warn', 'Crit', ''][v] || v,
          },
        },
      },
    },
  });

  // Seismic bar chart (30 days)
  const days = Array.from({ length: 30 }, (_, i) => `D${i + 1}`);
  const mags = days.map(() => +(Math.random() * 2.5 + 0.3).toFixed(2));
  new Chart(seismicEl.value, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Magnitude',
          data: mags,
          backgroundColor: mags.map((v) =>
            v > 2.5
              ? 'rgba(220,38,38,0.7)'
              : v > 1.5
                ? 'rgba(217,119,6,0.6)'
                : 'rgba(59,130,246,0.5)',
          ),
          borderWidth: 0,
          borderRadius: 2,
        },
      ],
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        x: {
          ...chartDefaults.scales.x,
          ticks: {
            color: '#8ba0c8',
            font: { size: 9 },
            maxRotation: 0,
            callback: (_, i) => (i % 5 === 0 ? `D${i + 1}` : ''),
          },
        },
      },
    },
  });
});
</script>

<template>
  <div class="mb-5">
    <h1 class="font-cond font-bold text-2xl text-ink mb-0.5">
      Analytics &amp; Reports
    </h1>
    <p class="text-[13px] text-muted">
      Historical data analysis and trend visualization — Negros Occidental
    </p>
  </div>

  <!-- Summary stats -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
    <div class="dash-card">
      <p class="font-mono-custom text-2xl font-medium text-bright">847</p>
      <p class="text-[11px] text-muted mt-1">Total Alerts Issued (2026)</p>
      <p class="text-[10.5px] text-danger mt-1">↑ 12% vs 2025</p>
    </div>
    <div class="dash-card">
      <p class="font-mono-custom text-2xl font-medium text-warning">23</p>
      <p class="text-[11px] text-muted mt-1">Flood Events (2026)</p>
      <p class="text-[10.5px] text-danger mt-1">↑ 4 vs 2025</p>
    </div>
    <div class="dash-card col-span-2 sm:col-span-1">
      <p class="font-mono-custom text-2xl font-medium text-safe">98.1%</p>
      <p class="text-[11px] text-muted mt-1">Alert Delivery Rate</p>
      <p class="text-[10.5px] text-safe mt-1">↓ 0.2% vs 2025</p>
    </div>
  </div>

  <!-- Charts row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
    <div class="dash-card">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-cond font-bold text-[15px] text-ink">
          Monthly Rainfall (mm) — 2026
        </h2>
        <button class="btn btn-ghost btn-sm">⬇ Export</button>
      </div>
      <div class="relative h-52">
        <canvas ref="rainfallEl" />
      </div>
    </div>
    <div class="dash-card">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-cond font-bold text-[15px] text-ink">
          Flood Risk Level — 2026
        </h2>
        <button class="btn btn-ghost btn-sm">⬇ Export</button>
      </div>
      <div class="relative h-52">
        <canvas ref="floodEl" />
      </div>
    </div>
  </div>

  <div class="dash-card">
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-cond font-bold text-[15px] text-ink">
        Seismic Activity — Mt. Kanlaon (Past 30 Days)
      </h2>
      <button class="btn btn-ghost btn-sm">⬇ Export CSV</button>
    </div>
    <div class="relative h-44">
      <canvas ref="seismicEl" />
    </div>
  </div>
</template>
