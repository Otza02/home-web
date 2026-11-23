const CONTROL_API = "";

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