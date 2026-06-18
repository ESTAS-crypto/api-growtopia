const express = require('express');
const handler = require('./api/item.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Main endpoint for lookup
app.get('/api/item', (req, res) => {
  handler(req, res);
});

// Interactive Web Dashboard for testing the API
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Growtopia Item Lookup API</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Space+Mono&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-main: #0b0f19;
          --bg-card: #151d30;
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --primary-color: #38bdf8;
          --primary-hover: #7dd3fc;
          --accent-color: #10b981;
          --border: #24324f;
        }

        body {
          font-family: 'Outfit', sans-serif;
          background: radial-gradient(circle at top, #1e293b 0%, var(--bg-main) 70%);
          color: var(--text-primary);
          min-height: 100vh;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .container {
          background-color: rgba(21, 29, 48, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          max-width: 600px;
          width: 90%;
          border: 1px solid var(--border);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .container:hover {
          transform: translateY(-2px);
        }

        h1 {
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 0;
          font-size: 32px;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        h1 span {
          color: var(--primary-color);
          text-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }

        p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 16px;
          margin-bottom: 25px;
        }

        .search-container {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }

        input {
          flex: 1;
          background-color: rgba(11, 15, 25, 0.7);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 16px;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
        }

        button {
          background-color: var(--primary-color);
          color: #0b0f19;
          font-family: inherit;
          font-weight: 600;
          font-size: 16px;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }

        button:hover {
          background-color: var(--primary-hover);
        }

        button:active {
          transform: scale(0.98);
        }

        .url-box {
          background-color: #070a13;
          padding: 14px;
          border-radius: 10px;
          font-family: 'Space Mono', monospace;
          color: var(--accent-color);
          font-size: 14px;
          margin-bottom: 20px;
          text-align: left;
          border: 1px solid var(--border);
          overflow-x: auto;
          white-space: nowrap;
        }

        .url-box span {
          color: var(--text-secondary);
        }

        .result-card {
          background-color: rgba(11, 15, 25, 0.6);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid var(--border);
          text-align: left;
          display: none;
          margin-top: 25px;
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-header {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        pre {
          margin: 0;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          color: #34d399;
          overflow-x: auto;
        }

        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: var(--text-secondary);
          border-top: 1px solid var(--border);
          padding-top: 15px;
        }

        .footer a {
          color: var(--primary-color);
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Growtopia Item <span>Lookup API</span> 🚀</h1>
        <p>API lokal Anda sedang berjalan. Gunakan formulir di bawah ini untuk menguji endpoint secara interaktif.</p>
        
        <div class="search-container">
          <input type="number" id="itemId" value="18" placeholder="Masukkan ID Item (contoh: 18, 100, 242)">
          <button onclick="testLookup()">Lookup</button>
        </div>

        <div class="url-box">
          <span>Request URL: </span><span id="reqUrl">http://localhost:3000/api/item?id=18</span>
        </div>

        <div id="resultCard" class="result-card">
          <div class="result-header" id="resStatus">Response</div>
          <pre><code id="jsonResponse"></code></pre>
        </div>

        <div class="footer">
          Siap deploy ke <a href="https://vercel.com" target="_blank">Vercel</a> | Gunakan endpoint dengan bot Lua atau Discord Webhook Anda.
        </div>
      </div>

      <script>
        function testLookup() {
          const id = document.getElementById('itemId').value;
          if (!id) return;

          const host = window.location.host;
          const url = 'http://' + host + '/api/item?id=' + id;
          document.getElementById('reqUrl').innerText = url;

          fetch(url)
            .then(res => {
              const statusText = 'Response Status: ' + res.status + ' ' + res.statusText;
              document.getElementById('resStatus').innerText = statusText;
              document.getElementById('resStatus').style.color = res.ok ? '#10b981' : '#f43f5e';
              return res.json();
            })
            .then(data => {
              document.getElementById('jsonResponse').textContent = JSON.stringify(data, null, 2);
              document.getElementById('resultCard').style.display = 'block';
            })
            .catch(err => {
              document.getElementById('jsonResponse').textContent = JSON.stringify({ error: err.message }, null, 2);
              document.getElementById('resultCard').style.display = 'block';
            });
        }

        // Run once on load
        window.onload = testLookup;
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Local Dev Server running at http://localhost:${PORT}`);
  console.log(`👉 Interactive Dashboard: http://localhost:${PORT}`);
  console.log(`👉 API Endpoint: http://localhost:${PORT}/api/item?id=18\n`);
});
