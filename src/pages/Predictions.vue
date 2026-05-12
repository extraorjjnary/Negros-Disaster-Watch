<script setup>
import { ref } from 'vue';
import { PREDICTIONS } from '@/data/seedData.js';
import PredictionItem from '@/components/ui/PredictionItem.vue';
import { X, Zap } from 'lucide-vue-next';

const simOpen = ref(false);
const simType = ref('Flood — Level 3 (Critical)');
const simArea = ref('Silay, Talisay, Bacolod');
const simDone = ref(false);
const simLoading = ref(false);

const simTypes = [
  'Flood — Level 3 (Critical)',
  'Typhoon Signal No. 4',
  'Volcanic Eruption — Kanlaon Level 3',
  'Flash Flood — Ilog River',
  'Landslide — Northern Negros',
];
const simAreas = [
  'Silay, Talisay, Bacolod',
  'Province-wide',
  'La Castellana, Bago, Murcia',
];

async function runSim() {
  simLoading.value = true;
  await new Promise((r) => setTimeout(r, 1400));
  simLoading.value = false;
  simDone.value = true;
}
function closeModal() {
  simOpen.value = false;
  simDone.value = false;
}

const iconMap = ['🚨', '🚁', '🏗️', '🌋', '⛵', '💧'];
const sevColor = {
  critical: 'text-danger',
  high: 'text-warning',
  moderate: 'text-caution',
  low: 'text-safe',
};
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="font-cond font-bold text-2xl text-ink mb-0.5">
        AI Predictions & Risk Assessment
      </h1>
      <p class="text-[13px] text-muted">
        ML model trained on 15 years of Negros Occidental disaster data
      </p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div class="dash-card text-center">
        <p class="font-mono-custom text-2xl font-medium text-bright">94.2%</p>
        <p class="text-[11px] text-muted mt-1">Model Accuracy (30-day)</p>
      </div>
      <div class="dash-card text-center">
        <p class="font-mono-custom text-2xl font-medium text-warning">3</p>
        <p class="text-[11px] text-muted mt-1">High-Risk Predictions</p>
      </div>
      <div class="dash-card text-center">
        <p class="font-mono-custom text-2xl font-medium text-safe">18</p>
        <p class="text-[11px] text-muted mt-1">Features Analyzed</p>
      </div>
      <div class="dash-card text-center">
        <p class="font-mono-custom text-2xl font-medium text-ink">72h</p>
        <p class="text-[11px] text-muted mt-1">Forecast Horizon</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-cond font-bold text-[16px] text-ink">
            Disaster Probability Forecast
          </h2>
          <button
            class="btn btn-danger btn-sm flex items-center gap-1.5"
            @click="simOpen = true"
          >
            <Zap :size="14" /> Simulate Alert
          </button>
        </div>
        <PredictionItem v-for="p in PREDICTIONS" :key="p.type" :pred="p" />
      </div>

      <div class="dash-card h-fit">
        <h2 class="font-cond font-bold text-[16px] text-ink mb-4">
          Recommended Actions
        </h2>
        <div
          v-for="(p, i) in PREDICTIONS"
          :key="p.type"
          class="flex gap-3 py-3 border-b border-border/50 last:border-b-0"
        >
          <span class="text-lg mt-0.5 flex-shrink-0">{{
            iconMap[i] || '📌'
          }}</span>
          <div>
            <p :class="['text-[12px] font-semibold mb-1', sevColor[p.sev]]">
              {{ p.type }}
            </p>
            <p class="text-[12px] text-muted leading-relaxed">{{ p.action }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Simulate Modal -->
    <Transition name="fade">
      <div
        v-if="simOpen"
        class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-panel border border-border rounded-xl p-6 w-full max-w-md shadow-2xl"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-cond font-bold text-xl text-danger">
              ⚠️ Simulate Emergency Alert
            </h3>
            <button class="text-muted hover:text-ink" @click="closeModal">
              <X :size="18" />
            </button>
          </div>
          <p class="text-[13px] text-muted mb-5 leading-relaxed">
            Simulates sending alerts to all registered contacts.
            <strong class="text-ink"
              >No real notifications in demo mode.</strong
            >
          </p>
          <div v-if="!simDone">
            <div class="mb-4">
              <label
                class="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5"
                >Disaster Type</label
              >
              <select
                v-model="simType"
                class="w-full bg-card border border-border text-ink rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-bright"
              >
                <option v-for="t in simTypes" :key="t">{{ t }}</option>
              </select>
            </div>
            <div class="mb-5">
              <label
                class="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5"
                >Affected Area</label
              >
              <select
                v-model="simArea"
                class="w-full bg-card border border-border text-ink rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-bright"
              >
                <option v-for="a in simAreas" :key="a">{{ a }}</option>
              </select>
            </div>
            <div class="flex gap-3">
              <button
                class="flex-1 btn btn-danger justify-center"
                :disabled="simLoading"
                @click="runSim"
              >
                <span
                  v-if="simLoading"
                  class="w-4 h-4 border-2 border-danger/30 border-t-danger rounded-full animate-spin"
                />
                {{ simLoading ? 'Sending…' : '⚡ Simulate Alert' }}
              </button>
              <button class="btn btn-ghost" @click="closeModal">Cancel</button>
            </div>
          </div>
          <div
            v-else
            class="bg-safe/10 border border-safe/30 rounded-lg p-4 text-[13px]"
          >
            <p class="font-bold text-safe mb-2">✅ SIMULATION COMPLETE</p>
            <p class="text-muted leading-relaxed">
              Type: <strong class="text-ink">{{ simType }}</strong
              ><br />
              Area: <strong class="text-ink">{{ simArea }}</strong
              ><br />
              Channels: SMS · App · Web · Radio<br />
              Recipients: <strong class="text-ink">48,220</strong><br />
              <em class="text-faint"
                >No real notifications sent — demo mode.</em
              >
            </p>
            <button class="btn btn-ghost btn-sm mt-3" @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
