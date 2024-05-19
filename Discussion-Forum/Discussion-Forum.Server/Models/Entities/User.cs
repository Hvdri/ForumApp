using Microsoft.AspNetCore.Identity;

namespace Discussion_Forum.Server.Models.Entities
{
    public class User : IdentityUser
    {
        public Guid Id { get; set; }

    }
}
