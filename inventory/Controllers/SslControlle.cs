using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace inventory.Controllers
{
    public class SslController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet(".well-known/acme-challenge/oJJMk-C1wrVQd2b77nXmz-5FV1JeDTb5ZZPQyaDR25M")]
        public string WellKnown()
        {
            return "oJJMk-C1wrVQd2b77nXmz-5FV1JeDTb5ZZPQyaDR25M.fkYpexOVEe00RYOTb4aNyCU9VPdUBCGWQg6FK2UmZqA";
        }

        [HttpGet(".well-known/acme-challenge/d_nOO6Icr5DUZYHaR50RR-68UynNYCqu1VA_VKZnvwQ")]
        public string WellKnown2()
        {
            return "d_nOO6Icr5DUZYHaR50RR-68UynNYCqu1VA_VKZnvwQ.IKm-0asGKhkfw-FgPOe4X3o7UrL1W-q0V0a5XIW1vm4";

        }

    }
}
