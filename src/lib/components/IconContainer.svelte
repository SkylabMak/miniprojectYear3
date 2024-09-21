<script>
    import Icon from '@iconify/svelte';
    export let iconName;
    export let yes = true
  </script>
  
  <div class={`m-1 p-2 w-12 h-12 rounded-lg flex items-center justify-center 
  ${(yes)?"bg-secondary1":"bg-accent2"}`}>
    <Icon icon={iconName} class={`text-2xl 
    ${(yes)?"text-black":"text-white"}`} />
  </div>
  