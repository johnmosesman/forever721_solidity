<script lang="ts">
	console.log($$props);
	// TODO all of the avail props are logged out with $$props;

	// if you want to properly export them you can do this
	export let image_url;
	export let created_date;
	export let description;

	// Everythign below this is just html
</script>

<div class="bg-gray-50 p-4 border">
	<img src={image_url} />

	<div>
		Created at: {created_date}
	</div>
	<div class="truncate">
		Description: {description}
	</div>
</div>

<style>
	/* These styles only apply to this component */
</style>
