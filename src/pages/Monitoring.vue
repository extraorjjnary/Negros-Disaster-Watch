<script setup>
import { computed, ref } from 'vue';
import { useSensorStore } from '@/stores/sensorStore.js';
import SensorCard from '@/components/sensors/SensorCard.vue';

const sensor = useSensorStore();
const filter = ref('All');
const filters = ['All', 'Critical', 'Warning', 'Watch', 'Normal'];

const filtered = computed(() =>
  filter.value === 'All'
    ? sensor.stations
    : sensor.stations.filter((s) => s.status === filter.value),
);

const statusCounts = computed(() => ({
  Critical: sensor.stations.filter((s) => s.status === 'Critical').length,
  Warning: sensor.stations.filter((s) => s.status === 'Warning').length,
  Watch: sensor.stations.filter((s) => s.status === 'Watch').length,
  Normal: sensor.stations.filter((s) => s.status === 'Normal').length,
}));

const sevColor = {
  Critical: 'text-danger',
  Warning: 'text-warning',
  Watch: 'text-caution',
  Normal: 'text-safe',
};

function nowStr() {
  return new Date().toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="font-cond font-bold text-2xl text-ink mb-0.5">
        Real-time Sensor Monitoring
      </h1>
      <p class="text-[13px] text-muted">
        42 IoT nodes · Auto-refresh every 5 seconds · All times PST (UTC+8)
      </p>
    </div>

    <!-- Summary chips -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <div
        v-for="[lbl, cls] in [
          ['Critical', 'text-danger'],
          ['Warning', 'text-warning'],
          ['Watch', 'text-caution'],
          ['Normal', 'text-safe'],
        ]"
        :key="lbl"
        class="dash-card text-center"
      >
        <p :class="['font-mono-custom text-2xl font-medium', cls]">
          {{ statusCounts[lbl] }}
        </p>
        <p class="text-[11px] text-muted mt-1">{{ lbl }}</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 flex-wrap mb-5">
      <button
        v-for="f in filters"
        :key="f"
        :class="['btn btn-sm', filter === f ? 'btn-primary' : 'btn-ghost']"
        @click="filter = f"
      >
        {{ f }}
      </button>
    </div>

    <!-- Sensor Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      <SensorCard v-for="s in filtered" :key="s.id" :sensor="s" />
    </div>

    <!-- Table -->
    <div class="dash-card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-cond font-bold text-[16px] text-ink">
          Live Sensor Data Feed
        </h2>
        <span class="live-badge"
          ><span class="status-dot bg-danger" />STREAMING</span
        >
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Station</th>
              <th>Municipality</th>
              <th>Type</th>
              <th>Current Value</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sensor.stations" :key="s.id">
              <td class="font-semibold text-ink">{{ s.name }}</td>
              <td>{{ s.muni }}</td>
              <td>{{ s.type }}</td>
              <td class="font-mono-custom font-semibold">
                {{ s.value.toFixed(1) }} {{ s.unit }}
              </td>
              <td class="font-mono-custom text-faint">
                {{ s.threshold }} {{ s.unit }}
              </td>
              <td>
                <span :class="['font-semibold', sevColor[s.status]]"
                  >● {{ s.status }}</span
                >
              </td>
              <td class="font-mono-custom text-[11px] text-faint">
                {{ nowStr() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
