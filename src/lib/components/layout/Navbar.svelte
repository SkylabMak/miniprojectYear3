<script lang="ts">
  import { navbarStatus, setActiveNavbarItem } from "$lib/store/store";
  import IconContainer from "../IconContainer.svelte";
  import { goto } from '$app/navigation';

  let status : boolean[] = [];

  // Subscribing to the store to get the status array
  $: navbarStatus.subscribe(value => (status = value));

  // Function to navigate
  function navigateToPage(index: number, path: string, replaceState = false) {
    setActiveNavbarItem(index);
    goto(path, { replaceState }); // Use replaceState to reset history
  }
</script>

<footer class="bg-secondary3 p-4 rounded-t-2xl fixed bottom-0 left-0 right-0">
  <nav class="flex justify-around">
    <!-- Home Button -->
    <div class="flex flex-col items-center space-y-1">
      <button
        type="button"
        aria-label="Home"
        on:click={() => navigateToPage(0, '/', true)}
      >
        <IconContainer
          iconName="carbon:home"
          yes={status[0]}
        />
      </button>
      {#if status[0]}
        <div class="w-8 h-1 bg-black rounded-full"></div>
      {/if}
    </div>

    <!-- Books Button -->
    <div class="flex flex-col items-center space-y-1">
      <button
        type="button"
        aria-label="Books"
        on:click={() => navigateToPage(1, '/library')}
      >
        <IconContainer
          iconName="uil:books"
          yes={status[1]}
        />
      </button>
      {#if status[1]}
        <div class="w-8 h-1 bg-black rounded-full"></div>
      {/if}
    </div>

    <!-- Location Button -->
    <div class="flex flex-col items-center space-y-1">
      <button
        type="button"
        aria-label="Location"
        on:click={() => navigateToPage(2, '/current')}
      >
        <IconContainer
          iconName="carbon:location-current"
          yes={status[2]}
        />
      </button>
      {#if status[2]}
        <div class="w-8 h-1 bg-black rounded-full"></div>
      {/if}
    </div>

    <!-- Profile Button -->
    <div class="flex flex-col items-center space-y-1">
      <button
        type="button"
        aria-label="Profile"
        on:click={() => navigateToPage(3, '/profile')}
      >
        <IconContainer
          iconName="material-symbols:person-outline"
          yes={status[3]}
        />
      </button>
      {#if status[3]}
        <div class="w-8 h-1 bg-black rounded-full"></div>
      {/if}
    </div>
  </nav>
</footer>
