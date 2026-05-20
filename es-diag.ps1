$es_host = "http://localhost:9200"
$index = "josh-expertise"

Write-Host "Elasticsearch Diagnostics Report" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. Testing Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $es_host -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✓ RUNNING" -ForegroundColor Green
} catch {
    Write-Host "   ✗ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "2. Document Count..." -ForegroundColor Yellow
try {
    $countResp = Invoke-WebRequest -Uri "$es_host/$index/_count" -TimeoutSec 5 -ErrorAction Stop
    $countData = $countResp.Content | ConvertFrom-Json
    Write-Host "   Count: $($countData.count) documents" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Search for 'api'..." -ForegroundColor Yellow
try {
    $searchResp = Invoke-WebRequest -Uri "$es_host/$index/_search?q=api" -TimeoutSec 5 -ErrorAction Stop
    $searchData = $searchResp.Content | ConvertFrom-Json
    Write-Host "   Found: $($searchData.hits.total.value) results" -ForegroundColor Green
    if ($searchData.hits.hits.Count -gt 0) {
        Write-Host "   First hit: $($searchData.hits.hits[0]._id)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
