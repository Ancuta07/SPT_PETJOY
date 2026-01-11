# Script pentru a sterge si recrea Container Apps
Write-Host "STERG SI RECREEZ CONTAINERELE..." -ForegroundColor Red

$resourceGroup = "myproject"
$location = "westeurope"
$environment = "petjoy-env"
$acrName = "myproject"
$backendUrl = "petjoy-backend.icydune-f8527710.westeurope.azurecontainerapps.io"

# 1. STERGE containerele existente
Write-Host "`nSterg backend..." -ForegroundColor Yellow
az containerapp delete --name petjoy-backend --resource-group $resourceGroup --yes

Write-Host "`nSterg frontend..." -ForegroundColor Yellow
az containerapp delete --name petjoy-frontend --resource-group $resourceGroup --yes

Write-Host "`nContainere sterse!" -ForegroundColor Green

# 2. CREEAZA BACKEND
Write-Host "`nCreez backend cu baza de date Azure..." -ForegroundColor Cyan
az containerapp create `
  --name petjoy-backend `
  --resource-group $resourceGroup `
  --environment $environment `
  --image "$acrName.azurecr.io/server:latest" `
  --target-port 8000 `
  --ingress external `
  --registry-server "$acrName.azurecr.io" `
  --env-vars `
    "SPRING_DATASOURCE_URL=jdbc:mysql://petjoy-mysql.mysql.database.azure.com:3306/pet_joy_db?allowPublicKeyRetrieval=true&useSSL=true&serverTimezone=UTC" `
    "SPRING_DATASOURCE_USERNAME=petjoy_user@petjoy-mysql" `
    "SPRING_DATASOURCE_PASSWORD=Parola123!" `
  --cpu 0.5 --memory 1.0Gi

Write-Host "`nBackend creat!" -ForegroundColor Green

# 3. CREEAZA FRONTEND
Write-Host "`nCreez frontend..." -ForegroundColor Cyan
az containerapp create `
  --name petjoy-frontend `
  --resource-group $resourceGroup `
  --environment $environment `
  --image "$acrName.azurecr.io/client:latest" `
  --target-port 80 `
  --ingress external `
  --registry-server "$acrName.azurecr.io" `
  --cpu 0.25 --memory 0.5Gi

Write-Host "`nFrontend creat!" -ForegroundColor Green

# 4. Afiseaza URL-urile
Write-Host "`n=== GATA! ===" -ForegroundColor Green
Write-Host "`nBackend URL:" -ForegroundColor Cyan
az containerapp show --name petjoy-backend --resource-group $resourceGroup --query properties.configuration.ingress.fqdn -o tsv

Write-Host "`nFrontend URL:" -ForegroundColor Cyan
az containerapp show --name petjoy-frontend --resource-group $resourceGroup --query properties.configuration.ingress.fqdn -o tsv
