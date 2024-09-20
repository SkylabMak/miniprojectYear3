<script>
    export let isOpen = false;
    
    // Function to close the popup
    function closePopup() {
        isOpen = false;
    }
    </script>
    
    {#if isOpen}
    <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <!-- Popup Content -->
        <div class="bg-primary rounded-lg p-6 max-h-10/12 max-w-10/12 space-y-4 relative shadow-lg flex flex-col items-center overflow-y-auto">
            <!-- Slot for custom content, which will scroll if overflowed -->
            <div class="w-full overflow-y-auto max-h-[500px]">
                <slot />
            </div>
            <!-- Close Button -->
            <button class="bg-accent2 w-fit text-white px-4 py-2 rounded-lg" on:click={closePopup}>
                ปิด
            </button>
        </div>
    </div>
    {/if}
    
    <style>
    /* Styles for the popup backdrop and content */
    .fixed {
        position: fixed;
        top: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
        z-index: 999;
    }
    
    /* Ensure that the slot container is scrollable if content exceeds the max height */
    .overflow-y-auto {
        overflow-y: auto;
    }
    </style>
    