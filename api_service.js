const CONTROL_API = "";
const HEALTH_CHECK_TIMEOUT = 3000;

async function send(endpoint) {
  try {
    const response = await fetch(
      `${CONTROL_API}/${endpoint}`
    );

    if (!response.ok) {
      throw new Error("Error HTTP " + response.status);
    }

  } catch (error) {
    console.error(error);
  }
}

async function allPower() {
  await Promise.all([
    send("tv/pwr"),
    send("sound/pwr")
  ]);
}

async function checkConnection() {
  const status = document.getElementById("connection-status");
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    HEALTH_CHECK_TIMEOUT
  );

  status.textContent = "Conectando...";
  status.className = "connecting";

  try {
    const response = await fetch(`${CONTROL_API}/`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    status.textContent = "● Conectado";
    status.className = "connected";

  } catch (error) {
    if (error.name === "AbortError") {
      status.textContent = "● Conexion timeout";
    } else {
      status.textContent = "● Desconectado";
    }

    status.className = "disconnected";
    console.error("Microcontroller connection error:", error);

  } finally {
    clearTimeout(timeout);
  }
}

// Run health check when page loads
document.addEventListener("DOMContentLoaded", checkConnection);