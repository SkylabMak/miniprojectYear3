<script lang="ts">
    export let message: orgChat
  
    // Function to handle button click events (for example)
    function handleDayClick() {
      console.log('Day button clicked');
    }
  
    function handleStatusClick() {
      console.log('Status button clicked');
    }
    const date = new Date(message.startTime)
    const formattedDate = !isNaN(date.getTime()) 
    ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}` 
    : 'None';

  const formattedTime = !isNaN(date.getTime()) 
    ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` 
    : 'None';
  </script>
  
  <!-- Outer container with border -->
  <div class="border-2 rounded-lg p-4 mb-4 space-y-2 {(message.readed === false) ? 'border-accent1' : 'border-gray-300'}">
    <!-- Top row with title, date, and time -->
    <div class="flex justify-between">
      <h3 class="font-bold text-lg">{message.tripname}</h3>
      <div class="flex flex-col items-end">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    </div>
  
    <!-- Middle row with user profile image, username, and message -->
    <div class="flex items-start space-x-4">
      <img
        src={ message.custImgUrl|| 'https://via.placeholder.com/40'}
        alt="User profile"
        class="w-10 h-10 rounded-full"
      />
      <div>
        <span class="font-bold">{message.custName}</span>
        <p class="text-sm text-gray-600">{message.Lastmessage}</p>
      </div>
    </div>
  
    <!-- Bottom row with buttons -->
    <div class="flex space-x-4">
        {#if message.bookDone !== ""}
      <button
        class="bg-blue-900 text-white px-4 py-2 rounded-lg"
        on:click={handleDayClick}
      >
        วัน
      </button>
      
      <button
      class="bg-blue-900 text-white px-4 py-2 rounded-lg"
      on:click={handleStatusClick}
    >
      สถานะ
    </button>
      {/if}
    
    </div>
  </div>
  
  