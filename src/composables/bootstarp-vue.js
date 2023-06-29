import { getCurrentInstance } from 'vue';

export function useBVModal() {
  return getCurrentInstance()?.proxy.$bvModal
}

export function useBVToast() {
  return getCurrentInstance()?.proxy.$bvToast
}
export function useBVRoot() {
  return getCurrentInstance()?.proxy.$root
}
