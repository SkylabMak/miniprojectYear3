<script lang="ts">
import Header from './Header.svelte';
import '../app.css';
import Navbar from '$lib/components/layout/Navbar.svelte';
import SearchBar from '$lib/components/layout/SearchBar.svelte';
import {
    searchedTrip,
    setActiveNavbarItem
} from '$lib/store/store';
import {
    onMount
} from 'svelte';
import {
    goto
} from '$app/navigation';
let searchTerm = '';

async function getSearchTrip() {
    const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Text: searchTerm
        }),
    });
    const data = (await response.json()).Trip;
    // console.log("searched data",data)
    searchedTrip.set(data)
    setActiveNavbarItem(0)
    goto("/")
}

function handleSearch(event: CustomEvent) {
    // console.log('Search term:', event.detail.term);
    getSearchTrip();
}
onMount(async () => {
    getSearchTrip();
});
</script>

<div class="app bg-primary">
    <SearchBar bind:searchTerm on:search={handleSearch} />

    <main>
        <slot />
    </main>

    <Navbar/>

        </div>

<style lang="postcss">
    
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding-bottom: 6rem;
    }
    
main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}
</style>
