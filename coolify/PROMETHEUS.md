# Server Monitoring Setup

Prometheus + Grafana + Process Exporter setup for monitoring multiple servers via Coolify.

## Architecture

| Component            | Location       | Purpose                                             |
| -------------------- | -------------- | --------------------------------------------------- |
| **Prometheus**       | Main Server    | Collects and stores metrics                         |
| **Grafana**          | Main Server    | Web UI for viewing graphs                           |
| **Node Exporter**    | Worker Servers | Exports CPU, memory, disk, network metrics          |
| **Process Exporter** | Worker Servers | Exports per-process CPU/memory (ffmpeg, node, etc.) |

---

## Setup

### 1. Deploy Worker Exporters (on each worker server)

Deploy `process-exporter.yaml` on every server you want to monitor.

**Ports exposed:**

- `9100` - Node Exporter
- `9256` - Process Exporter

---

### 2. Deploy Prometheus + Grafana (on main server)

Deploy `prometheus-grafana.yaml` on your main/monitoring server.

**Environment Variable (set in Coolify):**

```bash
WORKER_TARGETS="WORKER_IP_1:9100", "WORKER_IP_1:9256", "WORKER_IP_2:9100", "WORKER_IP_2:9256"
```

**Example with one worker:**

```bash
WORKER_TARGETS="91.99.209.200:9100", "91.99.209.200:9256"
```

**Ports exposed:**

- `9090` - Prometheus
- `3033` - Grafana

---

## Configure Grafana

### 1. Login

- URL: `http://MAIN_SERVER_IP:3033`
- Username: `admin`
- Password: `your_password_here` (or whatever you set in yaml)

### 2. Add Data Source

1. Menu (☰) → **Connections** → **Data sources**
2. Click **Add data source**
3. Select **Prometheus**
4. URL: `http://prometheus:9090`
5. Click **Save & test**

### 3. Import Dashboards

**Node Exporter Full (CPU, memory, disk, network):**

1. Menu (☰) → **Dashboards** → **New** → **Import**
2. Enter ID: `1860` → **Load**
3. Select Prometheus data source → **Import**

**Named Processes (per-process CPU/memory):**

1. Menu (☰) → **Dashboards** → **New** → **Import**
2. Enter ID: `4202` → **Load**
3. Select Prometheus data source → **Import**

---

## Adding a New Worker

1. Deploy `process-exporter.yaml` on the new server via Coolify

2. Update environment variable on main server:

   ```bash
   WORKER_TARGETS="OLD_IP:9100", "OLD_IP:9256", "NEW_IP:9100", "NEW_IP:9256"
   ```

3. Redeploy main server

4. New worker appears in dashboard Instance dropdown automatically

---

## Selecting Workers in Dashboards

Use the **Instance** dropdown at the top of each dashboard to switch between workers:

- `91.99.209.200:9100` (worker 1)
- `192.168.x.x:9100` (worker 2)

---

## Troubleshooting

### Targets showing as DOWN

Check that ports 9100 and 9256 are accessible on worker server:

```bash
# On worker server
ufw allow 9100
ufw allow 9256
```

### Verify targets are working

Visit: `http://MAIN_SERVER_IP:9090/targets`

All targets should show **UP** status.

### Grafana password not working

If password from environment variable doesn't work, delete the `grafana_data` volume and redeploy. Grafana only sets password on first run.

---

## Files

| File                      | Deploy on          |
| ------------------------- | ------------------ |
| `process-exporter.yaml`   | Each worker server |
| `prometheus-grafana.yaml` | Main server (once) |
