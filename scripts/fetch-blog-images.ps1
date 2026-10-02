# Downloads the images of the imported Medium posts into public/site/blog/medium/.
# Run once from the repo root:  powershell -ExecutionPolicy Bypass -File scripts/fetch-blog-images.ps1
# Until then the blog shows the originals from Medium (each <img> falls back to them).
$ErrorActionPreference = "Stop"
$dir = Join-Path $PSScriptRoot "..\public\site\blog\medium"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$files = @(
  @("https://cdn-images-1.medium.com/max/1600/1*D3lsIqC7s0UB-TwdAH69SQ.jpeg", "D3lsIqC7s0UB-TwdAH69SQ.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*pl9owL0H9J4JtkHTNy8lYQ.png", "pl9owL0H9J4JtkHTNy8lYQ.png"),
  @("https://cdn-images-1.medium.com/max/1600/1*wPTOqt4ZPAwW4hfAkkJdAw.png", "wPTOqt4ZPAwW4hfAkkJdAw.png"),
  @("https://cdn-images-1.medium.com/max/1600/1*JMa21-b3SXr1AJaxsBflog.png", "JMa21-b3SXr1AJaxsBflog.png"),
  @("https://cdn-images-1.medium.com/max/1600/1*UXXSPw9T22EvWPsSN4gEKg.png", "UXXSPw9T22EvWPsSN4gEKg.png"),
  @("https://cdn-images-1.medium.com/max/1600/1*iAe4Xbj7SOIpVSe6H13nuQ.jpeg", "iAe4Xbj7SOIpVSe6H13nuQ.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*iYeUIwpMmYM60XkP6K3qUQ.jpeg", "iYeUIwpMmYM60XkP6K3qUQ.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*MwAT9GcHlmkvPMQzd-nSNA.png", "MwAT9GcHlmkvPMQzd-nSNA.png"),
  @("https://cdn-images-1.medium.com/max/1600/1*PmB48agCxxpMr1NLVJq-aA.jpeg", "PmB48agCxxpMr1NLVJq-aA.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*MfCJbIlCHMUpG5liHi49Ig.jpeg", "MfCJbIlCHMUpG5liHi49Ig.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*c5JHexWulIhOc4ejk7CvXA.jpeg", "c5JHexWulIhOc4ejk7CvXA.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*LWUIk-XETMV6QQyhWmauiw.jpeg", "LWUIk-XETMV6QQyhWmauiw.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*Chki7eJhzedL-qnhMTi74w.jpeg", "Chki7eJhzedL-qnhMTi74w.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*MbxPoXYD8Ot4mVaGo15b4g.jpeg", "MbxPoXYD8Ot4mVaGo15b4g.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*TtQEJlzTyl1Iam_sCJj3OA.jpeg", "TtQEJlzTyl1Iam_sCJj3OA.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*Pw4BZsqyartT-tPvMPphjw.jpeg", "Pw4BZsqyartT-tPvMPphjw.jpeg"),
  @("https://cdn-images-1.medium.com/max/1600/1*WVH5v-FxXS9v0X6rPaDhog.jpeg", "WVH5v-FxXS9v0X6rPaDhog.jpeg")
)
foreach ($f in $files) {
  $out = Join-Path $dir $f[1]
  if (Test-Path $out) { Write-Host "have $($f[1])"; continue }
  Invoke-WebRequest -Uri $f[0] -OutFile $out -UseBasicParsing
  Write-Host "got  $($f[1])"
}
