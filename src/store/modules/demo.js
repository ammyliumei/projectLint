import { defineStore } from "pinia";

export const useCounterStore = defineStore("demo", {
  state: () => ({
    count: 1,
  }),
  actions: {
    accumulate() {
      this.count++;
    },
  },
});
