using Amazon;
using Amazon.DynamoDBv2;
using Amazon.Runtime;
using inventory.Services;

namespace inventory.Data
{
     public interface IDynamoDbContext
    {
        AmazonDynamoDBClient GetClient();
    }
    public class DynamoDbContext :IDynamoDbContext
    {
        public IDynamoDbConfig _dynamoDbConfig;
        public DynamoDbContext(IDynamoDbConfig dynamoDbConfig)
        {
            _dynamoDbConfig = dynamoDbConfig;
        }
        public AmazonDynamoDBClient GetClient()
        {
            BasicAWSCredentials credentials = new BasicAWSCredentials(_dynamoDbConfig.AccessKey, _dynamoDbConfig.SecretKey);
            return new AmazonDynamoDBClient(credentials, RegionEndpoint.USEast1);
        }
    }
}
