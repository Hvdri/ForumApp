using Discussion_Forum.Server.Database;
using Discussion_Forum.Server.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Discussion_Forum.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ForumDbContext _context;
        private readonly UserManager<User> _userManager;

        public UserController(ForumDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet, Authorize]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("{id}"), Authorize]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("current"), Authorize]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var obfuscatedUser = new ObfuscatedUser();
            obfuscatedUser.Id = userId;
            obfuscatedUser.Email = user.Email;
            obfuscatedUser.Name = user.UserName;
            obfuscatedUser.Roles = await _userManager.GetRolesAsync(user);
            
            return Ok(obfuscatedUser);
        }

        class ObfuscatedUser
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public IList<string> Roles { get; set; }
        }
    }
}
