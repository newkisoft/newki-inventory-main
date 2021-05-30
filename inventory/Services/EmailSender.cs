using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace inventory.Services
{
    public interface IEmailSender
    {
        Task SendAsync(string title,string body);
    }
    public class EmailSender : IEmailSender
    {
        private ISendGridOptions _sendGrid;
        public EmailSender(ISendGridOptions sendGrid)
        {
            _sendGrid = sendGrid;
        }
        public async Task SendAsync(string subject,string body)
        {
            var client = new SendGridClient(_sendGrid.SendGridKey);
            var from = new EmailAddress(_sendGrid.FromEmail, "NewKi");            
            var to = new EmailAddress(_sendGrid.FromEmail, "Info");
            var plainTextContent = "";
            var htmlContent = body;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
        private object GetPropValue(object src, string propName)
        {
            return src.GetType().GetProperty(propName).GetValue(src, null);
        }
    }
}
