# Nimbus Terminal PowerShell Profile
# UTF-8 setup
try {
    [Console]::InputEncoding  = [System.Text.Encoding]::UTF8
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    chcp 65001 > $null
} catch {}


Clear-Host


function Prompt {
    $userHome = [Environment]::GetFolderPath("UserProfile")
    $current = (Get-Location).Path


    if ($current -eq $userHome) {
        $display = "~"
    } elseif ($current.StartsWith($userHome)) {
        $relative = $current.Substring($userHome.Length).TrimStart('\') -replace '\\','/'
        $display = "~/" + $relative
    } else {
        $display = "~"
    }


    $triangleStart = [char]0x25B2
    $triangleEnd   = [char]0x279C


    # Git branch info
    $gitSegment = ""
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $branch = $(git rev-parse --abbrev-ref HEAD 2>$null)
        if ($branch) { $gitSegment = " ($branch)" }
    }


    $promptText = "$triangleStart $display$gitSegment $triangleEnd "


    # Return it as the prompt
    return $promptText
}


# Auto-install and import posh-git
if (-not (Get-Module -ListAvailable -Name posh-git)) {
    try {
        Write-Host "Installing posh-git module..." -ForegroundColor Cyan
        Install-Module -Name posh-git -Scope CurrentUser -Force -SkipPublisherCheck -AllowClobber -ErrorAction Stop
        Write-Host "posh-git installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to install posh-git: $_" -ForegroundColor Yellow
    }
}

if (Get-Module -ListAvailable -Name posh-git) {
    Import-Module posh-git -ErrorAction SilentlyContinue
}


# Auto-install and import Terminal-Icons
if (-not (Get-Module -ListAvailable -Name Terminal-Icons)) {
    try {
        Write-Host "Installing Terminal-Icons module..." -ForegroundColor Cyan
        Install-Module -Name Terminal-Icons -Scope CurrentUser -Force -SkipPublisherCheck -AllowClobber -ErrorAction Stop
        Write-Host "Terminal-Icons installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to install Terminal-Icons: $_" -ForegroundColor Yellow
    }
}

if (Get-Module -ListAvailable -Name Terminal-Icons) {
    Import-Module -Name Terminal-Icons -ErrorAction SilentlyContinue
}
