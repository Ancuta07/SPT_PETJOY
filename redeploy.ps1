# Script pentru redeploy la Azure
# Asigura-te ca esti logat in Azure Container Registry

Write-Host "Cleaning Maven cache..." -ForegroundColor Cyan
if (Test-Path ".\server\target") {
    Remove-Item -Recurse -Force ".\server\target"
    Write-Host "Maven target folder deleted" -ForegroundColor Green
}

Write-Host "`nBuilding Docker images..." -ForegroundColor Cyan

# Build server (fara cache)
Write-Host "`nBuilding server image..." -ForegroundColor Yellow
docker build --no-cache -t myproject.azurecr.io/server:latest ./server

# Build client (fara cache)
Write-Host "`nBuilding client image..." -ForegroundColor Yellow
docker build --no-cache -t myproject.azurecr.io/client:latest ./client

# Login to ACR (daca nu esti deja logat)
Write-Host "`nLogging in to Azure Container Registry..." -ForegroundColor Cyan
az acr login --name myproject

# Push images
Write-Host "`nPushing server image..." -ForegroundColor Yellow
docker push myproject.azurecr.io/server:latest

Write-Host "`nPushing client image..." -ForegroundColor Yellow
docker push myproject.azurecr.io/client:latest

Write-Host "`nImages pushed successfully!" -ForegroundColor Green

# Update Container Apps pentru a trage noile imagini
Write-Host "`nUpdating backend container app..." -ForegroundColor Cyan
# az containerapp update --name petjoy-backend --resource-group myproject

Write-Host "`nUpdating frontend container app..." -ForegroundColor Cyan
# az containerapp update --name petjoy-frontend --resource-group myproject

Write-Host "`nDeployment completed!" -ForegroundColor Green
