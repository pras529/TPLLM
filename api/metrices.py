from prometheus_client import Counter, generate_latest

REQUEST_COUNT = Counter('tpllm_api_requests_total', 'Total API Requests', ['method', 'endpoint'])

def monitor_requests(method, endpoint):
    REQUEST_COUNT.labels(method=method, endpoint=endpoint).inc()

def metrics():
    return generate_latest(), 200, {'Content-Type': 'text/plain; charset=utf-8'}
