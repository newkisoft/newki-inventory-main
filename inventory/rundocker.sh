sudo docker stop $(sudo docker ps -aq -f name=inventory)
sudo docker rm $(sudo docker ps -aq -f name=inventory)
sudo docker build -t newki/inventory:1.0  .
sudo docker run --name inventory --network host -i -d newki/inventory:1.0
sudo docker exec -d -w /newki-inventory-publish/ inventory dotnet inventory.dll 
exec bash

