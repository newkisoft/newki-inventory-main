
#Newki Software

Newki is a website built for small businesses to manage their inventory, invoices and bills. In this website we use pallets and boxes and you can change prices for each pallet and box.

Technical Info:

In these project we used:

* C#.Net ( dotnet core )
* PostgreSQL
* Linux Containers ( Ubuntu )
* Entity framework and code first
* RabbitMq to communicate as a communication channel between the website and containers
* Angular 9
* Bootstrap
* Python ( for converting to pdf report and some coding tools )
* BaGet ( for nuget libraries between projects )
* Jenkins ( for CI server )

I’ve separated containers of pallets, boxes, invoices and a few other sections of the website to make it possible to upload the new code and logic without restarting the main website. They are not microservices but each container has access to the tables that it needs. It sends and receives the messages via RabbitMq.

Each page has been built in a folder with the same name of the task in a “Views” folder. You can build and run each section separately using “npm start”.

## How to build:

All the front end and angular codes are located in Views folder

> inventory/inventory/Views/ 

And api codes are located in

> /Inventory/Controllers/Api/ 

To build the views for example for users:

<pre>sh builduser.sh </pre>

what it does is going to users folder and it will install all the npm packages and then going back to the current folder like this:

<pre>cd Views/User/User/
npm install
ng build --prod cd ../../../</pre>

all the angular files after being build are being copied to www folder

And if you want to debug the angular code, use the debug sh file for example for users:

<pre>sh debuguser.sh </pre>

PostgreSQL has been used for database but any database can be used if you prefer another relational database like Microsoft Sql or MySql. To run the database first clone the database docker git repository and run this command:

<pre>sh rundocker.sh </pre>

## Database
You can use this docker in github to create your database:

<pre>git clone https://github.com/newkisoft/newki-sql-docker.git</pre>

## Main docker

Run the main project using this docker

<pre>git clone https://github.com/newkisoft/newki-inventory-main-docker.git</pre>

## Pallet docker

Run the pallet project using this docker

<pre>git clone https://github.com/newkisoft/newki-inventory-pallet-docker.git</pre>

## Libraries

Some classes are shared betwean micro projects and the main project. I use the project below and Baget to share the classes

<pre>git clone https://github.com/newkisoft/newki-libraries.git</pre>
