using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using inventory.Data;
using inventory.Models;
using inventory.Models.ManageViewModels;
using inventory.Models.SyncfusionViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using inventory.Services;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.ChangePassword.RoleName)]
    [Route("api/ChangePassword")]
    public class ChangePasswordController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IDemo _demo;

        public ChangePasswordController(ApplicationDbContext context,
                        UserManager<ApplicationUser> userManager,
                        RoleManager<IdentityRole> roleManager,
                        IDemo demo)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _demo = demo;
        }

        // GET: api/ChangePassword
        [HttpGet]
        public IActionResult GetChangePassword()
        {
            List<ApplicationUser> Items = new List<ApplicationUser>();
            Items = _context.Users.ToList();
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }
        
        

        [HttpPost("[action]")]
        public async Task<IActionResult> Update([FromBody]ChangePasswordViewModel changePasswordViewModel)
        {
            if(_demo.IsDemo)
                return Ok();
            IdentityResult result  = new IdentityResult();
            var user = _context.Users.SingleOrDefault(x => x.UserName.Equals(User.Identity.Name));

            if (user != null &&
                changePasswordViewModel.NewPassword.Equals(changePasswordViewModel.ConfirmPassword))
            {
                result = await _userManager.ChangePasswordAsync(user, changePasswordViewModel.OldPassword, changePasswordViewModel.NewPassword);
            }

            return Ok(result.Errors);
        }
        
    }
}