<script>
    import Icon from '@iconify/svelte';
    export let iconName; // To receive the icon name as a prop
    export let bgColor = 'bg-secondary2'; // To receive the background color as a prop with a default value
  </script>
  
  <div class={`p-2 w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
    <Icon icon={iconName} class="text-2xl text-black" />
  </div>
  