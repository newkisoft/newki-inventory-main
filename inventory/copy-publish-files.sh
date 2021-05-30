
dotnet nuget locals all --clear
dotnet restore 
dotnet publish
rm -R /tmp/newki-inventory-publish/
mkdir /tmp/newki-inventory-publish/
cp -R inventory/bin/Debug/netcoreapp3.1/publish/* /tmp/newki-inventory-publish/
exec bash