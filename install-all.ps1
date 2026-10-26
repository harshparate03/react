$ErrorActionPreference = 'Stop'
$workspace = $PSScriptRoot
$cachePath = (& npm.cmd config get cache).Trim()
$packages = Get-ChildItem -LiteralPath (Join-Path $workspace 'Programs') -Filter package.json -Recurse | Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' }
$failed = @()
foreach ($package in $packages) {
    Write-Host "Installing: $($package.DirectoryName)"
    Push-Location -LiteralPath $package.DirectoryName
    try {
        & npm.cmd install --offline=false --prefer-offline --cache $cachePath --no-audit --no-fund --fetch-timeout=60000 --fetch-retries=1
        if ($LASTEXITCODE -ne 0) { $failed += $package.DirectoryName }
    } finally { Pop-Location }
}
if ($failed.Count -gt 0) {
    Write-Host 'Installation failed in:'
    $failed | ForEach-Object { Write-Host $_ }
    exit 1
}
Write-Host "Dependencies installed for all $($packages.Count) packages."
