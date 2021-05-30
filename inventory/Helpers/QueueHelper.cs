using Microsoft.AspNetCore.Mvc.Rendering;
using newkilibraries;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace inventory
{
    public class QueueHelper{
        static HttpClient _client = new HttpClient();
        public static void SendMessage(string queueName,InventoryMessage message)
        {
            var content = new StringContent(JsonSerializer.Serialize(message), Encoding.UTF8, "application/json");   
                     
            _client.PostAsync(
                $"http://localhost:2002/queue/{queueName}/{message.RequestNumber}", content).ContinueWith(responseTask =>
                {
                    var temp = responseTask.Result;
                });
        }

        public static async Task<InventoryMessage> ReceiveMessage(string queueName,string code)
        {     
            var response = await _client.GetAsync($"http://localhost:2002/queue/{queueName}/{code}");  
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<InventoryMessage>(content);
        }
    }
}
