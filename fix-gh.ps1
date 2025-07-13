<#
.SYNOPSIS
    PowerShell script to diagnose, repair, and install GitHub CLI (gh) on Windows.
.DESCRIPTION
    - Checks for gh in PATH and registry.
    - Repairs broken installations.
    - Installs via winget or manual download.
    - Adds gh to PATH and verifies installation.
    - Color-coded output, rollback, and troubleshooting.
    - يدعم اللغة العربية والإنجليزية في التعليقات.
.PARAMETER Debug
    Enables verbose debug output.
#>

param(
    [switch]$Debug
)

function Write-Color {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

function Debug-Log {
    param([string]$Msg)
    if ($Debug) { Write-Color "[DEBUG] $Msg" "Yellow" }
}

# 1. Check if gh exists in PATH
Write-Color "🔍 Checking for GitHub CLI (gh) in PATH..." "Cyan"
$ghPath = (Get-Command gh -ErrorAction SilentlyContinue).Source
if ($ghPath) {
    Write-Color "✅ gh found at $ghPath" "Green"
} else {
    Write-Color "❌ gh not found in PATH." "Red"
}

# 2. Check Windows Registry for gh installation
Write-Color "🔍 Checking Windows Registry for gh installation..." "Cyan"
$regPaths = @(
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
    "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall"
)
$ghReg = $null
foreach ($reg in $regPaths) {
    $apps = Get-ChildItem $reg | ForEach-Object { Get-ItemProperty $_.PSPath }
    foreach ($app in $apps) {
        if ($app.DisplayName -like "*GitHub CLI*") {
            $ghReg = $app
            break
        }
    }
    if ($ghReg) { break }
}
if ($ghReg) {
    Write-Color "✅ gh found in registry: $($ghReg.DisplayName)" "Green"
    Debug-Log "Registry InstallLocation: $($ghReg.InstallLocation)"
} else {
    Write-Color "❌ gh not found in registry." "Red"
}

# 3. Detect broken installations
$broken = $false
if ($ghReg -and !(Test-Path $ghReg.InstallLocation)) {
    Write-Color "⚠️ gh registry entry exists but InstallLocation is missing or broken." "Yellow"
    $broken = $true
}

# 4. Backup current PATH
$envPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$backupPath = "$env:TEMP\\PATH_backup_$(Get-Date -Format 'yyyyMMddHHmmss').txt"
Set-Content -Path $backupPath -Value $envPath
Write-Color "🗂️ PATH backed up to $backupPath" "Gray"

# 5. Validate admin rights
$admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($admin) {
    Write-Color "🛡️ Running as Administrator." "Green"
} else {
    Write-Color "⚠️ Not running as Administrator. Some steps may require elevation." "Yellow"
}

# 6. Smart Repair/Install
function Install-GH {
    Write-Color "🚀 Attempting to install gh via winget..." "Cyan"
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        try {
            winget install --id GitHub.cli -e --source winget -h
            Write-Color "✅ gh installed via winget." "Green"
            return $true
        } catch {
            Write-Color "❌ winget install failed. Trying manual download..." "Red"
        }
    } else {
        Write-Color "❌ winget not available. Trying manual download..." "Red"
    }
    # Manual download fallback
    $ghUrl = "https://github.com/cli/cli/releases/latest/download/gh_2.46.0_windows_amd64.msi"
    $ghMsi = "$env:TEMP\\gh-cli.msi"
    Write-Color "⬇️ Downloading gh from $ghUrl" "Cyan"
    try {
        Invoke-WebRequest -Uri $ghUrl -OutFile $ghMsi
        # Checksum verification (SHA256 from official release)
        $expectedHash = "d41d8cd98f00b204e9800998ecf8427e" # Replace with real hash
        $actualHash = (Get-FileHash $ghMsi -Algorithm SHA256).Hash
        if ($expectedHash -ne $actualHash) {
            Write-Color "❌ Checksum verification failed!" "Red"
            Remove-Item $ghMsi
            return $false
        }
        Write-Color "✅ Checksum verified." "Green"
        Start-Process msiexec.exe -ArgumentList "/i `"$ghMsi`" /qn" -Wait
        Write-Color "✅ gh installed via MSI." "Green"
        Remove-Item $ghMsi
        return $true
    } catch {
        Write-Color "❌ Manual download/install failed." "Red"
        return $false
    }
}

if (-not $ghPath -or $broken) {
    $success = Install-GH
    if (-not $success) {
        Write-Color "❌ All install methods failed. Please install manually from https://cli.github.com/" "Red"
        exit 1
    }
}

# 7. Auto-add gh to PATH if missing
$ghExe = (Get-Command gh -ErrorAction SilentlyContinue).Source
if ($ghExe) {
    $ghDir = Split-Path $ghExe
    if ($envPath -notlike "*$ghDir*") {
        Write-Color "🔧 Adding gh to system PATH..." "Cyan"
        $newPath = "$envPath;$ghDir"
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        Write-Color "✅ gh added to PATH. You may need to restart your terminal." "Green"
    }
}

# 8. Final Validation
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Color "🎉 gh CLI is installed and available!" "Green"
    gh --version
} else {
    Write-Color "❌ gh CLI is still not available. See troubleshooting below." "Red"
}

# 9. Troubleshooting Tips
Write-Color @"
-------------------------------
Troubleshooting:
- تأكد من اتصال الإنترنت وعدم وجود قيود من جدار الحماية أو البروكسي.
- إذا كنت تستخدم بروكسي، اضبط متغيرات البيئة HTTP_PROXY و HTTPS_PROXY.
- أعد تشغيل PowerShell بعد تعديل PATH.
- تحقق من صلاحيات المسؤول إذا فشلت خطوات التثبيت.
- يمكنك دائماً تحميل gh يدوياً من https://cli.github.com/
-------------------------------
"@ "Magenta"

# 10. Rollback on failure
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Color "🔄 Rolling back PATH to previous state..." "Yellow"
    [System.Environment]::SetEnvironmentVariable("Path", (Get-Content $backupPath), "Machine")
    Write-Color "✅ PATH restored from backup." "Green"
}

# End of script