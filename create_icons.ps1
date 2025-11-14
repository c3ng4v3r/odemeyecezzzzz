# Icon oluşturma scripti
Add-Type -AssemblyName System.Drawing

# 16x16 icon
$bmp16 = New-Object System.Drawing.Bitmap 16, 16
$graphics16 = [System.Drawing.Graphics]::FromImage($bmp16)
$graphics16.Clear([System.Drawing.Color]::FromArgb(93, 62, 188))
$bmp16.Save("icons\icon16.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics16.Dispose()
$bmp16.Dispose()

# 48x48 icon
$bmp48 = New-Object System.Drawing.Bitmap 48, 48
$graphics48 = [System.Drawing.Graphics]::FromImage($bmp48)
$graphics48.Clear([System.Drawing.Color]::FromArgb(93, 62, 188))
$bmp48.Save("icons\icon48.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics48.Dispose()
$bmp48.Dispose()

# 128x128 icon
$bmp128 = New-Object System.Drawing.Bitmap 128, 128
$graphics128 = [System.Drawing.Graphics]::FromImage($bmp128)
$graphics128.Clear([System.Drawing.Color]::FromArgb(93, 62, 188))
$bmp128.Save("icons\icon128.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics128.Dispose()
$bmp128.Dispose()

Write-Host "Icon dosyalari basariyla olusturuldu!" -ForegroundColor Green

