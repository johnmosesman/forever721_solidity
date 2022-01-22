<script lang="ts">
	export let onClick = () => {};
</script>

<button
	on:click={onClick}
	class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
>
	<slot />
</button>
