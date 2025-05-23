fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7505&longitude=-73.9934&hourly=temperature_2m&current_weather=true&timezone=auto')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    const hours = data.hourly.time.slice(0, 12);
    const temps = data.hourly.temperature_2m.slice(0, 12);
    const current = data.current_weather;

    // Draw chart
    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours.map(h => new Date(h).getHours() + ":00"),
        datasets: [{
          label: 'Temperature (°C)',
          data: temps,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'white' } }
        },
        scales: {
          x: { ticks: { color: 'white' } },
          y: { ticks: { color: 'white' } }
        }
      }
    });

    // Add location/weather/time details
    document.getElementById('sportsData').innerHTML = `
      <div class="p-4 mt-4 bg-gray-800 text-white rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Current Weather</h2>
        <p><strong>📍 Location:</strong> Madison Square Garden, NYC</p>
        <p><strong>🌡️ Temperature:</strong> ${current.temperature}°C</p>
        <p><strong>📆 Date:</strong> ${new Date(current.time).toLocaleDateString()}</p>
        <p><strong>⏰ Time:</strong> ${new Date(current.time).toLocaleTimeString()}</p>
      </div>
    `;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('sportsData').textContent = 'Failed to load weather data.';
  });
