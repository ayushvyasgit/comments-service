# ============================================================================
# COMPLETE SYSTEM TEST - Comments Service
# ============================================================================

Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "        COMMENTS SERVICE - COMPLETE SYSTEM TEST" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$testsRun = 0
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$Test
    )

    $script:testsRun++
    Write-Host "`n[$testsRun] Testing: $Name" -ForegroundColor Yellow

    try {
        & $Test
        $script:testsPassed++
        Write-Host "PASS" -ForegroundColor Green
    } catch {
        $script:testsFailed++
        Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ============================================================================
# PHASE 1: HEALTH CHECKS
# ============================================================================

Write-Host "`n================ PHASE 1: HEALTH CHECKS =================" -ForegroundColor Cyan

Test-Endpoint "Application health check" {
    $response = Invoke-RestMethod "$($baseUrl)/health"
    if ($response.status -ne "ok") { throw "Health check failed" }
}

Test-Endpoint "Database connectivity" {
    $response = Invoke-RestMethod "$($baseUrl)/health/db"
    if ($response.database -ne "connected") { throw "Database not connected" }
}

# ============================================================================
# PHASE 2: TENANTS & AUTH
# ============================================================================

Write-Host "`n================ PHASE 2: TENANTS & AUTH =================" -ForegroundColor Cyan

$tenant1 = $null
$apiKey1 = $null

Test-Endpoint "Create Tenant 1" {
    $response = Invoke-RestMethod `
        -Uri "$($baseUrl)/tenants" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            name = "Test Company A"
            subdomain = "test-a-$(Get-Random -Maximum 9999)"
            plan = "FREE"
        } | ConvertTo-Json)

    $script:tenant1 = $response
    $script:apiKey1 = $response.apiKey

    if (!$apiKey1) { throw "API key not generated" }
}

Test-Endpoint "Valid API Key Works" {
    $response = Invoke-RestMethod `
        "$($baseUrl)/test/protected" `
        -Headers @{"X-API-Key" = $apiKey1}

    if (!$response.message) { throw "Auth failed" }
}

Test-Endpoint "Invalid API Key Rejected" {
    try {
        Invoke-RestMethod `
            "$($baseUrl)/test/protected" `
            -Headers @{"X-API-Key" = "invalid"}
        throw "Invalid key accepted"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -ne 401) {
            throw "Wrong status code"
        }
    }
}

# ============================================================================
# PHASE 3: COMMENTS
# ============================================================================

Write-Host "`n================ PHASE 3: COMMENTS =================" -ForegroundColor Cyan

$comment1 = $null
$comment2 = $null

Test-Endpoint "Create root comment" {
    $response = Invoke-RestMethod `
        -Uri "$($baseUrl)/comments" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{"X-API-Key" = $apiKey1} `
        -Body (@{
            entityId = "post-test-123"
            authorId = "user-1"
            authorName = "Alice"
            content = "Root comment"
        } | ConvertTo-Json)

    $script:comment1 = $response
    if ($response.depth -ne 0) { throw "Wrong depth" }
}

Test-Endpoint "Create reply" {
    $response = Invoke-RestMethod `
        -Uri "$($baseUrl)/comments" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{"X-API-Key" = $apiKey1} `
        -Body (@{
            entityId = "post-test-123"
            parentId = $comment1.id
            authorId = "user-2"
            authorName = "Bob"
            content = "Reply comment"
        } | ConvertTo-Json)

    $script:comment2 = $response
    if ($response.depth -ne 1) { throw "Wrong nested depth" }
}

Test-Endpoint "Pagination works" {
    $url = "$($baseUrl)/comments?entityId=post-test-123&page=1&limit=1"
    $response = Invoke-RestMethod $url -Headers @{"X-API-Key" = $apiKey1}

    if ($response.data.Count -ne 1) { throw "Pagination failed" }
}

# ============================================================================
# PHASE 4: MULTI-TENANT ISOLATION
# ============================================================================

Write-Host "`n================ PHASE 4: MULTI-TENANT =================" -ForegroundColor Cyan

$tenant2 = $null
$apiKey2 = $null

Test-Endpoint "Create Tenant 2" {
    $response = Invoke-RestMethod `
        -Uri "$($baseUrl)/tenants" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            name = "Test Company B"
            subdomain = "test-b-$(Get-Random -Maximum 9999)"
            plan = "STARTER"
        } | ConvertTo-Json)

    $script:tenant2 = $response
    $script:apiKey2 = $response.apiKey
}

Test-Endpoint "Tenant isolation enforced" {
    try {
        Invoke-RestMethod `
            "$($baseUrl)/comments/$($comment1.id)" `
            -Headers @{"X-API-Key" = $apiKey2}
        throw "Cross-tenant access allowed"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -ne 404) {
            throw "Wrong status code"
        }
    }
}

# ============================================================================
# FINAL RESULTS
# ============================================================================

Write-Host "`n================ TEST RESULTS =================" -ForegroundColor Cyan
Write-Host "Tests Run: $testsRun"
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red

$successRate = [math]::Round(($testsPassed / $testsRun) * 100, 2)
Write-Host "Success Rate: $successRate %"

if ($testsFailed -eq 0) {
    Write-Host "`nALL TESTS PASSED - SYSTEM STABLE" -ForegroundColor Green
} else {
    Write-Host "`nSome tests failed - Review output above" -ForegroundColor Yellow
}

Write-Host "=============================================================" -ForegroundColor Cyan
