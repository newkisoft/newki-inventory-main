using Microsoft.AspNetCore.Mvc;

namespace inventory.Controllers.Api
{

    [Produces("application/json")]
    [Route("api/Check")]
    public class CheckController : Controller
    {

        public CheckController()
        {
        }

        // GET: api/Agents
        [HttpGet]
        public IActionResult Login()
        {
            if(User.Identity.IsAuthenticated)
                return Ok(true);            
            return Ok(false);
        }

       
    }
}