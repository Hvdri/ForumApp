using Microsoft.AspNetCore.Identity;

namespace Discussion_Forum.Server.Models.Entities
{
    public class User : IdentityUser
    {
        public ICollection<Post> Posts { get; set; }
        public ICollection<Comment> Comments { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime lastLogin { get; set; }
    }
}
