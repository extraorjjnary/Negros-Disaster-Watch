<script setup>
import { ref, computed } from 'vue';
import { ALERT_LOG, ACTIVE_ALERTS } from '@/data/seedData.js';
import AlertItem from '@/components/ui/AlertItem.vue';

const filterSev = ref('all');
const filterCh = ref('all');

const filtered = computed(() => {
  let data = ALERT_LOG;
  if (filterSev.value !== 'all')
    data = data.filter((d) => d.sev === filterSev.value);
  if (filterCh.value !== 'all')
    data = data.filter((d) => d.ch === filterCh.value);
  return data;
});

const sevColor = {
  Critical: 'text-danger',
  Warning: 'text-warning',
  Watch: 'text-caution',
  Info: 'text-bright',
};
const chIcon = { SMS: '📱', App: '📲', Web: '🌐', Radio: '📻' };
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="font-cond font-bold text-2xl text-ink mb-0.5">
        Alert & Notification Log
      </h1>
      <p class="text-[13px] text-muted">
        Complete history of all disseminated warnings — SMS, Mobile App, Web,
        Radio
      </p>
    </div>

    <!-- Active alerts -->
    <div class="mb-6">
      <h2
        class="font-cond font-bold text-[16px] text-ink mb-3 flex items-center gap-2"
      >
        Active Alerts
        <span class="live-badge"
          ><span class="status-dot bg-danger" />LIVE</span
        >
      </h2>
      <AlertItem v-for="a in ACTIVE_ALERTS" :key="a.title" :alert="a" />
    </div>

    <!-- Log table -->
    <div class="dash-card">
      <div class="flex flex-wrap gap-3 items-center mb-5">
        <h2 class="font-cond font-bold text-[16px] text-ink mr-2">
          Notification History
        </h2>
        <select
          v-model="filterSev"
          class="bg-card border border-border text-ink rounded-lg px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-bright"
        >
          <option value="all">All Severities</option>
          <option>Critical</option>
          <option>Warning</option>
          <option>Watch</option>
          <option>Info</option>
        </select>
        <select
          v-model="filterCh"
          class="bg-card border border-border text-ink rounded-lg px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-bright"
        >
          <option value="all">All Channels</option>
          <option>SMS</option>
          <option>App</option>
          <option>Web</option>
          <option>Radio</option>
        </select>
        <span class="text-[12px] text-faint ml-auto"
          >{{ filtered.length }} record(s)</span
        >
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Area Covered</th>
              <th>Channel</th>
              <th>Recipients</th>
              <th>Issued By</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in filtered" :key="d.dt + d.type">
              <td class="font-mono-custom text-[11.5px]">{{ d.dt }}</td>
              <td class="font-semibold text-ink">{{ d.type }}</td>
              <td>
                <span :class="['font-semibold', sevColor[d.sev]]"
                  >● {{ d.sev }}</span
                >
              </td>
              <td>📍 {{ d.area }}</td>
              <td>{{ chIcon[d.ch] || '' }} {{ d.ch }}</td>
              <td class="font-mono-custom">{{ d.recip }}</td>
              <td class="text-faint">{{ d.by }}</td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="7" class="text-center text-faint py-8">
                No records match the selected filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
