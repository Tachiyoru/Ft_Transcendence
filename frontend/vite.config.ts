import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    host: true,
    port: 5173, // This is the port which we will use in docker
    // Thanks @sergiomoura for the window fix
    // add the next lines if you're using windows and hot reload doesn't work
    watch: {
      usePolling: true,
    },
  },
});
=======
	host: true,
	port: 5173, // This is the port which we will use in docker
	// Thanks @sergiomoura for the window fix
	// add the next lines if you're using windows and hot reload doesn't work
	 watch: {
	   usePolling: true
	 }
	}
})
>>>>>>> d95e83e51981742c99b13db90a3f698fd9fcdd64
