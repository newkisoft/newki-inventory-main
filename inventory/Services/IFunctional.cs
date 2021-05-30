using System.Threading.Tasks;

namespace inventory.Services
{
    public interface IFunctional
    {
   
        Task CreateDefaultSuperAdmin();

        Task SendEmailBySendGridAsync(string apiKey, 
            string fromEmail, 
            string fromFullName, 
            string subject, 
            string message, 
            string email);

        Task SendEmailByGmailAsync(string fromEmail,
            string fromFullName,
            string subject,
            string messageBody,
            string toEmail,
            string toFullName,
            string smtpUser,
            string smtpPassword,
            string smtpHost,
            int smtpPort,
            bool smtpSSL);

    }
}
