

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

    try {
        & $Test
        $script:testsPassed++
    } catch {
        $script:testsFailed++
        Write-Host "FAIL: $Name"
    }
}

Test-Endpoint "Health" {
    $response = Invoke-RestMethod "$($baseUrl)/health"
    if ($response.status -ne "ok") { throw "Health failed" }
}

Test-Endpoint "Database" {
    $response = Invoke-RestMethod "$($baseUrl)/health/db"
    if ($response.database -ne "connected") { throw "DB failed" }
}

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
    if (!$apiKey1) { throw "No API key" }
}

Test-Endpoint "Valid API" {
    $response = Invoke-RestMethod `
        "$($baseUrl)/test/protected" `
        -Headers @{"X-API-Key" = $apiKey1}
    if (!$response.message) { throw "Auth failed" }
}

Test-Endpoint "Invalid API" {
    try {
        Invoke-RestMethod `
            "$($baseUrl)/test/protected" `
            -Headers @{"X-API-Key" = "invalid"}
        throw "Accepted invalid"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -ne 401) { throw "Wrong status" }
    }
}

$comment1 = $null
$comment2 = $null

Test-Endpoint "Create Comment" {
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

Test-Endpoint "Create Reply" {
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

Test-Endpoint "Pagination" {
    $url = "$($baseUrl)/comments?entityId=post-test-123&page=1&limit=1"
    $response = Invoke-RestMethod $url -Headers @{"X-API-Key" = $apiKey1}
    if ($response.data.Count -ne 1) { throw "Pagination failed" }
}

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

Test-Endpoint "Isolation" {
    try {
        Invoke-RestMethod `
            "$($baseUrl)/comments/$($comment1.id)" `
            -Headers @{"X-API-Key" = $apiKey2}
        throw "Cross access"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -ne 404) { throw "Wrong status" }
    }
}

Write-Host "Run:$testsRun Pass:$testsPassed Fail:$testsFailed"
