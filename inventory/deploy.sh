dotnet publish
cp -R bin/Debug/netcoreapp3.1/publish/* ../../newki-inventory-publish/
cd ../../newki-inventory-publish/
dt = $(date)
git add .
git commit -m "live"
git push origin master
cd ../inventory/inventory/
rm bin -R -f 
exec bash