using System;
using System.Text.Json;
using inventory.Data;
using inventory.Models;
using newkilibraries;

namespace inventory
{
    public interface ILoggingService
    {
        void Log(string user, LogAction logAction, object description);
    }
    public enum LogAction
    {
        INSERT,
        DELETE,
        UPDATE
    }
    public class LoggingService : ILoggingService
    {
        public ApplicationDbContext _context;
        public LoggingService(ApplicationDbContext context)
        {
            _context = context;
        }
        public void Log(string user, LogAction logAction, object description)
        {
            var newLog = new DatabaseLog();
            newLog.EntryDate = DateTimeOffset.Now;
            var options = new JsonSerializerOptions()
            {
                MaxDepth = 10,
                IgnoreNullValues = true,
                IgnoreReadOnlyProperties = true
            };

            var serilazedDescription = JsonSerializer.Serialize(description, options);
            newLog.Description = $"user:{user},{logAction},{serilazedDescription}";
            _context.DatabaseLogs.Add(newLog);
            _context.SaveChanges();
        }
    }
}
