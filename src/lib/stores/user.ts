import { writable } from "svelte/store";

const user = writable({
  walletAddress: null,
  walletENSAddress: null
});

export { user }