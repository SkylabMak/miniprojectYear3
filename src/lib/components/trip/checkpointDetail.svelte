<script lang="ts">
	import Popup from "../Popup.svelte";

    function closePopup() {
      console.log("ปิด clicked");
    }
  
    function checkPoint() {
      console.log("check point clicked");
    }
    export let showDetailPopup: boolean;
  </script>
  
  <Popup bind:isOpen={showDetailPopup}>
    <div class="bg-blue-100 p-4 rounded-lg w-64 shadow-md">
        <h2 class="font-bold text-gray-800 mb-2">พูดคุยกัน</h2>
        <hr class="border-gray-300 mb-2">
        
        <ul class="list-disc ml-4 mb-2 text-gray-700">
          <li>บริเวณ</li>
          <li>ลานน้ำพุข้างตลาด</li>
          <li>คำอธิบาย</li>
        </ul>
      
        <p class="text-gray-600 mb-4">พูดคุยกันแลกเปลี่ยนการติดต่อกัน</p>
      
        <div class="flex gap-2">
          <button 
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            on:click={closePopup}
          >
            ปิด
          </button>
          <button 
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            on:click={checkPoint}
          >
            check point
          </button>
        </div>
      </div>
  </Popup>
  
  
  