fetch('https://www.reddit.com/r/news/top.json?limit=5&t=day')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('socialData');

    const titles = [];
    const upvotes = [];

    let table = `
      <table class="min-w-full bg-gray-800 text-white border border-gray-600 rounded-lg overflow-hidden">
        <thead class="bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Title</th>
            <th class="px-4 py-2 text-center">Upvotes</th>
            <th class="px-4 py-2 text-center">Comments</th>
            <th class="px-4 py-2 text-center">Link</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.data.children.forEach(post => {
      const item = post.data;
      titles.push(item.title.length > 30 ? item.title.slice(0, 30) + "…" : item.title);
      upvotes.push(item.ups);

      table += `
        <tr class="border-t border-gray-600 hover:bg-gray-700">
          <td class="px-4 py-2">${item.title}</td>
          <td class="px-4 py-2 text-center">${item.ups}</td>
          <td class="px-4 py-2 text-center">${item.num_comments}</td>
          <td class="px-4 py-2 text-center">
            <a href="https://reddit.com${item.permalink}" target="_blank" class="text-blue-400 hover:underline">View</a>
          </td>
        </tr>
      `;
    });

    table += '</tbody></table>';
    container.innerHTML = table;

    // Draw Chart
    const ctx = document.getElementById('redditChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: titles,
        datasets: [{
          label: 'Upvotes',
          data: upvotes,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'white' } }
        },
        scales: {
          x: { ticks: { color: 'white' } },
          y: {
            ticks: { color: 'white' },
            beginAtZero: true
          }
        }
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('socialData').textContent = 'Failed to load social data.';
  });
