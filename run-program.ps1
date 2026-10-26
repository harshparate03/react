param([int]$Question = 0)
$programRoot = Join-Path $PSScriptRoot 'Programs'
$programs = Get-ChildItem -LiteralPath $programRoot -Directory | Sort-Object Name
if ($Question -eq 0) {
    $programs | ForEach-Object { Write-Host $_.Name }
    $Question = [int](Read-Host 'Enter question number (example: 1 or 25)')
}
$prefix = 'Q{0:D2}_' -f $Question
$selected = $programs | Where-Object { $_.Name.StartsWith($prefix) } | Select-Object -First 1
if (-not $selected) { Write-Host 'This question number is not in the PDF.'; exit 1 }
& (Join-Path $selected.FullName 'START.cmd')
