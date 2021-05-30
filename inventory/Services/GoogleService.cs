using inventory.Models;
using newkilibraries;
using System;
using System.IO;
using System.Net;
using System.Text.Json;

namespace inventory.Services
{
    public interface IGoogleService
    {
        GoogleUser Verify(string token);
    }
    public class GoogleService : IGoogleService
    {
        private const string GoogleApiTokenInfoUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={0}";
        public GoogleUser Verify(string token)
        {
            var googleResponse = new GoogleUser();
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(string.Format(GoogleApiTokenInfoUrl, token));
            request.AutomaticDecompression = DecompressionMethods.None;
            request.ContentType = "application/json";
            try
            {
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    var html = reader.ReadToEnd();
                    googleResponse = JsonSerializer.Deserialize<GoogleUser>(html);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return googleResponse;
        }
    }
}
