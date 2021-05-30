using System.Threading.Tasks;
using inventory.Data;
using inventory.Models.AccountViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using inventory.Services;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/login")]
    public class LoginController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private IEmailSender _emailSender;

        public LoginController(ApplicationDbContext context,
                        UserManager<ApplicationUser> userManager,
                        IEmailSender emailSender)
        {
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;
        }

        [HttpGet("forgotpassword")]    
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);            
            var title = $"Password Reset NewKi";
            var body = $"<strong>Reset password<strong/>";            
            body = $"{body} If it is not you trying to reset your password please ignore this email <br/>";
            body = $"{body}Reset link:<a href=\"http://0.0.0.0:4001/api/login/resetpassword?email={email}&token={token}&newpassword=test\">Reset now</a><br/>";
            await _emailSender.SendAsync(title, body);
            return Ok();
        }

        [HttpPost("resetpassword")]    
        public async Task<IActionResult> ResetPassword(ForgotPasswordViewModel forgotPassword)
        {
            var user = await _userManager.FindByEmailAsync(forgotPassword.Email);
            var result = await _userManager.ResetPasswordAsync(user, forgotPassword.Token, forgotPassword.Password);
            return Ok(result.Succeeded);
        }
        
       
    }
}