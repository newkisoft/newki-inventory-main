using System.Collections.Generic;
using System.Threading.Tasks;
using inventory.Models;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using System.Reflection;
using System;
using System.Linq;

namespace inventory.Data
{
    public interface ICatalogueColorTable
    {
        void Insert(CatalogueColor catalogueColor);
        Task<List<CatalogueColor>> GetItems();
        Task<CatalogueColor> GetColor(string code);
        void Update(CatalogueColor catalogueColor);
        void CreateTable();
        void Delete(CatalogueColor catalogueColor);
        void DeleteTable();
    }

    public class CatalogueColorTable : ICatalogueColorTable
    {
        IDynamoDbContext _context;
        Table _priceTable;
        public CatalogueColorTable(IDynamoDbContext context)
        {
            _context = context;
            CreateTable();
            _priceTable = Table.LoadTable(_context.GetClient(), "CatalogueColor");
        }

        public void CreateTable()
        {
            var client = _context.GetClient();
            List<string> currentTables = client.ListTablesAsync().Result.TableNames;
            if (!currentTables.Contains("CatalogueColor"))
            {
                var request = new CreateTableRequest
                {
                    TableName = "CatalogueColor",
                    AttributeDefinitions = new List<AttributeDefinition>
                {
                    new AttributeDefinition
                    {
                        AttributeName = "Id",
                        AttributeType = "S"
                    },
                    new AttributeDefinition
                    {
                        AttributeName = "ColorCode",
                        AttributeType = "S"
                    }
                },
                    KeySchema = new List<KeySchemaElement>
                {
                    new KeySchemaElement
                    {
                        AttributeName = "Id",
                        KeyType = "HASH"
                    },
                    new KeySchemaElement
                    {
                        AttributeName = "ColorCode",
                        KeyType = "RANGE"
                    },
                },
                    ProvisionedThroughput = new ProvisionedThroughput
                    {
                        ReadCapacityUnits = 5,
                        WriteCapacityUnits = 5
                    }
                };
                try
                {
                    client.CreateTableAsync(request).Wait();
                }
                catch (ArgumentException ex1)
                {
                    Console.WriteLine(ex1.Message);
                }
                catch (AggregateException ex2)
                {
                    Console.WriteLine(ex2.Message);
                }

            }
        }
        public void Insert(CatalogueColor catalogueColor)
        {
            catalogueColor.Id = catalogueColor.ColorCode;
            var document = new Document();

            foreach (var prop in GetProperties())
            {
                var value = catalogueColor.GetType()
                                      .GetProperty(prop.Name).GetValue(catalogueColor);

                document[prop.Name] = value != null ? value.ToString() : string.Empty;
            }

            _priceTable.PutItemAsync(document);
        }

        public async Task<List<CatalogueColor>> GetItems()
        {
            var colors = new List<CatalogueColor>();
            var filter = new ScanFilter();
            filter.AddCondition("ColorCode", ScanOperator.IsNotNull);
            var search = _priceTable.Scan(filter);
            do
            {
                var documents = await search.GetNextSetAsync();
                var cnt = 0;
                foreach (var document in documents)
                {
                    var catalogueColor = new CatalogueColor();
                    if (document.Keys.Contains("ColorCode"))
                        catalogueColor.ColorCode = document["ColorCode"];
                    if (document.Keys.Contains("Color"))
                        catalogueColor.Color = document["Color"];
                    if (document.Keys.Contains("Catalogue"))
                        catalogueColor.Catalogue = document["Catalogue"];
                    if (document.Keys.Contains("Comment"))
                        catalogueColor.Comment = document["Comment"];
                    if (document.Keys.Contains("Id"))
                        catalogueColor.Id = document["Id"];
                    if (document.Keys.Contains("PageNumber"))
                        catalogueColor.PageNumber = document["PageNumber"];
                    colors.Add(catalogueColor);
                    cnt++;
                }


            } while (!search.IsDone);
            return colors;
        }

        public void Update(CatalogueColor catalogueColor)
        {
            var document = new Document();
            document["ColorCode"] = catalogueColor.ColorCode;
            document["Color"] = catalogueColor.Color;
            document["Catalogue"] = catalogueColor.Catalogue;
            document["Comment"] = catalogueColor.Comment;
            document["Id"] = catalogueColor.Id;
            document["PageNumber"] = catalogueColor.PageNumber;
            _priceTable.UpdateItemAsync(document);

        }
        public void Delete(CatalogueColor catalogueColor)
        {
            var document = new Document();
            document["ColorCode"] = catalogueColor.ColorCode;
            document["Color"] = catalogueColor.Color;
            document["Catalogue"] = catalogueColor.Catalogue;
            document["Comment"] = catalogueColor.Comment;
            document["Id"] = catalogueColor.Id;
            document["PageNumber"] = catalogueColor.PageNumber;
            _priceTable.DeleteItemAsync(document);

        }
        public void DeleteTable()
        {
            var request = new DeleteTableRequest
            {
                TableName = _priceTable.TableName
            };

            var result = _context.GetClient().DeleteTableAsync(request).GetAwaiter().GetResult();
        }

        private PropertyInfo[] GetProperties()
        {
            PropertyInfo[] propertyInfos;
            propertyInfos = typeof(CatalogueColor).GetProperties();
            return propertyInfos;
        }

        public async Task<CatalogueColor> GetColor(string code)
        {
            var filter = new ScanFilter();
            filter.AddCondition("ColorCode", ScanOperator.Equal, code);
            var search = _priceTable.Scan(filter);
            var documents = await search.GetNextSetAsync();
            var catalogueColor = new CatalogueColor();
            foreach (var document in documents)
            {
                if (document.Keys.Contains("ColorCode"))
                    catalogueColor.ColorCode = document["ColorCode"];
                if (document.Keys.Contains("Color"))
                    catalogueColor.Color = document["Color"];
                if (document.Keys.Contains("Catalogue"))
                    catalogueColor.Catalogue = document["Catalogue"];
                if (document.Keys.Contains("Comment"))
                    catalogueColor.Comment = document["Comment"];
                if (document.Keys.Contains("Id"))
                    catalogueColor.Id = document["Id"];
                if (document.Keys.Contains("PageNumber"))
                    catalogueColor.PageNumber = document["PageNumber"];
                break;
            }
            return catalogueColor;
        }
    }
}