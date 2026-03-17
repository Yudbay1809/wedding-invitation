$ErrorActionPreference = "Stop"

$shim = "$env:USERPROFILE\scoop\shims\supabase.exe"
if (Test-Path $shim) {
  $supabase = $shim
} else {
  $supabase = "supabase"
}

$previous = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$status = (& $supabase status 2>&1 | Out-String)
$ErrorActionPreference = $previous
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($status)) {
  Write-Error "Supabase status failed. Is supabase local running?"
  exit 1
}

$lines = $status -split "\r?\n" | ForEach-Object { $_.Trim() }
$projectUrl = ($lines | Where-Object { $_ -like "*Project URL*" } | Select-Object -First 1) -replace "^.*Project URL\s+\|\s+", "" -replace "\s+\|$", ""
$publishable = ($lines | Where-Object { $_ -like "*Publishable*" } | Select-Object -First 1) -replace "^.*Publishable\s+\|\s+", "" -replace "\s+\|$", ""
$secret = ($lines | Where-Object { $_ -like "*Secret*" } | Select-Object -First 1) -replace "^.*Secret\s+\|\s+", "" -replace "\s+\|$", ""

if ([string]::IsNullOrWhiteSpace($projectUrl) -or [string]::IsNullOrWhiteSpace($publishable) -or [string]::IsNullOrWhiteSpace($secret)) {
  Write-Error "Could not parse supabase status output."
  exit 1
}

@"
NEXT_PUBLIC_SUPABASE_URL=$projectUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$publishable
SUPABASE_SERVICE_ROLE_KEY=$secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Set-Content -Path .env.local

Write-Output "Wrote .env.local from supabase status."
