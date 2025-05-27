const locationMap = {
  new_york: {
    name: "Madison Square Garden, NYC",
    lat: 40.7505,
    lon: -73.9934,
  },
  london: {
    name: "Wembley Stadium, London",
    lat: 51.5560,
    lon: -0.2796,
  },
  tokyo: {
    name: "National Stadium, Tokyo",
    lat: 35.6785,
    lon: 139.6823,
  },
  sydney: {
    name: "Accor Stadium, Sydney",
    lat: -33.8474,
    lon: 151.0631,
  },
  doha: {
    name: "Khalifa Intl Stadium, Doha",
    lat: 25.2637,
    lon: 51.4481,
  },
};

let chartInstance;

function loadWeather(locationKey) {
  const { lat, lon, name } = locationMap[locationKey];

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current_weather=true&timezone=auto`
  )
    .then((res) => res.json())
    .then((data) => {
      const hours = data.hourly.time.slice(0, 12);
      const temps = data.hourly.temperature_2m.slice(0, 12);
      const current = data.current_weather;

      // Destroy existing chart if any
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Draw new chart
      const ctx = document.getElementById("weatherChart").getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: hours.map((h) => new Date(h).getHours() + ":00"),
          datasets: [
            {
              label: "Temperature (°C)",
              data: temps,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: "white" } },
          },
          scales: {
            x: { ticks: { color: "white" } },
            y: { ticks: { color: "white" }, beginAtZero: true },
          },
        },
      });

      // Show current weather data
      document.getElementById("sportsData").innerHTML = `
        <div class="p-4 mt-4 bg-gray-800 text-white rounded shadow">
          <h2 class="text-xl font-semibold mb-2">Current Weather</h2>
          <p><strong>📍 Location:</strong> ${name}</p>
          <p><strong>🌡️ Temperature:</strong> ${current.temperature}°C</p>
          <p><strong>📆 Date:</strong> ${new Date(current.time).toLocaleDateString()}</p>
          <p><strong>⏰ Time:</strong> ${new Date(current.time).toLocaleTimeString()}</p>
        </div>
      `;
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("sportsData").textContent =
        "Failed to load weather data.";
    });
}

// Load initial weather (New York)
loadWeather("new_york");

// Listen to location change
document.getElementById("location").addEventListener("change", (e) => {
  loadWeather(e.target.value);
});
