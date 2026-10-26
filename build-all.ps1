$ErrorActionPreference = 'Stop'
$failed = @()
$packages = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'Programs') -Filter package.json -Recurse | Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' }
foreach ($package in $packages) {
    $manifest = Get-Content -LiteralPath $package.FullName -Raw | ConvertFrom-Json
    if (-not $manifest.scripts.build) { continue }
    Write-Host "Building: $($package.DirectoryName)"
    Push-Location -LiteralPath $package.DirectoryName
    try {
        & npm.cmd run build
        if ($LASTEXITCODE -ne 0) { $failed += $package.DirectoryName }
    } finally { Pop-Location }
}
if ($failed.Count -gt 0) { $failed | ForEach-Object { Write-Host "FAILED: $_" }; exit 1 }
Write-Host 'All React builds passed.'
